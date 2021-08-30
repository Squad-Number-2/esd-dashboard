import { useEffect, useState } from 'react'

import { useWeb3 } from '../contexts/useWeb3'
import { web3, setApproval, getSupply } from '../utils/ethers'
import { getData } from '../utils/reserve'

import { commas } from '../utils/helpers'

import useCurrentBlock from '../hooks/useCurrentBlock'
import useContractBalance from '../hooks/useContractBalance'
import useContractAllowance from '../hooks/useContractAllowance'
import useViewport from '../hooks/useViewport'

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
import ManageV3Modal from '../components/modals/managev3'
import {
  getCurveTVL,
  getIncentivizerBalance,
  getUniPoolBalance,
  getESSPrice,
  getIncentivizeRewards,
  findNFTByPool,
  findV3Incentives,
  getV3DsuTvl,
} from '../utils/pools'

import contracts from '../contracts'
const {
  DOLLAR,
  USDC,
  RESERVE,
  CURVE_DSU,
  UNISWAP_DSU_ESS,
  INCENTIVIZER_DSU,
  INCENTIVIZER_DSU_ESS,
  UNIV3_DSU_USDC,
  UNIV3_ESS_WETH,
} = contracts

export default function Dollar() {
  const { web3, connectWallet, disconnectWallet, account } = useWeb3()

  const [loaded, setLoaded] = useState(false)
  const [reserveData, setReserveData] = useState({})
  const [poolData, setPoolData] = useState([])
  const [v3Incentives, setV3Incentives] = useState({})

  const dollarBalance = useContractBalance(DOLLAR.address)
  const usdcBalance = useContractBalance(USDC.address, 6)
  const usdcAllowance = useContractAllowance(USDC.address, RESERVE.address)
  const dollarAllowance = useContractAllowance(DOLLAR.address, RESERVE.address)
  const { width } = useViewport()

  useEffect(async () => {
    if (web3) {
      const reserve = await getData()

      const ess = await getESSPrice()
      const curveTVL = await getCurveTVL()
      const uniTVL = await getUniPoolBalance()
      const v3dsu = await getV3DsuTvl()
      const uniRewards = await getIncentivizeRewards(INCENTIVIZER_DSU_ESS)
      const uniApr = (uniRewards.rewardRate * 31556952 * ess) / uniTVL

      const curveRewards = await getIncentivizeRewards(INCENTIVIZER_DSU)
      const curveApr = (curveRewards.rewardRate * 31556952 * ess) / curveTVL

      const uniBalance = await getIncentivizerBalance(
        INCENTIVIZER_DSU_ESS,
        account
      )

      const curveBalance = await getIncentivizerBalance(
        INCENTIVIZER_DSU,
        account
      )

      setPoolData([
        { id: 'uni', tvl: uniTVL, apr: uniApr, user: uniBalance },
        { id: 'curve', tvl: curveTVL, apr: curveApr, user: curveBalance },
        { id: 'v3Dsu', tvl: v3dsu },
      ])
      setReserveData(reserve)
      setLoaded(true)
    }
  }, [web3])

  useEffect(async () => {
    if (account) {
      const programs = await findV3Incentives()
      setV3Incentives(programs)
    }
  }, [account])

  return (
    <Page
      header={'⊙ Digital Standard Unit (DSU)'}
      subheader={'Mint, redeem and stake your DSU.'}
    >
      <Box m={'-97px 0 20px'}>
        <Grid
          templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
          gap={4}
          m="0 0 1em"
        >
          <Box
            bg="white"
            p={['2em 2.5em', '2em 4em']}
            border="1px solid #e8e8e8"
            borderRadius="lg"
            flexGrow="1"
          >
            <Heading fontSize="2xl">Reserve Information</Heading>
            <Grid
              templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
              gap="4"
              m=".5em 0 0"
              align="baseline"
            >
              <Stat>
                <StatLabel>Underlying Asset</StatLabel>
                <Skeleton isLoaded={loaded} mr="10px">
                  <StatNumber>USDC</StatNumber>
                </Skeleton>
              </Stat>
              <Stat>
                <StatLabel>Reserve AUM (USD)</StatLabel>
                <Skeleton isLoaded={loaded} mr="10px">
                  <StatNumber>${commas(reserveData.balance)}</StatNumber>
                </Skeleton>
              </Stat>

              <Stat>
                <StatLabel>Collateral Ratio</StatLabel>
                <Skeleton isLoaded={loaded} mr="10px">
                  <StatNumber>
                    {(reserveData.ratio * 100).toFixed(2)}%
                  </StatNumber>
                </Skeleton>
              </Stat>
              <Stat>
                <StatLabel>Protocol Revenue (USD)</StatLabel>
                <Skeleton isLoaded={loaded} mr="10px">
                  <StatNumber>${commas(reserveData.revenue)}</StatNumber>
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
          {account ? (
            <Box
              bg="white"
              p={['2em 2.5em', '2em 4em']}
              border="1px solid #e8e8e8"
              borderRadius="lg"
              w="auto"
            >
              <Heading fontSize="2xl" m="0em 0em 0.5em">
                Mint & Redeem DSU
              </Heading>
              <Grid
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
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
          ) : (
            <Box
              bg="white"
              p={['2em 2.5em', '2em 4em']}
              border="1px solid #e8e8e8"
              borderRadius="lg"
              w="auto"
            >
              <Heading fontSize="2xl" m="0em 0em 0.5em">
                Connect your wallet.
              </Heading>
              <Grid
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
                gap="4"
                m=".5em 0 0"
                align="baseline"
              >
                <Stat>
                  <StatLabel>USDC Balance</StatLabel>
                  <Skeleton isLoaded={false} mr="10px">
                    <StatNumber>${commas(usdcBalance)}</StatNumber>
                  </Skeleton>
                </Stat>
                <Stat>
                  <StatLabel>DSU Balance</StatLabel>
                  <Skeleton isLoaded={false} mr="10px">
                    <StatNumber>ø {commas(dollarBalance)}</StatNumber>
                  </Skeleton>
                </Stat>
              </Grid>
            </Box>
          )}
        </Grid>
        <Box
          bg="white"
          p={['2em 2.5em', '2em 4em']}
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
          {960 < width ? (
            <Table
              visibility={['hidden', 'visible']}
              m="1em -1.3em 0 "
              variant="simple"
            >
              <Thead>
                <Tr>
                  <Th>Liquidity Pool</Th>
                  <Th isNumeric>Total Value Locked (TVL)</Th>
                  <Th isNumeric>APR</Th>
                  <Th isNumeric> </Th>
                </Tr>
              </Thead>
              {poolData[0] ? (
                <Tbody>
                  <Tr>
                    <Td>
                      <Flex align="center">
                        <Image src="/logo/uni.svg" w="24px" m="0 10px 0 0" />
                        Uniswap ESS-DSU
                      </Flex>
                    </Td>
                    <Td isNumeric>${commas(poolData[0].tvl)} USD</Td>
                    <Td isNumeric>{(poolData[0].apr * 100).toFixed(2)}%</Td>
                    <Th isNumeric>
                      <ManageModal
                        pool={UNISWAP_DSU_ESS}
                        incentivizer={INCENTIVIZER_DSU_ESS}
                        symbol="UNI-V2"
                        user={poolData[0].user}
                        poolLink="https://app.uniswap.org/#/add/v2/0x24aE124c4CC33D6791F8E8B63520ed7107ac8b3e/0x605D26FBd5be761089281d5cec2Ce86eeA667109"
                      />
                    </Th>
                  </Tr>
                  <Tr>
                    <Td>
                      <Flex>
                        <Image src="/logo/crv.svg" w="24px" m="0 10px 0 0" />{' '}
                        Curve DSU-3CRV
                      </Flex>
                    </Td>
                    <Td isNumeric>${commas(poolData[1].tvl)} USD</Td>
                    <Td isNumeric>{(poolData[1].apr * 100).toFixed(2)}%</Td>
                    <Th isNumeric>
                      <ManageModal
                        pool={CURVE_DSU}
                        incentivizer={INCENTIVIZER_DSU}
                        symbol="DSU3CRV"
                        user={poolData[1].user}
                        poolLink="https://crv.to/pool"
                      />
                    </Th>
                  </Tr>
                  <Tr>
                    <Td>
                      <Flex>
                        <Image src="/logo/uni.svg" w="24px" m="0 10px 0 0" />{' '}
                        Uniswap V3 DSU/USDC
                      </Flex>
                    </Td>
                    <Td isNumeric>${commas(poolData[2].tvl)} USD</Td>
                    <Td isNumeric>?? %</Td>
                    <Th isNumeric>
                      <ManageV3Modal
                        account={account}
                        pool={UNIV3_DSU_USDC}
                        symbol="DSU"
                        program={v3Incentives.dsu}
                        poolLink="https://app.uniswap.org/#/add/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/0x605D26FBd5be761089281d5cec2Ce86eeA667109/500"
                      />
                    </Th>
                  </Tr>
                  <Tr>
                    <Td>
                      <Flex>
                        <Image src="/logo/uni.svg" w="24px" m="0 10px 0 0" />{' '}
                        Uniswap V3 ESS/ETH
                      </Flex>
                    </Td>
                    <Td isNumeric>${commas(poolData[1].tvl)} USD</Td>
                    <Td isNumeric>?? %</Td>
                    <Th isNumeric>
                      <ManageV3Modal
                        account={account}
                        pool={UNIV3_ESS_WETH}
                        symbol="ESS"
                        program={v3Incentives.ess}
                        poolLink="https://app.uniswap.org/#/add/ETH/0x24aE124c4CC33D6791F8E8B63520ed7107ac8b3e/3000"
                      />
                    </Th>
                  </Tr>
                </Tbody>
              ) : null}
            </Table>
          ) : null}
        </Box>
      </Box>
    </Page>
  )
}
