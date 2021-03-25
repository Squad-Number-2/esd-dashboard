import React from 'react'
import { useRouter } from 'next/router'
import { useWeb3 } from '../../contexts/useWeb3'

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
  } = useWeb3()

  return (
    <Flex
      bg="black"
      justify="space-between"
      p="30px 60px"
      color="white"
      align="center"
    >
      <Link onClick={() => router.push('/')}>
        <Image
          src="/logo/logo_white.svg"
          height="40px"
          alt="Empty Set Dollar"
        />
      </Link>
      <Flex minW="sm" p="4" justify="space-around" align="center">
        <Link
          active={router.pathname === '/dollar'}
          onClick={() => router.push('/dollar')}
        >
          Dollar
        </Link>
        <Link
          active={router.pathname === '/governance'}
          onClick={() => router.push('/governance')}
        >
          Governance
        </Link>

        <Button
          onClick={() => (account ? null : connectWallet('injected'))}
          variant="solid"
          colorScheme="green"
          boxShadow="md"
          borderRadius="lg"
        >
          <Text fontSize="sm" color="white.100" mr={2}>
            {account ? `` : 'Connect Wallet'}
          </Text>
          {account && (
            <>
              <Text fontSize="sm" m={0}>
                {account.substring(0, 6) +
                  '...' +
                  account.substring(account.length - 4)}
              </Text>
            </>
          )}
          {account && (
            <CancelButton
              margin={{ marginLeft: '8px' }}
              width="14px"
              height="14px"
              handleClick={() => disconnectWallet()}
            />
          )}
        </Button>
      </Flex>
    </Flex>
  )
}

const CancelButton = ({
  fill = '#fff',
  width = '16px',
  height = '16px',
  margin = {},
  handleClick,
}) => (
  <button
    onClick={handleClick}
    style={{
      border: 'none',
      outline: 'none',
      ...(Object.keys(margin).length && { ...margin }),
    }}
    className="reset"
  >
    <svg
      style={{
        cursor: 'pointerEvent',
        pointerEvents: 'none',
      }}
      width={width}
      height={height}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path
        d="M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z"
        fill={fill}
      />
    </svg>
  </button>
)

export default Header
