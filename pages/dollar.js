import { useEffect, useState } from 'react'

import { useWeb3 } from '../contexts/useWeb3'
import { web3, setApproval } from '../utils/ethers'
import { getData } from '../utils/reserve'
import { getCurveTVL, getIncentivizerBalance } from '../utils/pools'
import { commas } from '../utils/helpers'

import useCurrentBlock from '../hooks/useCurrentBlock'
import useContractBalance from '../hooks/useContractBalance'
import useContractAllowance from '../hooks/useContractAllowance'

import {
  Box,
  Flex,
  Grid,
  Link,
  Image,
  Heading,
  Text,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Skeleton,
} from '@chakra-ui/react'
import Page from '../components/page'
import MintModal from '../components/modals/mint'
import RedeemModal from '../components/modals/redeem'
import ManageModal from '../components/modals/manage'

import contracts from '../contracts'
const { DOLLAR, USDC, RESERVE, CURVE_DSU, INCENTIVIZER_DSU } = contracts

export default function Dollar() {
  const { web3, connectWallet, disconnectWallet, account } = useWeb3()

  const [loaded, setLoaded] = useState(false)
  const [reserveData, setReserveData] = useState({})
  const [poolData, setPoolData] = useState([])

  const dollarBalance = useContractBalance(DOLLAR.address)
  const usdcBalance = useContractBalance(USDC.address, 6)
  const usdcAllowance = useContractAllowance(USDC.address, RESERVE.address)
  const dollarAllowance = useContractAllowance(DOLLAR.address, RESERVE.address)

  useEffect(async () => {
    if (account) {
      const reserve = await getData()
      const curveTVL = await getCurveTVL()

      const curveBalance = await getIncentivizerBalance(
        INCENTIVIZER_DSU,
        account
      )
      setPoolData([{ id: 'curve', tvl: curveTVL, user: curveBalance }])
      setReserveData(reserve)
      setLoaded(true)
    }
  }, [account])

  return (
    <Page
      header={'⊙ Digital Standard Unit (DSU)'}
      subheader={'Mint, redeem and stake your DSU.'}
    >
      <Box m={'-97px 0 20px'}>
        <Grid templateColumns="repeat(2, 1fr)" gap={4} m="0 0 1em">
          <Box
            bg="white"
            p="2em 4em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            flexGrow="1"
          >
            <Heading fontSize="2xl">Reserve Info</Heading>
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap="4"
              m=".5em 0 0"
              align="baseline"
            >
              <Stat>
                <StatLabel>Reserve Ratio</StatLabel>
                <Skeleton isLoaded={loaded} mr="10px">
                  <StatNumber>
                    {(reserveData.ratio * 100).toFixed(2)}%
                  </StatNumber>
                </Skeleton>
              </Stat>
              <Stat>
                <StatLabel>Assets in USDC</StatLabel>
                <Skeleton isLoaded={loaded} mr="10px">
                  <StatNumber>${commas(reserveData.balance)}</StatNumber>
                </Skeleton>
              </Stat>
              {/* <Stat>
                <StatLabel>Redeem Price</StatLabel>
                <Skeleton isLoaded={loaded} mr="10px">
                  <StatNumber>${commas(reserveData.price)}</StatNumber>
                </Skeleton>
              </Stat> */}
            </Grid>
          </Box>
          <Box
            bg="white"
            p="2em 4em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            w="auto"
          >
            <Heading fontSize="2xl" m="0em 0em 0.5em">
              Mint & Redeem DSU
            </Heading>
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap="4"
              m=".5em 0 0"
              align="baseline"
            >
              <Stat>
                <StatLabel>USDC Balance</StatLabel>
                <Skeleton isLoaded={loaded} mr="10px">
                  <StatNumber>${commas(usdcBalance)}</StatNumber>
                </Skeleton>
              </Stat>
              <Stat>
                <StatLabel>DSU Balance</StatLabel>
                <Skeleton isLoaded={loaded} mr="10px">
                  <StatNumber>ø {commas(dollarBalance)}</StatNumber>
                </Skeleton>
              </Stat>
              <MintModal balance={usdcBalance} allowance={usdcAllowance} />

              <RedeemModal
                balance={dollarBalance}
                allowance={dollarAllowance}
              />
            </Grid>
          </Box>
        </Grid>
        <Box
          bg="white"
          p="2em 4em"
          border="1px solid #e8e8e8"
          borderRadius="lg"
          m="0em 0em 1em"
        >
          <Box>
            <Heading fontSize="2xl">Provide liquidity & earn rewards</Heading>
            <Text m="1em 3em 0em 0">
              Provide tokens to selected liquidity pools to receive a reward in
              ESS.
            </Text>
          </Box>
          <Table m="1em -1.3em 0 " variant="simple">
            <Thead>
              <Tr>
                <Th>Liquidity Pool</Th>
                <Th isNumeric>Total Value Locked (TVL)</Th>
                <Th isNumeric>APY</Th>
                <Th isNumeric> </Th>
              </Tr>
            </Thead>
            {poolData[0] ? (
              <Tbody>
                <Tr>
                  <Td>
                    <Flex align="center">
                      <Image src="/logo/uni.svg" w="24px" m="0 10px 0 0" />
                      Uniswap ESD-USDC
                    </Flex>
                  </Td>
                  <Td isNumeric>$5,030,200 USD</Td>
                  <Td isNumeric>??</Td>
                  <Th isNumeric>
                    {' '}
                    <Button colorScheme="green">Manage LP</Button>
                  </Th>
                </Tr>
                {/* <Tr>
                <Td>
                  <Flex align="center">
                    <Image src="/logo/sushi.svg" w="24px" m="0 10px 0 0" />
                    Sushiswap ESDS-ETH
                  </Flex>
                </Td>
                <Td isNumeric>$9,230,200 USD</Td>
                <Td isNumeric>43.40%</Td>
                <Th isNumeric>
                  <Button colorScheme="green">Manage LP</Button>
                </Th>
              </Tr> */}
                <Tr>
                  <Td>
                    <Flex>
                      <Image src="/logo/crv.svg" w="24px" m="0 10px 0 0" />{' '}
                      Curve ESD-3CRV
                    </Flex>
                  </Td>
                  <Td isNumeric>${commas(poolData[0].tvl)} USD</Td>
                  <Td isNumeric>??</Td>
                  <Th isNumeric>
                    <ManageModal
                      pool={CURVE_DSU}
                      incentivizer={INCENTIVIZER_DSU}
                      symbol="DSU3CRV"
                      user={poolData[0].user}
                    />
                  </Th>
                </Tr>
              </Tbody>
            ) : null}
          </Table>
        </Box>
        {/* <Box
          bg="white"
          p="2em 4em"
          border="1px solid #e8e8e8"
          borderRadius="lg"
          m="0em 0em 1em"
        >
          <Grid templateColumns="repeat(2, 1fr)" gap="4" m=".5em 0 0">
            <Box>
              <Heading fontSize="2xl">Earn up to 15% APY on your ESD</Heading>
              <Text m="1em 3em 0em 0">
                Using the Incentivizer you can earn up to 15% APY on your
                deposited ESD. Variable rate without lock up periods.
              </Text>
              <Text m="1em 0em 0em">
                Learn more about the Incentivizer in our{' '}
                <Link>documentation</Link>.
              </Text>
            </Box>
            <Box>
              <Text fontSize="lg">Incentivizer Balance</Text>
              <Grid
                templateColumns="repeat(2, 1fr)"
                gap="4"
                m=".5em 0 0"
                align="baseline"
              >
                <Stat>
                  <StatLabel>Deposited ESD</StatLabel>
                  <StatNumber>ø 13,000</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Estimated APY </StatLabel>
                  <StatNumber>14.83%</StatNumber>
                </Stat>
                <Button colorScheme="green">Deposit ESD</Button>
                <Button colorScheme="green">Withdraw ESD</Button>
              </Grid>
            </Box>
          </Grid>
        </Box> */}
      </Box>
    </Page>
  )
}
