import React from 'react'
import { useRouter } from 'next/router'
import { useWeb3 } from '../../contexts/useWeb3'
import WalletModal from '../modals/wallet'

import { Flex, Image, Link, HStack } from '@chakra-ui/react'

import Section from '../section'

function Header({ header, subheader }) {
  const router = useRouter()
  const { connectWallet, disconnectWallet, account, status, balance, web3 } =
    useWeb3()

  return (
    <>
      {/* {web3._network && web3._network.chainId === 3 ? (
        <Box h="25px" bg="palevioletred" textAlign="center" color="white">
          You are using the{' '}
          {web3._network.name[0].toUpperCase() +
            web3._network.name.slice(1).toLowerCase()}{' '}
          network!
        </Box>
      ) : null} */}

      <Section>
        <Flex
          justify={'space-between'}
          align={'center'}
          direction={{ base: 'column', md: 'row' }}
        >
          <Flex
            align={{ base: 'center', md: 'flex-end' }}
            justify={'space-between'}
            direction={{ base: 'column', md: 'row' }}
          >
            <Link onClick={() => router.push('/')}>
              <Image
                src="/logo/black.svg"
                width="250px"
                alt="Empty Set Dollar"
              />
            </Link>
            <HStack pl={'30px'} mb="5px" py={{ base: '20px', md: '0' }}>
              {/* <Link onClick={() => router.push('/dollar')}>liquidity</Link> */}
              <Link onClick={() => router.push('/governance')}>governance</Link>
              <Link
                href="https://docs.emptyset.finance"
                target="_blank"
                isExternal
              >
                docs →
              </Link>
            </HStack>
          </Flex>

          <WalletModal />
        </Flex>
      </Section>
    </>
  )
}

export default Header
