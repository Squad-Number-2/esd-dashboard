import { useEffect, useState } from 'react'

import { useWeb3 } from '../contexts/useWeb3'
import { getData } from '../utils/reserve'
import { commas } from '../utils/helpers'

import useViewport from '../hooks/useViewport'

import {
  Box,
  Flex,
  Image,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Link
} from '@chakra-ui/react'
import Page from '../components/page'
import Section from '../components/section'
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
  getV3EssTvl
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
  UNIV3_ESS_WETH
} = contracts()

export default function Dollar() {
  const { web3, connectWallet, disconnectWallet, account } = useWeb3()

  const [loaded, setLoaded] = useState(false)
  const [reserveData, setReserveData] = useState({})
  const [poolData, setPoolData] = useState([])
  const [v3Incentives, setV3Incentives] = useState({})

  const { width } = useViewport()

  useEffect(() => {
    const func = async () => {
      if (web3) {
        const reserve = await getData()

        const ess = await getESSPrice()
        const curveTVL = await getCurveTVL()
        const uniTVL = await getUniPoolBalance()
        const v3dsu = await getV3DsuTvl()
        const v3ess = await getV3EssTvl()

        const dsuRewards = 8000000

        const dsuApr = (dsuRewards * ess * 4) / v3dsu
        const essRewards = 4000000
        const essApr = (essRewards * ess * 4) / v3ess
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
          { id: 'v3Dsu', tvl: v3dsu, apr: dsuApr },
          { id: 'v3Ess', tvl: v3ess, apr: essApr }
        ])
        setReserveData(reserve)
        setLoaded(true)
      }
    }
    func()
  }, [web3])

  useEffect(() => {
    const func = async () => {
      if (account) {
        const programs = await findV3Incentives()
        setV3Incentives(programs)
        console.log(programs)
      }
    }
    func()
  }, [account])

  return (
    <Page header={'Protocol Liquidity'}>
      <Section>
        <Box mb="12">
          <Heading fontSize="3xl" fontWeight={'400'}>
            DSU Liquidity
          </Heading>
          <Divider mt="2" mb="4" borderWidth={1} borderColor={'black'} />

          <Table visibility={'visible'} m="1em 0 0" variant="simple">
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
                    <Flex align={'center'}>
                      <Image src="/logo/crv.svg" w="24px" m="0 10px 0 0" />{' '}
                      <Link href="https://curve.fi/factory/55" target="_blank">
                        Curve DSU-3CRV →
                      </Link>
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
                      poolLink="https://curve.fi/factory/55"
                    />
                  </Th>
                </Tr>
                <Tr>
                  <Td>
                    <Flex align={'center'}>
                      <Image src="/logo/uni.svg" w="24px" m="0 10px 0 0" />{' '}
                      <Link
                        href="https://app.uniswap.org/#/add/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/0x605D26FBd5be761089281d5cec2Ce86eeA667109/500"
                        target="_blank"
                      >
                        Uniswap V3 DSU/USDC →
                      </Link>
                    </Flex>
                  </Td>
                  <Td isNumeric>${commas(poolData[2].tvl)} USD</Td>
                  <Td isNumeric>{(poolData[2].apr * 100).toFixed(2)}%</Td>
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
              </Tbody>
            ) : null}
          </Table>
        </Box>

        <Box mb="12">
          <Heading fontSize="3xl" fontWeight={'400'}>
            ESS Liquidity
          </Heading>
          <Divider mt="2" mb="4" borderWidth={1} borderColor={'black'} />

          <Table visibility={'visible'} m="1em 0 0" variant="simple">
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
                      <Link
                        href="https://app.uniswap.org/#/add/v2/0x24aE124c4CC33D6791F8E8B63520ed7107ac8b3e/0x605D26FBd5be761089281d5cec2Ce86eeA667109"
                        target="_blank"
                      >
                        Uniswap ESS-DSU →
                      </Link>
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
                    <Flex align={'center'}>
                      <Image src="/logo/uni.svg" w="24px" m="0 10px 0 0" />{' '}
                      <Link
                        href="https://app.uniswap.org/#/add/ETH/0x24aE124c4CC33D6791F8E8B63520ed7107ac8b3e/3000"
                        target="_blank"
                      >
                        Uniswap V3 ESS/ETH →
                      </Link>
                    </Flex>
                  </Td>
                  <Td isNumeric>${commas(poolData[3].tvl)} USD</Td>
                  <Td isNumeric>{(poolData[3].apr * 100).toFixed(2)}%</Td>
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
        </Box>
      </Section>
    </Page>
  )
}
