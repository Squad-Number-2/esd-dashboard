import { Contract, Provider } from 'ethers-multicall'
import { ethers } from 'ethers'
import contracts from '../contracts'
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
    'Executed',
  ]
  return proposalStates[state]
}

export const fetchProposals = async () => {
  // Multicall
  const multi = new Provider(web3)
  await multi.init() // Only required when `chainId` is not provided in the `Provider` constructor

  // Governor Single
  const gov = new ethers.Contract(
    contracts.governor.address,
    contracts.governor.abi,
    web3
  )
  // Governor Multi
  const govMulti = new Contract(
    contracts.governor.address,
    contracts.governor.abi
  )

  const proposalCount = parseInt(await gov.proposalCount())

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
    data.push(prop)
  })

  data.reverse()
  return data
}

export const fetchSingleProposal = async (id) => {
  // Governor Single
  const gov = new ethers.Contract(
    contracts.governor.address,
    contracts.governor.abi,
    web3
  )
  console.log(id)
  // Get state via ID
  let {
    againstVotes,
    canceled,
    endBlock,
    eta,
    executed,
    forVotes,
    proposer,
    startBlock,
  } = await gov.proposals(id)

  const propState = await gov.state(id)

  // Get proposal content
  const propFilter = gov.filters.ProposalCreated()
  const proposalCreatedEvents = await gov.queryFilter(propFilter, 0, 'latest')

  // Select the proposal from ID
  let { description } = proposalCreatedEvents[id].args

  // Parse votes
  const for_votes = (parseFloat(forVotes) / 1e18).toFixed(2)
  const against_votes = (parseFloat(againstVotes) / 1e18).toFixed(2)

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
  }
}

export const fetchDelegations = async () => {
  // Token contract single
  const token = new ethers.Contract(
    contracts.token.address,
    contracts.token.abi,
    web3
  )

  const block = await web3.getBlock()

  const filter = token.filters.DelegateVotesChanged()
  const voteChanged = await token.queryFilter(
    filter,
    block.number - 100000,
    'latest'
  )

  let delegateAccounts = {}

  voteChanged.map((event) => {
    const { delegate, newBalance } = event.args
    delegateAccounts[delegate] = newBalance
  })

  const delegates = []
  Object.keys(delegateAccounts).map((account) => {
    const voteWeight = +delegateAccounts[account]
    if (voteWeight === 0) return
    delegates.push({
      delegate: account,
      vote_weight: voteWeight,
    })
  })

  delegates.sort((a, b) => {
    return a.vote_weight < b.vote_weight ? 1 : -1
  })

  delegates.forEach((d) => {
    d.vote_weight = (d.vote_weight / 1e18).toFixed(6)
    // d.vote_weight = (100 * (d.vote_weight / 1e18 / 10000000)).toFixed(6) + '%'
  })

  console.log(delegates)
  return delegates
}

export const fetchDelegate = async (address) => {
  // Token contract single
  const token = new ethers.Contract(
    contracts.token.address,
    contracts.token.abi,
    web3
  )
  try {
    return await token.delegates(address)
  } catch (e) {
    return false
  }
}

export const setDelegate = async (address) => {
  const signer = web3.getSigner()
  // Token contract single
  const token = new ethers.Contract(
    contracts.token.address,
    contracts.token.abi,
    signer
  )

  try {
    const response = await token.delegate(address)
    return response
  } catch (e) {
    // Parse Error & hit notification lib
    return
  }
}
