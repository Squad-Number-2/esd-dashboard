import React from 'react'
import { Flex, Box, Image, Link, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useWeb3 } from '../../contexts/useWeb3'
import Section from '../section'

const Footer = () => {
  const { web3 } = useWeb3()
  const router = useRouter()
  return (
    <Box centerContent w="100%" borderTop="2px solid #000">
      <Section>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justifyContent={'space-between'}
          alignItems={{ base: 'center', md: 'flex-start' }}
        >
          <Flex maxW="xs" w="full" justifyContent={'space-between'}>
            <VStack spacing={2} align="left">
              <Link onClick={() => router.push('/')}>Home</Link>
              <Link onClick={() => router.push('/')}>Liquidity</Link>
              <Link onClick={() => router.push('/')}>Governance</Link>
            </VStack>
            <VStack spacing={2} align="left">
              <Link href={'https://emptyset.finance/'} target={'_blank'}>
                Twitter →
              </Link>
              <Link href={'https://docs.emptyset.finance/'} target={'_blank'}>
                Forum →
              </Link>
              <Link
                href={
                  'https://app.uniswap.org/#/swap?inputCurrency=0x24aE124c4CC33D6791F8E8B63520ed7107ac8b3e&outputCurrency=0x605D26FBd5be761089281d5cec2Ce86eeA667109&use=V2'
                }
                target={'_blank'}
              >
                Trade →
              </Link>
            </VStack>
          </Flex>

          <Link onClick={() => router.push('/')}>
            <Image
              src={'/logo/black.svg'}
              width="250px"
              alt="Empty Set Dollar"
              pt={{ base: '40px', md: 0 }}
            />
          </Link>
        </Flex>
      </Section>
    </Box>
  )
}

export default Footer
{
  /* {web3._network ? (
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
          ) : null} */
}
