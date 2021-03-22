import styled from 'styled-components'
import Head from 'next/head'

import Header from './header'
import Footer from './footer'
import { Flex, Box, Text, Heading } from '@chakra-ui/react'

const Page = ({ children, header, subheader }) => (
  <Flex direction="column" minHeight="100vh">
    <Head>
      <title>Empty Set Dollar</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />
    <Flex bg="black" color="white" p="5em 3em 10em" justify="center">
      <Box width="100%" maxW={'1200px'}>
        <Heading fontSize="4xl">{header}</Heading>
        <Text fontSize="lg">{subheader}</Text>
      </Box>
    </Flex>
    <Flex flexGrow="1" p="0em 3em 0em" justify="center">
      <Box maxW={'1200px'} w="100%">
        {children}
      </Box>
    </Flex>
    <Footer />
  </Flex>
)

const Main = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`
const ContentBox = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 2;
  width: 100%;
`

export default Page
