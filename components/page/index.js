import Head from 'next/head'
import { useRouter } from 'next/router'

import Header from './header'
import Footer from './footer'
import Alerts from './alerts'

import { Flex, Box, Text, Container, IconButton } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'

const Page = ({ children, header, subheader, back }) => {
  const router = useRouter()
  return (
    <Flex direction="column" minHeight="100vh">
      <Head>
        <title>{`${
          header ? 'DSU - ' + header : 'Digital Standard Unit'
        }`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@emptysetdollar" />
        <meta
          property="og:title"
          content={`DSU ${header ? ' - ' + header : ''}`}
        />
        <meta
          property="og:description"
          content={`DSU is a trust-minimized, fully backed, & collateral-efficient stablecoin.`}
        />
        <meta property="og:image" content="https://app.dsu.money/image.png" />
      </Head>
      <Header />

      {children}

      <Alerts />
      <Footer />
    </Flex>
  )
}

export default Page
