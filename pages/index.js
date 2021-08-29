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
      header={'Welcome to the Empty Set DAO'}
      subheader={'Manage, trade, and govern the Empty Set Protocol'}
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
                  Migrate ESD V1 tokens to Empty Set V2.
                </Heading>
                <Text m="1em 0em 0em">
                  Empty Set has recently upgraded. Click the migrate button to
                  burn your ESD V1 tokens and receive the equivalent ESS. This
                  process is irreversible.
                </Text>
              </Box>
              <Box w="50%">
                <Heading fontSize="lg">Your V1 Balance</Heading>
                <Flex m="1em 0em 0em">
                  <Stat w="fit-content">
                    <StatLabel>Wallet ESD</StatLabel>
                    <Skeleton isLoaded={oldDollarBalance} mr="10px">
                      <StatNumber>ø {commas(oldDollarBalance)}</StatNumber>
                    </Skeleton>
                  </Stat>
                  <Stat>
                    <StatLabel>Bonded ESD (ESDS)</StatLabel>
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

        <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={4}>
          {account ? (
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
                  <StatLabel>Digital Standard Unit (DSU)</StatLabel>
                  <Skeleton isLoaded={dollarBalance} mr="10px">
                    <StatNumber>⊙ {commas(dollarBalance)}</StatNumber>
                  </Skeleton>
                </Stat>
                <Stat>
                  <StatLabel>Empty Set Share (ESS)</StatLabel>
                  <Skeleton isLoaded={stakeBalance} mr="10px">
                    <StatNumber>ø {commas(stakeBalance)}</StatNumber>
                  </Skeleton>
                </Stat>
              </Flex>
            </Box>
          ) : (
            <Box
              bg="white"
              p="2em 4em"
              border="1px solid #e8e8e8"
              borderRadius="lg"
              flexGrow="1"
            >
              <Heading fontSize="2xl">Connect your wallet.</Heading>
              <Flex m=".5em 0 0">
                <Stat>
                  <Skeleton isLoaded={false} mr="10px">
                    <StatNumber>ø {commas(dollarBalance)}</StatNumber>
                  </Skeleton>
                </Stat>
                <Stat>
                  <Skeleton isLoaded={false} mr="10px">
                    <StatNumber>ø {commas(stakeBalance)}</StatNumber>
                  </Skeleton>
                </Stat>
              </Flex>
              <Flex m=".5em 0 0">
                <Stat>
                  <Skeleton isLoaded={false} mr="10px">
                    <StatNumber>ø {commas(dollarBalance)}</StatNumber>
                  </Skeleton>
                </Stat>
                <Stat>
                  <Skeleton isLoaded={false} mr="10px">
                    <StatNumber>ø {commas(stakeBalance)}</StatNumber>
                  </Skeleton>
                </Stat>
              </Flex>
            </Box>
          )}

          <Box
            bg="white"
            p="2em 4em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            w="auto"
          >
            <Heading fontSize="2xl" m="0em 0em 0.5em">
              Get Started with Empty Set
            </Heading>
            <Link onClick={() => router.push('/dollar')}>
              <Text fontSize="lg" m="0em 0em 0.25em">
                Mint & Redeem DSU tokens &rarr;
              </Text>
            </Link>
            <Link onClick={() => router.push('/governance')}>
              <Text fontSize="lg" m="0em 0em 0.25em">
                Propose or vote in the governance process &rarr;
              </Text>
            </Link>
            <Link href="https://docs.emptyset.finance" isExternal={true}>
              <Text fontSize="lg" m="0em 0em 0.25em">
                Check out the documentation &rarr;
              </Text>
            </Link>
          </Box>
        </Grid>
        <MoreInfo />
      </Box>
    </Page>
  )
}
