import React from 'react'
import { Flex, Box, Image, Link, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useWeb3 } from '../../contexts/useWeb3'

const Footer = () => {
  const { web3 } = useWeb3()
  const router = useRouter()
  return (
    <Flex
      bg="black"
      color="white"
      justify="center"
      align="center"
      p="30px 60px"
    >
      <Flex w="100%" maxW={'1200px'} justify="space-between" align="center">
        <Box p="4">
          <Link onClick={() => router.push('/')}>
            <Image
              src={'/logo/logo_white.svg'}
              height="40px"
              alt="Empty Set Dollar"
            />
          </Link>
        </Box>

        <Flex minW="md" p="4" justify="space-around" align="center">
          <Link href={'https://emptyset.finance/'} target={'_blank'}>
            Home
          </Link>
          <Link href={'https://docs.emptyset.finance/'} target={'_blank'}>
            Documentation
          </Link>
          <Link
            href={
              'https://explore.duneanalytics.com/dashboard/empty-set-dollar'
            }
            target={'_blank'}
          >
            Analytics
          </Link>
          <Link
            href={
              'https://app.uniswap.org/#/swap?inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputCurrency=0x36f3fd68e7325a35eb768f1aedaae9ea0689d723'
            }
            target={'_blank'}
          >
            Trade
          </Link>
          {web3._network ? (
            <Box
              border={
                web3._network.chainId != 1
                  ? '2px solid palevioletred'
                  : '2px solid white'
              }
              color={web3._network.chainId != 1 ? 'palevioletred' : 'white'}
              p="2px 6px 3px"
              borderRadius="8px"
            >
              {web3._network.name[0].toUpperCase() +
                web3._network.name.slice(1).toLowerCase()}
            </Box>
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Footer
