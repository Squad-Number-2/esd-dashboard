import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useWeb3 } from '../../contexts/useWeb3'

import {
  Flex,
  Grid,
  Box,
  Link,
  Heading,
  Text,
  Button,
  Divider,
  Center,
  Skeleton,
  Badge
} from '@chakra-ui/react'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { format, formatDistance } from 'date-fns'

import Page from '../../components/page'
import Section from '../../components/section'
import DelegateModal from '../../components/modals/delegate'
import ProfileModal from '../../components/modals/profile'
import { zeroAddress } from '../../utils/ethers'
import { commas } from '../../utils/helpers'

import useViewport from '../../hooks/useViewport'

import {
  fetchAllProposals,
  fetchProposals,
  fetchDelegate,
  fetchDelegations,
  fetchAddressProfile
} from '../../utils/governor'

import contracts from '../../contracts'
const { GOVERNORALPHA, GOVERNORALPHA_OLD, STAKE } = contracts()

export default function Home() {
  const { web3, connectWallet, disconnectWallet, account, status } = useWeb3()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [totalVoteWeight, setTotalVoteWeight] = useState(0)
  const [delegations, setDelegations] = useState([])
  const [proposals, setProposals] = useState([])
  const [delegate, setDelegate] = useState(false)
  const [block, setBlock] = useState(false)

  useEffect(() => {
    const func = async () => {
      if (web3) {
        console.log('Fetching Proposals')
        setBlock(await web3.getBlock())
        setProposals((await fetchAllProposals()).reverse())
        const delegates = await fetchDelegations()
        const totalVotes = delegates
          .map((i) => parseFloat(i.vote_weight))
          .reduce((a, c) => a + c)
        setDelegations(delegates)
        setTotalVoteWeight(totalVotes)
        setLoading(false)
      }
    }
    func()
  }, [web3])

  useEffect(() => {
    const func = async () => {
      if (account && status === 'connected') {
        console.log('Fetching Delegate')
        const info = await fetchDelegate(account)
        const profile = await fetchAddressProfile(account)
        setDelegate(info)
      }
    }
    func()
  }, [account, status])

  const voteWeight = () => {
    if (account) {
      try {
        return parseFloat(
          delegations.find((item) => account === item.delegate).vote_weight
        )
      } catch (error) {
        return 0.0
      }
    } else {
      return 0
    }
  }

  const usersDelegate = (address) => {
    if (account === address) {
      return address.slice(0, 5) + '...' + ' (Yourself)'
    } else if (address != '') {
      return address.slice(0, 5) + '...' + address.slice(-6, -1)
    }
  }

  const subheading = (proposal) => {
    const now = new Date().getTime()

    switch (proposal.state) {
      case 'Cancelled':
        return 'Cancelled'
        break
      case 'Pending':
        return (
          <Text color="grey" fontSize="sm">
            <Badge colorScheme="purple">Pending</Badge>{' '}
            {` - Starts at block #${proposal.startBlock}`}
          </Text>
        )
        return
        break
      case 'Active':
        return block && proposal ? (
          <Text color="grey" fontSize="sm">
            <Badge colorScheme="green">Active</Badge>{' '}
            {`Voting ends in ${formatDistance(
              now + (proposal.endBlock - block.number) * 13000,
              now
            )}`}
          </Text>
        ) : (
          ''
        )
        break
      case 'Defeated':
        return (
          <Text color="grey" fontSize="sm">
            <Badge colorScheme="red">Defeated</Badge>
            {` - Defeated by 
          ${commas(proposal.against_votes - proposal.for_votes)}
           votes`}
          </Text>
        )
        break
      case 'Succeeded':
        return (
          <Text fontSize="sm">
            <Badge colorScheme="green" fontSize="1em">
              Succeeded
            </Badge>
            {' - Waiting for proposal to be Queued'}
          </Text>
        )
        break
      case 'Queued':
        return proposal.eta * 1000 > now ? (
          <Text fontSize="sm">
            <Badge colorScheme="pink">{`Executable in ${formatDistance(
              proposal.eta * 1000,
              now
            )}`}</Badge>
          </Text>
        ) : (
          <Text fontSize="sm">
            <Badge colorScheme="pink">Ready to Execute</Badge>
          </Text>
        )
        break
      case 'Expired':
        return (
          <Text fontSize="sm">
            <Badge colorScheme="grey">Expired</Badge>
          </Text>
        )
        break
      case 'Executed':
        return (
          <Text fontSize="sm">
            <Badge colorScheme="blue">Executed</Badge>
          </Text>
        )
        break
      default:
        break
    }
  }

  return (
    <Page
      header={'Protocol Governance'}
      subheader={
        'Propose & vote for governance actions that effect the protocol.'
      }
    >
      <Section>
        <Flex flexDirection={{ base: 'column', md: 'row' }}>
          <Box
            h="fit-content"
            w={{ base: '100%', md: '390px' }}
            minW={{ base: 'auto', md: '390px' }}
          >
            <Box mb="12">
              <Flex justifyContent="space-between" alignItems={'flex-end'}>
                <Heading fontSize="3xl" fontWeight={'400'}>
                  Your Wallet
                </Heading>
                {delegate && <ProfileModal account={account} />}
              </Flex>
              <Divider mt="2" mb="4" borderWidth={1} borderColor={'black'} />

              <Box p=".5em 0 1em">
                <Flex
                  justifyContent="space-between"
                  flexDirection={['column', 'column', 'row']}
                >
                  <Box>
                    <Text fontSize={'lg'}>Voting Weight:</Text>
                    <Skeleton isLoaded={delegations[0]} mr="10px">
                      <Text fontSize={'xl'} fontWeight={'600'}>
                        {commas(voteWeight())} ESS
                      </Text>
                    </Skeleton>
                  </Box>
                  <Box>
                    <Text fontSize={'lg'}>Delegating to:</Text>
                    <Skeleton isLoaded={delegate} mr="10px">
                      <Text fontSize={'xl'} fontWeight={'600'}>
                        {usersDelegate(delegate)}
                      </Text>
                    </Skeleton>
                    <DelegateModal account={account} />
                  </Box>
                </Flex>
              </Box>
            </Box>

            <Box>
              <Heading fontSize="3xl" fontWeight={'400'}>
                Highest Voting Weight
              </Heading>
              <Divider mt="2" mb="4" borderWidth={1} borderColor={'black'} />
              {delegations[0]
                ? delegations.slice(0, 10).map((user, i) => (
                    <Box
                      key={'prop' + i}
                      borderBottom="1px solid rbga(255,255,255,0.5)"
                      p=".5em 0"
                    >
                      <Flex w="100%" justifyContent="space-between">
                        {user.profile ? (
                          <>
                            {user.profile.twitter != '' ? (
                              <Link
                                href={`https://twitter.com/${user.profile.twitter}`}
                                isExternal
                              >
                                <Text fontSize="sm">
                                  {`${i + 1}. ${user.profile.name}`}{' '}
                                  <ExternalLinkIcon mx="5px" mb="4px" />
                                </Text>
                              </Link>
                            ) : (
                              <Text fontSize="sm">
                                {`${i + 1}. ${user.profile.name}`}
                              </Text>
                            )}
                            <Link
                              href={`https://etherscan.io/address/${user.delegate}`}
                              isExternal
                            >
                              <Text fontSize="sm">
                                {`${user.delegate.slice(0, 15)}...`}
                                <ExternalLinkIcon mx="5px" mb="4px" />
                              </Text>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              href={`https://etherscan.io/address/${user.delegate}`}
                              isExternal
                            >
                              <Text fontSize="sm">
                                {`${i + 1}. ${user.delegate.slice(0, 15)}...`}
                                <ExternalLinkIcon mx="5px" mb="4px" />
                              </Text>
                            </Link>
                          </>
                        )}
                      </Flex>
                      <Flex w="100%" justifyContent="space-between">
                        <Text color="grey" fontSize="sm">
                          {`Votes: ${commas(user.vote_weight)} ESS`}
                        </Text>
                        <Text color="grey" fontSize="sm">
                          {`${commas(
                            (parseFloat(user.vote_weight) / totalVoteWeight) *
                              100
                          )}% of Votes`}
                        </Text>
                      </Flex>
                    </Box>
                  ))
                : Array(10)
                    .fill(null)
                    .map((_, i) => (
                      <Box p=".5em 0" key={i + 'fake'}>
                        <Skeleton h="30px" w="80%" />
                      </Box>
                    ))}
            </Box>
          </Box>
          <Box w={{ base: '100%', md: 'full' }} ml={{ base: 0, md: '60px' }}>
            <Flex justifyContent="space-between" alignItems={'flex-end'}>
              <Heading fontSize="3xl" fontWeight={'400'}>
                Governance Proposals
              </Heading>
              <Link onClick={() => router.push('/governance/propose')}>
                New Proposal
              </Link>
            </Flex>
            <Divider mt="2" mb="4" borderWidth={1} borderColor={'black'} />

            {proposals[0] ? (
              proposals.map((prop, id) => (
                <Box p=".5em 0">
                  <Link
                    key={'prop' + id}
                    onClick={() =>
                      router.push(
                        `/governance/proposal/${proposals.length - id}`
                      )
                    }
                  >
                    <Text fontSize="md">{`${proposals.length - id}. ${
                      prop.title
                    }`}</Text>
                  </Link>
                  {subheading(prop)}
                </Box>
              ))
            ) : (
              <>
                {loading ? (
                  Array(6)
                    .fill(null)
                    .map((_, i) => (
                      <Box p=".5em 0" key={i + 'fake'}>
                        <Skeleton mb="10px" w="80%" h="30px" />
                        <Skeleton w="120px" h="20px" />
                      </Box>
                    ))
                ) : (
                  <Box p=".5em 0">
                    <Text fontSize="md">No proposals yet. </Text>
                    <Text color="grey" fontSize="sm">
                      Delegate your ESS and then propose a vote!
                    </Text>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Flex>
      </Section>
    </Page>
  )
}
