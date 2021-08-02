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
      <Flex
        flexDirection={['column', 'row']}
        w="100%"
        maxW={'1200px'}
        justify="space-between"
        align="center"
      >
        <Box p="4">
          <Link onClick={() => router.push('/')}>
            <Image
              src={'/logo/logo_white.svg'}
              height="40px"
              alt="Empty Set Dollar"
            />
          </Link>
        </Box>

        <Flex
          flexDirection={['column', 'row']}
          minW={['none', 'md']}
          p="4"
          justify="space-around"
          align="center"
        >
          <Link href={'https://emptyset.finance/'} target={'_blank'}>
            Home
          </Link>
          <Link href={'https://docs.emptyset.finance/'} target={'_blank'}>
            Documentation
          </Link>
          {/* <Link
            href={
              'https://explore.duneanalytics.com/dashboard/empty-set-dollar'
            }
            target={'_blank'}
          >
            Analytics
          </Link> */}
          <Link
            href={
              'https://app.uniswap.org/#/swap?inputCurrency=0x24aE124c4CC33D6791F8E8B63520ed7107ac8b3e&outputCurrency=0x605D26FBd5be761089281d5cec2Ce86eeA667109&use=V2'
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
