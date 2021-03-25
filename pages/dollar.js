import { useEffect, useState } from 'react'

import { useWeb3 } from '../contexts/useWeb3'
import { web3, setApproval } from '../utils/ethers'
import { getData } from '../utils/reserve'
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
} from '@chakra-ui/react'
import Page from '../components/page'
import MintModal from '../components/modals/mint'
import RedeemModal from '../components/modals/redeem'

import contracts from '../contracts'

export default function Dollar() {
  const { web3, connectWallet, disconnectWallet, account } = useWeb3()

  const [reserveData, setReserveData] = useState({})
  const dollarBalance = useContractBalance(contracts.dollar.address)
  const usdcBalance = useContractBalance(contracts.usdc.address, 6)

  const usdcAllowance = useContractAllowance(
    contracts.usdc.address,
    contracts.reserve.address
  )

  const dollarAllowance = useContractAllowance(
    contracts.dollar.address,
    contracts.reserve.address
  )
  // Reserve
  // read - reserveBalance() - Reserve in USDC value
  // read - reserveRatio() - Reserve Ratio
  // read - redeemPrice() - Tokens 1 ESD redemption receives from Reserve
  // writ - mint(amount) - Takes USDC and returns ESD
  // writ - redeem(amount) - Returns USDC? to user in exchange for ESD
  // Stabilizer
  // read - totalUnderlying() - Total Supply
  // read - balanceOfUnderlying(account) - User balance
  // read - rate() - Get effective reward rate
  // writ - supply(amount) - Provide ESD to Stabilizer
  // writ - redeem(amount) - Remove sESD from Stabilizer
  // writ - redeemUnderlying(amount) - Remove ESD from Stabilizer

  useEffect(async () => {
    if (account) {
      const reserve = await getData()
      setReserveData(reserve)
    }
  }, [account])

  return (
    <Page
      header={'Empty Set Døllar (ESD)'}
      subheader={'Mint, redeem and stake your ESD.'}
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
                <StatNumber>{(reserveData.ratio * 100).toFixed(2)}%</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Assets in USDC</StatLabel>
                <StatNumber>${commas(reserveData.balance)}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Redeem Price</StatLabel>
                <StatNumber>${commas(reserveData.price)}</StatNumber>
              </Stat>
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
              Mint & Redeem ESD
            </Heading>
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap="4"
              m=".5em 0 0"
              align="baseline"
            >
              <Stat>
                <StatLabel>USDC Balance</StatLabel>
                <StatNumber>${commas(usdcBalance)}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>ESD Balance</StatLabel>
                <StatNumber>ø {commas(dollarBalance)}</StatNumber>
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
              ESDS.
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
            <Tbody>
              <Tr>
                <Td>
                  <Flex align="center">
                    <Image src="/logo/uni.svg" w="24px" m="0 10px 0 0" />
                    Uniswap ESD-USDC
                  </Flex>
                </Td>
                <Td isNumeric>$5,030,200 USD</Td>
                <Td isNumeric>25.40%</Td>
                <Th isNumeric>
                  {' '}
                  <Button colorScheme="green">Manage LP</Button>
                </Th>
              </Tr>
              <Tr>
                <Td>
                  <Flex align="center">
                    <Image src="/logo/uni.svg" w="24px" m="0 10px 0 0" />
                    Uniswap ESDS-USDC
                  </Flex>
                </Td>
                <Td isNumeric>$10,030,200 USD</Td>
                <Td isNumeric>73.40%</Td>
                <Th isNumeric>
                  <Button colorScheme="green">Manage LP</Button>
                </Th>
              </Tr>
              <Tr>
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
              </Tr>
              <Tr>
                <Td>
                  <Flex>
                    <Image src="/logo/crv.svg" w="24px" m="0 10px 0 0" /> Curve
                    ESD-3CRV
                  </Flex>
                </Td>
                <Td isNumeric>$10,030,200 USD</Td>
                <Td isNumeric>10.40%</Td>
                <Th isNumeric>
                  {' '}
                  <Button colorScheme="green">Manage LP</Button>
                </Th>
              </Tr>
            </Tbody>
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
