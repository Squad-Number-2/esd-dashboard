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
const { DOLLAR, STAKE, V1_DAO, V1_DOLLAR, USDC, RESERVE } = contracts()

export default function Home() {
  const router = useRouter()

  const { web3, isConnected, account } = useWeb3()
  const [reserveData, setReserveData] = useState({
    ratio: null,
    balance: null,
    revenue: null,
    ess: null,
    dsu: null,
    outstanding: null
  })
  const [estimates, setEstimates] = useState({ mint: 0, redeem: 0, approve: 0 })

  const dollarBalance = useContractBalance('DOLLAR')
  const stakeBalance = useContractBalance('STAKE')
  const usdcBalance = useContractBalance('USDC', 6)
  const oldDaoBalance = useContractBalance('V1_DAO')
  const oldDollarBalance = useContractBalance('V1_DOLLAR')

  const usdcAllowance = useContractAllowance('USDC', 'RESERVE')
  const dollarAllowance = useContractAllowance('DOLLAR', 'RESERVE')

  useEffect(() => {
    const setReserve = async () => {
      const reserve = await getData()
      console.log(reserve)

      const essPrice = web3._network.chainId === 1 ? await getESSPrice() : 0
      const dsuPrice = web3._network.chainId === 1 ? await getDSUPrice() : 0
      setReserveData({ ...reserve, ess: essPrice, dsu: dsuPrice })
      const estimates = await gasEstimates()
      setEstimates(estimates)
    }
    if (web3 && isConnected) {
      setReserve()
    }
    return () => {
      console.log('This will be logged on unmount')
    }
  }, [web3, isConnected])

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
              <Box w="70%" pr="10px">
                <Heading fontSize="2xl">
                  Migration from ESD to ESS has concluded.
                </Heading>
                <Text m="1em 0em 0em">
                  {`Following months of disucssion on the forum & discord, the 
                  Emptyset DAO voted to shutdown the migration pathway from ESD (V1) to ESS (V2). You are 
                  still able to buy, sell, & transfer your ESD but it can not be migrated to ESS nor does it 
                  have voting rights in the current DAO.`}
                </Text>
              </Box>
              <Box
                w="30%"
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'space-around'}
              >
                <Link href={'/governance/proposal/5'}>
                  <Heading fontSize="lg">{`Governance Vote →`} </Heading>
                </Link>

                <Link
                  href={
                    'https://www.emptyset.xyz/t/close-esd-ess-migration-pathway/347'
                  }
                  target={'_blank'}
                >
                  <Heading fontSize="lg">{`EIP Discussion →`} </Heading>
                </Link>
                <Link
                  href={
                    'https://app.uniswap.org/#/swap?inputCurrency=0x36f3fd68e7325a35eb768f1aedaae9ea0689d723&outputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&chain=mainnet'
                  }
                  target={'_blank'}
                >
                  <Heading fontSize="lg">{`Trade ESD →`} </Heading>
                </Link>
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
              {reserveData.dsu ? `$${reserveData.dsu.toFixed(4)}` : '--'}
            </DataBox>
            <DataBox title="ESS Price">
              {reserveData.ess ? `$${reserveData.ess.toFixed(4)}` : '--'}
            </DataBox>
            <DataBox title="Protocol Collateral">
              {reserveData.balance ? `$${commas(reserveData.balance)}` : '--'}
            </DataBox>
            <DataBox title="Protocol Revenue">
              {reserveData.revenue
                ? `$${commas(Math.abs(reserveData.revenue))}`
                : '--'}
            </DataBox>
            <DataBox title="Low Gas Mintable">
              {reserveData.outstanding
                ? `${commas(reserveData.debt - reserveData.outstanding)}`
                : '--'}
            </DataBox>
            <DataBox title="Outstanding Assets">
              {reserveData.outstanding
                ? `${commas(reserveData.outstanding)} USDC`
                : '--'}
            </DataBox>
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
