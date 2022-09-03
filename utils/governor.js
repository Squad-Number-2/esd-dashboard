import { Contract, Provider } from 'ethers-multicall'
import { ethers } from 'ethers'
import fetch from 'isomorphic-fetch'
import contracts from '../contracts'
const { GOVERNORALPHA, GOVERNORALPHA_OLD, STAKE } = contracts()
import { web3 } from '../utils/ethers'

const enumerateProposalState = (state) => {
  const proposalStates = [
    'Pending',
    'Active',
    'Canceled',
    'Defeated',
    'Succeeded',
    'Queued',
    'Expired',
    'Executed'
  ]
  return proposalStates[state]
}

export const fetchAllProposals = async () => {
  const oldProps = await fetchProposals(GOVERNORALPHA_OLD)
  const props = await fetchProposals(GOVERNORALPHA)
  return [...oldProps.slice(0, 3), ...props] // hardcode 3 prop count
}

export const getPropCount = async () => {
  const gov = new ethers.Contract(
    GOVERNORALPHA.address,
    GOVERNORALPHA.abi,
    web3
  )
  const newCount = parseInt(await gov.proposalCount())
  return newCount + 3 // old count we want to show
}

export const fetchProposals = async (contract) => {
  // Multicall
  const multi = new Provider(web3)
  await multi.init() // Only required when `chainId` is not provided in the `Provider` constructor

  // Governor Single
  const gov = new ethers.Contract(contract.address, contract.abi, web3)

  // Governor Multi
  const govMulti = new Contract(contract.address, contract.abi)

  const proposalCount = parseInt(await gov.proposalCount())

  if (proposalCount === 0) return []
  const proposalGets = []
  const proposalStateGets = []
  Array(proposalCount)
    .fill('x')
    .map((_, i) => {
      proposalGets.push(govMulti.proposals(i + 1))
      proposalStateGets.push(govMulti.state(i + 1))
    })

  const proposals = await multi.all(proposalGets)
  const proposalStates = await multi.all(proposalStateGets)

  const propFilter = gov.filters.ProposalCreated()
  const proposalCreatedEvents = await gov.queryFilter(propFilter, 0, 'latest')

  let data = []
  proposals.map((p, i) => {
    const { description } = proposalCreatedEvents[i].args
    let prop = {}
    prop.title = description.split(/# |\n/g)[1] || 'Untitled'
    prop.description = description.split(/# |\n/g)[2] || 'No description.'
    prop.state = enumerateProposalState(proposalStates[i])
    prop.for_votes = (parseFloat(p.forVotes) / 1e18).toFixed(2)
    prop.against_votes = (parseFloat(p.againstVotes) / 1e18).toFixed(2)
    prop.id = i
    prop.eta = parseInt(p.eta)
    prop.startBlock = p.startBlock.toNumber()
    prop.endBlock = p.endBlock.toNumber()
    data.push(prop)
  })

  return data
}

export const fetchSingleProposal = async (propId) => {
  // Check if the propsal's index is on the new govenor
  let id = propId
  let gov
  const govOld = new ethers.Contract(
    GOVERNORALPHA_OLD.address,
    GOVERNORALPHA_OLD.abi,
    web3
  )
  const oldCount = 3

  if (id > oldCount) {
    id = id - oldCount
    gov = new ethers.Contract(GOVERNORALPHA.address, GOVERNORALPHA.abi, web3)
  } else {
    gov = govOld
  }
  // Governor Single
  // Get state via ID
  let {
    againstVotes,
    endBlock,
    eta,
    executed,
    forVotes,
    proposer,
    startBlock
  } = await gov.proposals(id)
  const propState = await gov.state(id)

  // Get proposal content
  const propFilter = gov.filters.ProposalCreated()
  const proposalCreatedEvents = await gov.queryFilter(propFilter, 0, 'latest')
  // Select the proposal from ID
  let { description, calldatas, signatures, targets } =
    proposalCreatedEvents[id - 1].args

  // Parse votes
  const for_votes = (parseFloat(forVotes) / 1e18).toFixed(2)
  const against_votes = (parseFloat(againstVotes) / 1e18).toFixed(2)

  // Get actions
  const actions = targets.map((_, i) => {
    return {
      target: targets[i],
      calldata: calldatas[i],
      signature: signatures[i]
    }
  })

  // Break up description string for title/desc
  const splitInfo = description.split(/# |\n/g)
  return {
    title: splitInfo[1] || 'Untitled',
    description: splitInfo[2] || 'No description.',
    details: description.split('\n').slice(1).join('\n') || 'No details.',
    eta: parseInt(eta),
    startBlock: parseInt(startBlock),
    endBlock: parseInt(endBlock),
    executed,
    proposer,
    state: enumerateProposalState(propState),
    for_votes,
    against_votes,
    actions
  }
}

export const fetchAddressProfile = async (address) => {
  const data = await fetch('/api/delegate/' + address).then((res) => res.json())
  if (data.status) {
    return false
  } else {
    return data
  }
}

export const setAddressProfile = async (address, profile) => {
  const message = JSON.stringify(profile)
  const signer = web3.getSigner()
  const signature = await signer.signMessage(message)
  const response = await fetch('/api/delegate/set', {
    method: 'POST',
    body: JSON.stringify({ message, address, signature })
  }).then((res) => res.json())

  return response
}

export const fetchDelegations = async () => {
  // Token contract single
  let voteChanged
  try {
    const token = new ethers.Contract(STAKE.address, STAKE.abi, web3)
    const filter = token.filters.DelegateVotesChanged()
    voteChanged = await token.queryFilter(filter, 12909390, 'latest')
  } catch (error) {
    console.log(error)
  }

  let delegateAccounts = {}
  if (!voteChanged) return []

  voteChanged.map((event) => {
    const { delegate, newBalance } = event.args
    delegateAccounts[delegate] = newBalance
  })

  let delegates = []
  Object.keys(delegateAccounts).map((account) => {
    const voteWeight = +delegateAccounts[account]
    if (voteWeight === 0) return
    delegates.push({
      delegate: account,
      vote_weight: voteWeight
    })
  })

  delegates.sort((a, b) => {
    return a.vote_weight < b.vote_weight ? 1 : -1
  })

  delegates.forEach((d) => {
    d.vote_weight = parseFloat((d.vote_weight / 1e18).toFixedNoRounding(2))
  })

  const profiles = await Promise.all(
    delegates.map(async (item, i) => fetchAddressProfile(item.delegate))
  )
  profiles.map((prof, i) => (delegates[i].profile = prof))
  return delegates
}

export const fetchDelegate = async (address) => {
  console.log('Fetching delegate for: ', address)
  // Token contract single
  try {
    const token = new ethers.Contract(STAKE.address, STAKE.abi, web3)
    return await token.delegates(address)
  } catch (e) {
    return false
  }
}

export const setDelegate = async (address) => {
  const signer = web3.getSigner()
  // Token contract single
  const token = new ethers.Contract(STAKE.address, STAKE.abi, signer)

  try {
    const response = await token.delegate(address)
    return response
  } catch (e) {
    // Parse Error & hit notification lib
    return
  }
}

export const castVote = async (proposal, vote) => {
  if (!proposal) throw 'You must provide a proposal ID'
  // Token contract single
  const signer = web3.getSigner()

  const gov = new ethers.Contract(
    GOVERNORALPHA.address,
    GOVERNORALPHA.abi,
    signer
  )
  return await gov.castVote(proposal, vote)
}

export const propose = async (targets, values, signatures, calldatas, desc) => {
  const signer = web3.getSigner()

  try {
    const gov = new ethers.Contract(
      GOVERNORALPHA.address,
      GOVERNORALPHA.abi,
      signer
    )
    return await gov.propose(targets, values, signatures, calldatas, desc)
  } catch (e) {
    console.log(e)
    return alert(e.message)
  }
}

export const queue = async (id) => {
  const signer = web3.getSigner()

  try {
    // Make sure ID is in range
    const govOld = new ethers.Contract(
      GOVERNORALPHA_OLD.address,
      GOVERNORALPHA_OLD.abi,
      web3
    )
    const oldCount = parseInt(await govOld.proposalCount())

    const gov = new ethers.Contract(
      GOVERNORALPHA.address,
      GOVERNORALPHA.abi,
      signer
    )
    return await gov.queue(id - oldCount)
  } catch (e) {
    console.log(e)
    return alert(e.message)
  }
}

export const execute = async (id) => {
  const signer = web3.getSigner()

  try {
    // Make sure ID is in range
    const govOld = new ethers.Contract(
      GOVERNORALPHA_OLD.address,
      GOVERNORALPHA_OLD.abi,
      web3
    )
    const oldCount = parseInt(await govOld.proposalCount())

    const gov = new ethers.Contract(
      GOVERNORALPHA.address,
      GOVERNORALPHA.abi,
      signer
    )
    return await gov.execute(id - oldCount)
  } catch (e) {
    console.log(e)
    return alert(e.message)
  }
}
