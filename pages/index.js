import styled from 'styled-components'

import { useWeb3 } from '../contexts/useWeb3'
import { web3 } from '../utils/ethers'
import { commas } from '../utils/helpers'

import MigrationModal from '../components/modals/migrate'

import { useRouter } from 'next/router'

import useContractBalance from '../hooks/useContractBalance'

import {
  Flex,
  Grid,
  Box,
  Center,
  Image,
  Link,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  Skeleton,
} from '@chakra-ui/react'

import contracts from '../contracts'
const { DOLLAR, STAKE, V1_DAO, V1_DOLLAR } = contracts

import Page from '../components/page'
import MoreInfo from '../components/moreInfo'

export default function Home() {
  const router = useRouter()

  const { web3, connectWallet, disconnectWallet, account } = useWeb3()
  const dollarBalance = useContractBalance(DOLLAR.address)
  const stakeBalance = useContractBalance(STAKE.address)
  const oldDaoBalance = useContractBalance(V1_DAO.address)
  const oldDollarBalance = useContractBalance(V1_DOLLAR.address)

  return (
    <Page
      header={'Welcome to the Empty Set Dollar DAO'}
      subheader={'Manage, trade, and govern the DSU'}
    >
      <Box m={'-97px 0 20px'}>
        {oldDaoBalance > 0 || oldDollarBalance > 0 ? (
          <Box
            bg="white"
            p="2em 4em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            m="0em 0em 1em"
          >
            <Flex>
              <Box w="50%" pr="10px">
                <Heading fontSize="2xl">
                  Migrate your ESD V1 to ESD V1.5
                </Heading>
                <Text m="1em 0em 0em">
                  Empty Set has recently upgraded. Connect your wallet and click
                  the migrate button to burn your ESD V1 tokens and receive the
                  equivalent ESS.
                </Text>
                <Text m="1em 0em 0em">
                  Learn more about the transition on <Link>our blog</Link>.
                </Text>
              </Box>
              <Box w="50%">
                <Heading fontSize="lg">Found V1 Balances:</Heading>
                <Text>
                  We've found ESD balances on a number of other protocols.
                  Please withdraw them to your wallet before migrating.
                </Text>
                <Flex m="1em 0em 0em">
                  <Stat w="fit-content">
                    <StatLabel>ESD/ETH Sushi: {0.0032} LP</StatLabel>
                  </Stat>
                  <Stat w="fit-content">
                    <StatLabel>ESD/USDC Uniswap V2: {0.0232} LP</StatLabel>
                  </Stat>
                </Flex>
                <Flex m=".5em 0em 0em">
                  <Stat w="fit-content">
                    <StatLabel>Cream.Fi: {commas(150087.32)} ESD</StatLabel>
                  </Stat>
                  <Stat w="fit-content">
                    <StatLabel>Saffron Finance: {0.0232} LP</StatLabel>
                  </Stat>
                </Flex>
                <br />
                <Heading fontSize="lg">Your V1 Balance</Heading>
                <Flex m="1em 0em 0em">
                  <Stat w="fit-content">
                    <StatLabel>Dollar (DSU)</StatLabel>
                    <Skeleton isLoaded={oldDollarBalance} mr="10px">
                      <StatNumber>ø {commas(oldDollarBalance)}</StatNumber>
                    </Skeleton>
                  </Stat>
                  <Stat>
                    <StatLabel>Share (ESS)</StatLabel>
                    <Skeleton isLoaded={oldDaoBalance} mr="10px">
                      <StatNumber>ø {commas(oldDaoBalance)}</StatNumber>
                    </Skeleton>
                  </Stat>
                </Flex>
                <br />
                <MigrationModal
                  account={account}
                  esd={oldDollarBalance}
                  esds={oldDaoBalance}
                />
              </Box>
            </Flex>
          </Box>
        ) : null}

        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <Box
            bg="white"
            p="2em 4em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            flexGrow="1"
          >
            <Heading fontSize="2xl">Your Balance</Heading>
            <Flex m=".5em 0 0">
              <Stat>
                <StatLabel>Dollar (ESD)</StatLabel>
                <Skeleton isLoaded={dollarBalance} mr="10px">
                  <StatNumber>ø {commas(dollarBalance)}</StatNumber>
                </Skeleton>
              </Stat>
              <Stat>
                <StatLabel>Stake (ESDS)</StatLabel>
                <Skeleton isLoaded={stakeBalance} mr="10px">
                  <StatNumber>ø {commas(stakeBalance)}</StatNumber>
                </Skeleton>
              </Stat>
            </Flex>
          </Box>
          <Box
            bg="white"
            p="2em 4em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            w="auto"
          >
            <Heading fontSize="2xl" m="0em 0em 0.5em">
              Get Started with ESD
            </Heading>
            <Link onClick={() => router.push('/dollar')}>
              <Text fontSize="lg" m="0em 0em 0.25em">
                Mint & Redeem ESD tokens &rarr;
              </Text>
            </Link>
            <Link onClick={() => router.push('/governance')}>
              <Text fontSize="lg" m="0em 0em 0.25em">
                Make a proposal or vote in the governance process &rarr;
              </Text>
            </Link>
            <Link href="https://docs.emptyset.finance" isExternal={true}>
              <Text fontSize="lg" m="0em 0em 0.25em">
                Get stuck into the documentation &rarr;
              </Text>
            </Link>
          </Box>
        </Grid>
        <MoreInfo />
      </Box>
    </Page>
  )
}
