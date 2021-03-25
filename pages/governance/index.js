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
} from '@chakra-ui/react'

export default function Home() {
  const { web3, connectWallet, disconnectWallet, account, status } = useWeb3()
  const router = useRouter()

  const [delegations, setDelegations] = useState([])
  const [proposals, setProposals] = useState([])
  const [delegate, setDelegate] = useState('')

  useEffect(async () => {
    console.log('Fetching Proposals')
    setProposals(await fetchProposals())
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
            {delegate != zeroAddress ? (
              <Box p="1em 0">
                <Heading fontSize="md">Voting Weight:</Heading>
                <Text>{commas(voteWeight())} ESDS</Text>
                <Divider m=".5em" />
                <Heading fontSize="md">Delegating to:</Heading>
                <Text m="0 0 .5em">{usersDelegate()}</Text>
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
            {proposals.map((prop, id) => (
              <Link
                key={id + 'prop'}
                onClick={() => router.push(`/governance/proposal/${id + 1}`)}
              >
                <Box p=".5em 0">
                  <Text fontSize="md">{prop.title}</Text>
                  <Text color="grey" fontSize="sm">
                    {prop.state}
                  </Text>
                </Box>
              </Link>
            ))}
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
