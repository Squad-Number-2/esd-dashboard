import { useEffect, useState } from 'react'
import styled from 'styled-components'

import Page from '../../components/page'

import { useWeb3 } from '../../contexts/useWeb3'
import { zeroAddress } from '../../utils/ethers'
import { commas } from '../../utils/helpers'
import DelegateModal from '../../components/modals/delegate'
import ProfileModal from '../../components/modals/profile'
import { useRouter } from 'next/router'

import useViewport from '../../hooks/useViewport'

import {
  fetchProposals,
  fetchDelegate,
  fetchDelegations,
  fetchAddressProfile,
} from '../../utils/governor'

import {
  Flex,
  Grid,
  Box,
  Link,
  Heading,
  Text,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  Input,
  InputGroup,
  InputRightAddon,
  Divider,
  Center,
  Skeleton,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
export default function Home() {
  const { web3, connectWallet, disconnectWallet, account, status } = useWeb3()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [totalVoteWeight, setTotalVoteWeight] = useState(0)
  const [delegations, setDelegations] = useState([])
  const [proposals, setProposals] = useState([])
  const [delegate, setDelegate] = useState(false)

  const { width } = useViewport()

  useEffect(async () => {
    console.log('Fetching Proposals')
    setProposals((await fetchProposals()).reverse())
    const delegates = await fetchDelegations()
    const totalVotes = delegates
      .map((i) => parseFloat(i.vote_weight))
      .reduce((a, c) => a + c)
    setDelegations(delegates)
    setTotalVoteWeight(totalVotes)
    setLoading(false)
  }, [])

  useEffect(async () => {
    if (account && status === 'connected') {
      console.log('Fetching Delegate')
      const info = await fetchDelegate(account)
      const profile = await fetchAddressProfile(account)
      setDelegate(info)
    }
  }, [account, status])

  const voteWeight = () => {
    if (account && delegate) {
      try {
        return parseFloat(
          delegations.find((item) => delegate === item.delegate).vote_weight
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
      return address.slice(0, 5) + '...' + address.slice(-6, -1) + ' (Yourself)'
    } else if (address != '') {
      return address.slice(0, 5) + '...' + address.slice(-6, -1)
    }
  }

  const subheading = (proposal) => {
    switch (proposal.state) {
      case 'Cancelled':
        return 'Cancelled'
        break
      case 'Pending':
        return `Pending - Starts at #${proposal.startBlock}`
        break
      case 'Active':
        return `Active - Voting ends at #${proposal.endBlock}`
        break
      case 'Defeated':
        return (
          'Defeated by ' +
          commas(proposal.against_votes - proposal.for_votes) +
          ' votes'
        )
        break
      case 'Succeeded':
        return 'Succeeded - Waiting for proposal to be Queued'
        break
      case 'Queued':
        const now = new Date().getTime()
        return proposal.eta * 1000 > now
          ? `Queued - Executable in ${formatDistance(proposal.eta * 1000, now)}`
          : `Queued - Ready to Execute`
        break
      case 'Expired':
        return 'Expired'
        break
      case 'Executed':
        return 'Executed - Executed on '
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
      <Box m={'-97px 0 20px'}>
        <Flex flexDirection={['column', 'row']}>
          <Box
            bg="white"
            p="2em 4em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            h="fit-content"
            w={['100%', '40%']}
          >
            <>
              <Flex justifyContent="space-between">
                <Heading fontSize="lg">Your Wallet</Heading>
                <ProfileModal account={account} />
              </Flex>
              <Box p=".5em 0 1em">
                <Flex
                  justifyContent="space-between"
                  flexDirection={['column', 'column', 'row']}
                >
                  <Box>
                    <Heading fontSize="sm">Voting Weight:</Heading>
                    <Skeleton isLoaded={delegations[0]} mr="10px">
                      <Text fontSize="sm">{commas(voteWeight())} ESS</Text>
                    </Skeleton>
                  </Box>
                  <Box>
                    <Heading fontSize="sm">Delegating to:</Heading>

                    <Skeleton isLoaded={delegate} mr="10px">
                      <Text fontSize="sm" m="0 0 .5em">
                        {usersDelegate(delegate)}
                      </Text>
                    </Skeleton>
                  </Box>
                </Flex>

                <Flex
                  justifyContent="space-between"
                  flexDirection={['column', 'column', 'row']}
                  pt="3"
                >
                  <DelegateModal account={account} />

                  <Button
                    mt={['.5em', 0]}
                    colorScheme="green"
                    isDisabled={width < 960 ? true : false}
                    onClick={() => router.push('/governance/propose')}
                  >
                    Create Proposal
                  </Button>
                </Flex>
                <Divider m="1em" />
              </Box>
            </>

            <Box>
              <Heading fontSize="lg">Top Wallets by Vote Weight</Heading>

              {delegations[0]
                ? delegations.slice(0, 10).map((user, i) => (
                    <Box
                      key={'prop' + user.delegate}
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
                : null}
            </Box>
          </Box>
          <Box
            bg="white"
            p="2em 4em"
            m={['1em 0 0 0', '0 0 0 1em']}
            border="1px solid #e8e8e8"
            borderRadius="lg"
            w={['100%', '60%']}
          >
            <Heading fontSize="xl">Governance Proposals</Heading>
            {proposals[0] ? (
              proposals.map((prop, id) => (
                <Link
                  key={'prop' + prop.id}
                  onClick={() =>
                    router.push(`/governance/proposal/${prop.id + 1}`)
                  }
                >
                  <Box p=".5em 0">
                    <Text fontSize="md">{`${prop.id + 1}. ${prop.title}`}</Text>
                    <Text color="grey" fontSize="sm">
                      {subheading(prop)}
                    </Text>
                  </Box>
                </Link>
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
        {/* <Flex mt={2} flexDirection={['column', 'row']}>
          <Box w={['100%', '40%']}></Box>
          <Box
            bg="white"
            p="2em 4em"
            m={['1em 0 0 0', '0 0 0 1em']}
            border="1px solid #e8e8e8"
            borderRadius="lg"
            w={['100%', '60%']}
          >
            <Heading fontSize="xl">Top Voting Addresses</Heading>
            
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
        </Flex> */}
      </Box>
    </Page>
  )
}
