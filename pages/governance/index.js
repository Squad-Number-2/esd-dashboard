import { useEffect, useState } from 'react'
import styled from 'styled-components'

import Page from '../../components/page'

import { useWeb3 } from '../../contexts/useWeb3'
import { zeroAddress } from '../../utils/ethers'
import { commas } from '../../utils/helpers'
import DelegateModal from '../../components/modals/delegate'
import { useRouter } from 'next/router'

import useViewport from '../../hooks/useViewport'

import {
  fetchProposals,
  fetchDelegate,
  fetchDelegations,
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

export default function Home() {
  const { web3, connectWallet, disconnectWallet, account, status } = useWeb3()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [delegations, setDelegations] = useState([])
  const [proposals, setProposals] = useState([])
  const [delegate, setDelegate] = useState(false)

  const { width } = useViewport()

  useEffect(async () => {
    console.log('Fetching Proposals')
    setProposals((await fetchProposals()).reverse())
    setDelegations(await fetchDelegations())
    setLoading(false)
  }, [])

  useEffect(async () => {
    if (account && status === 'connected') {
      console.log('Fetching Delegate')
      const info = await fetchDelegate(account)
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

  const usersDelegate = () => {
    if (account === delegate) {
      return 'Self'
    } else if (delegate != '') {
      return delegate.slice(0, 5) + '...' + delegate.slice(-6, -1)
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
            <Heading fontSize="xl">Your Wallet</Heading>
            {delegate != zeroAddress && account ? (
              <Box p="1em 0">
                <Heading fontSize="md">Voting Weight:</Heading>
                <Skeleton isLoaded={delegations[0]} mr="10px">
                  <Text>{commas(voteWeight())} ESS</Text>
                </Skeleton>
                <Divider m=".5em" />
                <Heading fontSize="md">Delegating to:</Heading>
                <Skeleton isLoaded={delegate} mr="10px">
                  <Text m="0 0 .5em">{usersDelegate()}</Text>
                </Skeleton>
                <Flex
                  justifyContent="space-between"
                  flexDirection={['column', 'row']}
                >
                  <DelegateModal account={account} />
                  {account === delegate ? (
                    <Button
                      mt={['.5em', 0]}
                      colorScheme="green"
                      isDisabled={width < 960 ? true : false}
                      onClick={() => router.push('/governance/propose')}
                    >
                      Propose
                    </Button>
                  ) : null}
                </Flex>
              </Box>
            ) : (
              <Box p="1em 0">
                <Heading m="0 0 .5em" fontSize="lg">
                  Delegate your vote
                </Heading>
                <Text m="0 0 .5em">
                  In order to cast a vote, you need to delegate your ESS to an
                  address. To do this you need to choose either your own wallet
                  or another wallet to vote on your behalf.
                </Text>
                <DelegateModal account={account} />
              </Box>
            )}
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
      </Box>
    </Page>
  )
}
