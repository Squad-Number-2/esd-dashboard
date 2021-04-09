import Head from 'next/head'
import { useRouter } from 'next/router'

import Header from './header'
import Footer from './footer'
import Alerts from './alerts'

import {
  Flex,
  Box,
  Text,
  Heading,
  Skeleton,
  IconButton,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'

const Page = ({ children, header, subheader, back }) => {
  const router = useRouter()
  return (
    <Flex direction="column" minHeight="100vh">
      <Head>
        <title>Empty Set Dollar</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Flex bg="black" color="white" p="5em 3em 10em" justify="center">
        {back ? (
          <IconButton
            icon={<ArrowBackIcon w={8} h={8} />}
            variant="ghost"
            colorScheme="white"
            onClick={() => router.back()}
          />
        ) : null}

        <Box width="100%" maxW={'1200px'}>
          <Skeleton isLoaded={header} mb="20px">
            <Heading fontSize="4xl">{header}</Heading>
          </Skeleton>
          <Skeleton isLoaded={subheader}>
            <Text fontSize="lg">{subheader}</Text>
          </Skeleton>
        </Box>
      </Flex>
      <Flex flexGrow="1" p="0em 3em 0em" justify="center">
        <Box maxW={'1200px'} w="100%">
          {children}
        </Box>
      </Flex>
      <Alerts />
      <Footer />
    </Flex>
  )
}

export default Page
