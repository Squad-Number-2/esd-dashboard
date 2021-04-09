import { useEffect, useState } from 'react'
import styled from 'styled-components'

import Page from '../../components/page'

import { useWeb3 } from '../../contexts/useWeb3'
import { zeroAddress } from '../../utils/ethers'
import { commas } from '../../utils/helpers'
import DelegateModal from '../../components/modals/delegate'
import { useRouter } from 'next/router'

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

  const [delegations, setDelegations] = useState([])
  const [proposals, setProposals] = useState([])
  const [delegate, setDelegate] = useState(false)

  useEffect(async () => {
    console.log('Fetching Proposals')
    setProposals((await fetchProposals()).reverse())
    setDelegations(await fetchDelegations())
  }, [])

  useEffect(async () => {
    if (account && status === 'connected') {
      console.log('Fetching Delegate')
      const info = await fetchDelegate(account)
      setDelegate(info)
    }
  }, [account, status])

  const voteWeight = () => {
    if (account && delegations[0]) {
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

  const usersDelegate = () => {
    if (account === delegate) {
      return 'Self'
    } else if (delegate != '') {
      return delegate.slice(0, 5) + '...' + delegate.slice(-6, -1)
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
        <Flex>
          <Box
            bg="white"
            p="2em 4em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            h="fit-content"
            w="40%"
          >
            <Heading fontSize="xl">Your Wallet</Heading>
            {delegate != zeroAddress && account ? (
              <Box p="1em 0">
                <Heading fontSize="md">Voting Weight:</Heading>
                <Skeleton isLoaded={delegations[0]} mr="10px">
                  <Text>{commas(voteWeight())} ESDS</Text>
                </Skeleton>
                <Divider m=".5em" />
                <Heading fontSize="md">Delegating to:</Heading>
                <Skeleton isLoaded={delegate} mr="10px">
                  <Text m="0 0 .5em">{usersDelegate()}</Text>
                </Skeleton>
                <DelegateModal account={account} />
                <br />
                <Button
                  m=".5em 0"
                  colorScheme="green"
                  onClick={() => router.push('/governance/propose')}
                >
                  Propose
                </Button>
              </Box>
            ) : (
              <Box p="1em 0">
                <Heading m="0 0 .5em" fontSize="lg">
                  Delegate your vote
                </Heading>
                <Text m="0 0 .5em">
                  In order to cast a vote, you need to delegate your ESDS to an
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
            m="0 0 0 1em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            w="60%"
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
                      {prop.state}
                    </Text>
                  </Box>
                </Link>
              ))
            ) : (
              <>
                {Array(6)
                  .fill(null)
                  .map((_, i) => (
                    <Box p=".5em 0" key={i + 'fake'}>
                      <Skeleton mb="10px" w="80%" h="30px" />
                      <Skeleton w="120px" h="20px" />
                    </Box>
                  ))}
              </>
            )}
          </Box>
        </Flex>
      </Box>

      {/* <ContentWrapper ai={'center'}>
        <CardRow topRow>
         
          <Card wide>
            <CardTitle>Governance Proposals</CardTitle>
            {proposals.map((prop, id) => (
              <Link key={id + 'prop'} href={`/governance/proposal/${prop.id}`}>
                <a>
                  <InfoTitle>{prop.title}</InfoTitle>
                  <div>{prop.state}</div>
                </a>
              </Link>
            ))}
          </Card>
        </CardRow>
      </ContentWrapper> */}
    </Page>
  )
}
