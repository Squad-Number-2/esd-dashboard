import styled from 'styled-components'
import { Row, Column } from '../components/helpers'

import { useWeb3 } from '../contexts/useWeb3'
import { web3 } from '../utils/ethers'

import useCurrentBlock from '../hooks/useCurrentBlock'
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
import Page from '../components/page'
import MoreInfo from '../components/moreInfo'

export default function Stake() {
  const { web3, connectWallet, disconnectWallet, account } = useWeb3()

  return (
    <Page header={'ESD Stake (ESDS)'} subheader={'Trade your ESDS'}>
      <Box m={'-97px 0 20px'}>
        <Grid templateColumns="repeat(2, 1fr)" gap={4} m="0 0 1em">
          <Box
            bg="white"
            p="2em 4em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            flexGrow="1"
            height="fit-content"
          >
            <Heading fontSize="2xl">Information</Heading>
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap="4"
              m=".5em 0 0"
              align="baseline"
            >
              <Stat>
                <StatLabel>ESDS Supply </StatLabel>
                <StatNumber>ø 120,000,000</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Supply Growth (Week)</StatLabel>
                <StatNumber>▲ 9.34%</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Reserve Ratio</StatLabel>
                <StatNumber>0.88</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Reserve Assets</StatLabel>
                <StatNumber>$93,029,210</StatNumber>
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
              Trade ESDS
            </Heading>
            <Text color="grey" fontSize="sm" align="right">
              $28,190 USDC
            </Text>
            <InputGroup>
              <Input placeholder="0.00 ESDS" />
              <InputRightAddon>
                <Button variant="ghost">Max</Button>
              </InputRightAddon>
            </InputGroup>
            <Divider m="1em 0" />
            <InputGroup>
              <Input placeholder="0.00 ETH" />
              <InputRightAddon>
                <Button variant="ghost">Max</Button>
              </InputRightAddon>
            </InputGroup>
            <Flex m="1em 0" justify="space-between">
              <Text fontSize="sm" color="grey">
                Slippage: 0.5%
              </Text>
              <Text fontSize="sm" color="grey">
                Price Impact: 0.25%
              </Text>
            </Flex>
            <Center>
              <Button w="100%">Swap</Button>
            </Center>
          </Box>
        </Grid>
        <MoreInfo />
      </Box>
    </Page>
  )
}
