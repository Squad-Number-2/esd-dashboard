import React from 'react'
import { useRouter } from 'next/router'
import { useWeb3 } from '../../contexts/useWeb3'
import WalletModal from '../modals/wallet'

import { Flex, Image, Link, HStack, Box } from '@chakra-ui/react'

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
              <Box width={150}>
                <svg
                  viewBox="0 0 379 134"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M230.1 100.7H235.9C237.7 100.7 239.2 99.2 239.2 97.4V80.3V11.7C239.2 9.90001 237.7 8.39999 235.9 8.39999H230.1C228.3 8.39999 226.8 9.90001 226.8 11.7V27.7C226.8 32.9 221.5 36.5 216.8 34.3C212.7 32.4 208 31.4 203.1 31.4C184.9 31.4 170 44.9 170 65.9C170 86.8 185.1 100.6 203.3 100.6C209.9 100.6 216.6 98.6 221.5 94.7C223.7 93 226.9 94.5 226.9 97.3C226.8 99.3 228.2 100.7 230.1 100.7ZM204.3 43.2C215.1 43.2 226.8 51.6 226.8 65.9C226.8 80.1 216.1 89.1 204.3 89.1C192.1 89.1 182.4 79.2 182.4 65.9C182.4 52.6 192.1 43.2 204.3 43.2Z"
                    fill="black"
                  />
                  <path
                    d="M66.7 133.1C30 133.1 0.200012 103.3 0.200012 66.6C0.200012 29.9 30 0 66.7 0C103.4 0 133.2 29.8 133.2 66.5C133.2 103.2 103.4 133.1 66.7 133.1ZM66.7 12.9C37.1 12.9 13 37 13 66.6C13 96.2 37.1 120.3 66.7 120.3C96.3 120.3 120.4 96.2 120.4 66.6C120.4 37 96.3 12.9 66.7 12.9Z"
                    fill="black"
                  />
                  <path
                    d="M66.7 76.7C72.2781 76.7 76.8 72.1781 76.8 66.6C76.8 61.0219 72.2781 56.5 66.7 56.5C61.1219 56.5 56.6 61.0219 56.6 66.6C56.6 72.1781 61.1219 76.7 66.7 76.7Z"
                    fill="black"
                  />
                  <path
                    d="M307.2 81.2C307.2 86.9 304.7 91.7 299.7 95.7C294.7 99.6 288.4 101.6 280.8 101.6C274.2 101.6 268.4 99.9 263.4 96.4C259.5 93.7 256.4 90.3 254.3 86.3C253.3 84.5 254.2 82.1 256.1 81.3L260.5 79.4C262.2 78.7 264.2 79.4 265.1 81C266.6 83.5 268.4 85.6 270.7 87.2C273.8 89.4 277.1 90.5 280.8 90.5C284.7 90.5 288 89.7 290.6 88C293.2 86.3 294.6 84.3 294.6 82C294.6 77.8 291.4 74.7 285 72.8L273.7 70C260.9 66.8 254.5 60.6 254.5 51.5C254.5 45.5 256.9 40.7 261.8 37.1C266.7 33.5 272.9 31.7 280.5 31.7C286.3 31.7 291.6 33.1 296.2 35.9C299.5 37.8 302.1 40.3 304 43.1C305.3 45 304.5 47.6 302.4 48.5L297.9 50.3C296.4 50.9 294.7 50.5 293.7 49.2C292.5 47.5 290.9 46.1 288.9 45C286.1 43.4 282.9 42.7 279.5 42.7C276.3 42.7 273.4 43.5 270.9 45.1C268.4 46.7 267.1 48.7 267.1 51C267.1 54.8 270.6 57.4 277.7 59L287.6 61.5C300.7 64.7 307.2 71.2 307.2 81.2Z"
                    fill="black"
                  />
                  <path
                    d="M365.5 45.8V71.5C365.5 84.4 355.6 88.9 347.4 88.9C339.4 88.9 333.2 83 333.2 72.8V45.8V38V34.6C333.2 33.5 332.3 32.6 331.2 32.6H322C320.9 32.6 320 33.5 320 34.6V45.8V73.8C319.9 91.6 329.4 101.9 345.2 101.9C350.4 101.9 357.7 99.9 362.3 95.3C363.5 94.2 365.4 94.9 365.4 96.5V98.5C365.4 99.6 366.3 100.5 367.4 100.5H376.6C377.7 100.5 378.6 99.6 378.6 98.5V45.7V38V34.6C378.6 33.5 377.7 32.6 376.6 32.6H367.4C366.3 32.6 365.4 33.5 365.4 34.6V45.8H365.5Z"
                    fill="black"
                  />
                </svg>
              </Box>
            </Link>
            <HStack pl={'30px'} mb="5px" py={{ base: '20px', md: '0' }}>
              <Link onClick={() => router.push('/liquidity')}>liquidity</Link>
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
