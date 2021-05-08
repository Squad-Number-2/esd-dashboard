import React from 'react'
import { useRouter } from 'next/router'
import { useWeb3 } from '../../contexts/useWeb3'
import WalletModal from '../modals/wallet'

import {
  Flex,
  Box,
  Image,
  Link,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react'

function Header({ header, subheader }) {
  const router = useRouter()
  const {
    connectWallet,
    disconnectWallet,
    account,
    status,
    balance,
    web3,
  } = useWeb3()

  return (
    <>
      {web3._network && web3._network.chainId != 1 ? (
        <Box h="25px" bg="palevioletred" textAlign="center" color="white">
          You are using the{' '}
          {web3._network.name[0].toUpperCase() +
            web3._network.name.slice(1).toLowerCase()}{' '}
          network!
        </Box>
      ) : null}

      <Flex
        bg="black"
        color="white"
        justify="center"
        align="center"
        p="30px 60px"
      >
        <Flex w="100%" maxW={'1200px'} justify="space-between" align="center">
          <Link onClick={() => router.push('/')}>
            <Image
              src="/logo/logo_white.svg"
              height="40px"
              alt="Empty Set Dollar"
            />
          </Link>
          <Flex minW="sm" p="4" justify="space-around" align="center">
            <Link onClick={() => router.push('/dollar')}>Dollar</Link>
            <Link onClick={() => router.push('/governance')}>Governance</Link>
            <WalletModal />
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default Header
