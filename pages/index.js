import styled from 'styled-components'
import { Row, Column } from '../components/helpers'

import { useWeb3 } from '../contexts/useWeb3'
import { web3 } from '../utils/ethers'
import { mint } from '../utils/migration'

import { useRouter } from 'next/router'

import useContractBalance from '../hooks/useContractBalance'
import contracts from '../contracts'

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
} from '@chakra-ui/react'

const { dollar, stake, oldDao, oldDollar } = contracts

import Page from '../components/page'
import MoreInfo from '../components/moreInfo'

export default function Home() {
  const router = useRouter()

  const { web3, connectWallet, disconnectWallet, account } = useWeb3()
  const dollarBalance = useContractBalance(dollar.address)
  const stakeBalance = useContractBalance(stake.address)
  const oldDaoBalance = useContractBalance(oldDao.address)
  const oldDollarBalance = useContractBalance(oldDollar.address)

  return (
    <Page
      header={'Welcome to the Empty Set Dollar DAO'}
      subheader={'Manage, trade, and govern the your ESD.'}
    >
      <Box m={'-97px 0 20px'}>
        <Box
          bg="white"
          p="2em 4em"
          border="1px solid #e8e8e8"
          borderRadius="lg"
          m="0em 0em 1em"
        >
          <Flex>
            <Box w="60%">
              <Heading fontSize="2xl">Migrate your ESD V1 to ESD V1.5</Heading>
              <Text m="1em 0em 0em">
                ESD has recently upgraded. Connect your wallet and click the
                migrate button to burn your ESD V1 tokens and receive the
                equivalent ESDS.
              </Text>
              <Text m="1em 0em 0em">
                Learn more about the transition on <Link>our blog</Link>.
              </Text>
            </Box>
            <Box w="40%">
              <Heading fontSize="lg">Your V1 Balance</Heading>
              <Flex m="1em 0em 0em">
                <Stat>
                  <StatLabel>Dollar (ESD)</StatLabel>
                  <StatNumber>ø {oldDollarBalance}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Stake (ESDS)</StatLabel>
                  <StatNumber>ø {oldDollarBalance}</StatNumber>
                </Stat>
              </Flex>
              <br />
              <Button colorScheme="green">Migrate Now</Button>
              <Button
                colorScheme="green"
                onClick={async () => await mint(account, '100000')}
              >
                Mint oldESD
              </Button>
            </Box>
          </Flex>
        </Box>

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
                <StatNumber>ø {dollarBalance}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Stake (ESDS)</StatLabel>
                <StatNumber>ø {stakeBalance}</StatNumber>
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
            <Link href="/dollar">
              <Text fontSize="lg" m="0em 0em 0.25em">
                Mint & Redeem ESD tokens &rarr;
              </Text>
            </Link>
            <Link href="/stake">
              <Text fontSize="lg" m="0em 0em 0.25em">
                Purchase ESD share tokens to earn rewards &rarr;
              </Text>
            </Link>
            <Link href="/governance">
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

const Title = styled.h1`
  color: ${({ black }) => (black ? 'black' : 'white')};
  margin-bottom: 0px;
  font-weight: bold;
`
const CardTitle = styled.h2`
  margin: 0px;
  font-weight: bold;
`
const InfoTitle = styled.h3`
  font-weight: 400;
  margin-bottom: 10px;
  color: #00d661;
`
const Cta = styled.a`
  color: black;
  padding: 10px 0px;
`

const Subtitle = styled.p`
  color: white;
`
const ContentWrapper = styled(Column)`
  background: white;
  width: 100%;
  flex-grow: 1;
  margin: 0px 0 0;
  padding: 0 20px 50px;
  box-sizing: border-box;
`
const Infobox = styled(Column)`
  margin: 50px 0 0;
  max-width: 1200px;
  h3 {
    margin: 10px 0px 0px;
  }
  p {
    padding: 0px 10px;
    text-align: center;
    font-size: 14px;
    line-height: 32px;
  }
`
const InfoCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30px;
  flex-grow: 1;
  :last-child {
    margin-right: 0px;
  }
`

const CardRow = styled(Row)`
  width: 100%;
  max-width: 1200px;
  margin: ${({ topRow }) => (topRow ? '-97px 0 20px' : 0)};
`

const Card = styled(Column)`
  background: #ffffff;
  border: 1px solid #e8e8e8;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 34px 68px;
  margin-right: 30px;
  flex-grow: 1;
  max-width: ${({ wide }) => (wide ? '100%' : 'calc(50% - 15px)')};
  :last-child {
    margin-right: 0px;
  }
`
const Wrapper = styled(Row)`
  width: 100%;
  padding: 0px 20px;
  box-sizing: border-box;
  justify-content: center;
`
