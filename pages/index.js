import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { useWeb3 } from '../contexts/useWeb3'
import { commas } from '../utils/helpers'
import { getData, gasEstimates } from '../utils/reserve'
import { getESSPrice, getDSUPrice } from '../utils/pools'

import Page from '../components/page'
import Section from '../components/section'
import Mint from '../components/input/mint'
import Redeem from '../components/input/redeem'
import MigrationModal from '../components/modals/migrate'
import useContractBalance from '../hooks/useContractBalance'
import useContractAllowance from '../hooks/useContractAllowance'

import {
  Flex,
  Link,
  Box,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Skeleton,
  Divider,
  Grid,
  Input,
  Button
} from '@chakra-ui/react'

import contracts from '../contracts'
const { DOLLAR, STAKE, V1_DAO, V1_DOLLAR, USDC, RESERVE } = contracts

export default function Home() {
  const router = useRouter()

  const { web3, connectWallet, disconnectWallet, account } = useWeb3()
  const [reserveData, setReserveData] = useState({})
  const [estimates, setEstimates] = useState({ mint: 0, redeem: 0, approve: 0 })

  const dollarBalance = useContractBalance(DOLLAR.address)
  const stakeBalance = useContractBalance(STAKE.address)
  const usdcBalance = useContractBalance(USDC.address, 6)
  const oldDaoBalance = useContractBalance(V1_DAO.address)
  const oldDollarBalance = useContractBalance(V1_DOLLAR.address)

  const usdcAllowance = useContractAllowance(USDC.address, RESERVE.address)
  const dollarAllowance = useContractAllowance(DOLLAR.address, RESERVE.address)

  useEffect(() => {
    const setReserve = async () => {
      const reserve = await getData()
      const essPrice = await getESSPrice()
      const dsuPrice = await getDSUPrice()
      const estimates = await gasEstimates()
      setReserveData({ ...reserve, ess: essPrice, dsu: dsuPrice })
      setEstimates(estimates)
    }
    if (web3) {
      setReserve()
    }
  }, [web3])

  return (
    <Page>
      <Section>
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
        <Box w="fit-content" mb="12">
          <Heading fontSize="3xl" fontWeight={'400'}>
            Your Wallet
          </Heading>
          <Divider mt="2" mb="4" borderWidth={1} borderColor={'black'} />
          <Flex direction={{ base: 'column', md: 'row' }}>
            <DataBox
              title="Digital Standard Unit (DSU)"
              linkTitle="Trade DSU"
              link={`https://app.uniswap.org/#/swap?chain=mainnet&inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputCurrency=0x605d26fbd5be761089281d5cec2ce86eea667109`}
            >
              {commas(dollarBalance)}
            </DataBox>
            <DataBox
              title="Empty Set Share (ESS)"
              linkTitle="Trade ESS"
              link={`https://app.uniswap.org/#/swap?inputCurrency=0x24aE124c4CC33D6791F8E8B63520ed7107ac8b3e&outputCurrency=0x605D26FBd5be761089281d5cec2Ce86eeA667109&use=V2&chain=mainnet`}
            >
              {commas(stakeBalance)}
            </DataBox>
          </Flex>
        </Box>

        <Box w="fit-content" mb="12">
          <Heading fontSize="3xl" fontWeight={'400'}>
            {`Mint & Redeem DSU`}
          </Heading>
          <Divider mt="2" mb="4" borderWidth={1} borderColor={'black'} />
          <Flex direction={{ base: 'column', md: 'row' }}>
            <Mint
              balance={usdcBalance}
              allowance={usdcAllowance}
              estimates={estimates}
            />
            <Redeem
              balance={dollarBalance}
              allowance={dollarAllowance}
              estimates={estimates}
            />
          </Flex>
        </Box>

        <Box w="fit-content" mb="12">
          <Heading fontSize="3xl" fontWeight={'400'}>
            {`Protocol Overview`}
          </Heading>
          <Divider mt="2" mb="4" borderWidth={1} borderColor={'black'} />

          <Grid
            templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
            gap={6}
          >
            <DataBox title="Reserve Asset">USDC</DataBox>
            <DataBox title="Collateral Ratio">
              {(reserveData.ratio * 100).toFixed(2)}%
            </DataBox>
            <DataBox title="DSU Price">
              {' '}
              ${reserveData.dsu ? reserveData.dsu.toFixed(4) : 0}
            </DataBox>
            <DataBox title="ESS Price">
              ${reserveData.ess ? reserveData.ess.toFixed(4) : 0}
            </DataBox>
            <DataBox title="Protocol Collateral">
              ${commas(reserveData.balance)}
            </DataBox>
            <DataBox title="Protocol Revenue">
              ${commas(reserveData.revenue)}
            </DataBox>
            <DataBox title="Approved DSU">--</DataBox>
            <DataBox title="Outstanding Assets">--</DataBox>
          </Grid>
        </Box>
      </Section>
    </Page>
  )
}

const DataBox = ({ title, link, linkTitle, children }) => (
  <Box mr={5} mb={3}>
    <Text fontSize={'lg'}>{title}</Text>
    <Text py={2} fontSize={'2xl'} fontWeight={'600'}>
      {children}
    </Text>
    {link && (
      <Link href={link} target={'_blank'} fontSize={'md'}>
        {linkTitle}
        {` →`}
      </Link>
    )}
  </Box>
)
