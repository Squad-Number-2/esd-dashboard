import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Row, Column } from '../../components/helpers'
import Page from '../../components/page'

import { useWeb3 } from '../../contexts/useWeb3'
import { zeroAddress } from '../../utils/ethers'

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
  const { web3, connectWallet, disconnectWallet, account } = useWeb3()

  const [delegations, setDelegations] = useState([])
  const [proposals, setProposals] = useState([])
  const [delegate, setDelegate] = useState('')

  useEffect(async () => {
    console.log('Fetching Proposals')
    setProposals(await fetchProposals())
    setDelegations(await fetchDelegations())
  }, [])

  useEffect(async () => {
    console.log('Fetching Delegate')
    setDelegate(await fetchDelegate(account))
    console.log(await fetchDelegate(account))
  }, [account])

  const voteWeight = () => {
    if (account && delegations[0]) {
      try {
        return delegations.find((item) => account === item.delegate).vote_weight
      } catch (error) {
        return '0.0000'
      }
    }
  }

  const usersDelegate = () => {
    if (account === delegate) {
      return 'Self'
    } else if (delegate != '') {
      return delegate
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
                <Heading fontSize="lg">Voting weight</Heading>
                <Text>{voteWeight()} ESDS</Text>
                <Divider />
                <Heading fontSize="lg">Delegating to:</Heading>
                <Text>{usersDelegate()}</Text>
              </Box>
            ) : (
              <Box p="1em 0">
                <Heading fontSize="lg">Delegate your vote</Heading>
                <Text>
                  In order to vote you need to delegate your vote weight. To do
                  this you need to either choose your own wallet or another
                  wallet to vote on your behalf.
                </Text>
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
              <Link key={id + 'prop'} href={`/governance/proposal/${prop.id}`}>
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
