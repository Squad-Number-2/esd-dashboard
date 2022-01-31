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
        <title>{`Empty Set ${header ? ' - ' + header : ''}`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@emptysetdollar" />
        <meta
          property="og:title"
          content={`Empty Set ${header ? ' - ' + header : null}`}
        />
        <meta
          property="og:description"
          content="Empty Set issues a decentralized, censorship resistant, community owned stablecoin."
        />
        <meta
          property="og:image"
          content="https://app.emptyset.finance/image.png"
        />
      </Head>
      <Header />

      {children}

      <Alerts />
      <Footer />
    </Flex>
  )
}

export default Page
