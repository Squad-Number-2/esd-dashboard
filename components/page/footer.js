import React from 'react'
import { Flex, Box, Image, Link } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const Footer = () => {
  const router = useRouter()
  const logoUrl = `/logo/logo_${false ? 'black' : 'white'}.svg`
  return (
    <Flex p="30px 20px" bg="black" justify="space-between" color={'white'}>
      <Box p="4">
        <Link onClick={() => router.push('/')}>
          <Image src={logoUrl} height="40px" alt="Empty Set Dollar" />
        </Link>
      </Box>

      <Flex minW="sm" p="4" justify="space-around" align="center">
        <Link href={'https://emptyset.finance/'} target={'_blank'}>
          Home
        </Link>
        <Link href={'https://docs.emptyset.finance/'} target={'_blank'}>
          Documentation
        </Link>
        <Link
          href={'https://explore.duneanalytics.com/dashboard/empty-set-dollar'}
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
      </Flex>
    </Flex>
  )
}

export default Footer
