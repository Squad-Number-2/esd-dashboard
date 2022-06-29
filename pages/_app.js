import { Web3Provider } from '../contexts/useWeb3'
import { useWallet, UseWalletProvider } from 'use-wallet'
import { AlertProvider } from '../contexts/useAlerts'

import { ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react'

const theme = {
  styles: {
    global: {
      'html, body': {
        minHeight: '100vh',
        fontSize: 'sm',
        color: 'gray.600',
        lineHeight: 'tall'
      },
      a: {
        color: 'teal.500'
      }
    }
  }
}
const chainID = process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : 1
export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={extendTheme({ theme })}>
      <CSSReset />
      <UseWalletProvider
        chainId={chainID}
        connectors={{
          injected: {
            chainId: [1, 42]
          },
          walletconnect: {
            chainId: [1, 42],
            rpc: {
              1: 'https://eth-mainnet.alchemyapi.io/v2/B6PbmuuGJ3KNQXSmN_WB3FGzAxCtCttS',
              42: 'https://kovan.infura.io/v3/0de24f0d71624f808c0cf9941e07ddd7'
            }
          }
        }}
      >
        <AlertProvider>
          <Web3Provider>
            <Component {...pageProps} />
          </Web3Provider>
        </AlertProvider>
      </UseWalletProvider>
    </ChakraProvider>
  )
}
