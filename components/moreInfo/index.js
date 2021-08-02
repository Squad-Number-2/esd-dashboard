import { Flex, Box, Center, Image, Link, Heading, Text } from '@chakra-ui/react'

export default function MoreInfo() {
  return (
    <Box p="8">
      <Center>
        <Text fontSize="3xl">Need to know more?</Text>
      </Center>
      <Flex justifyContent="space-between" flexDirection={['column', 'row']}>
        <Box p="3" justifyContent="center" maxWidth={'350px'}>
          <Image src={'/graphics/new.png'} />
          <Heading align="center" fontSize="2xl" m="0 0 .5em">
            New to Empty Set?
          </Heading>
          <Text align="center">
            Learn more about how the Empty Set protocol works, dive into the
            architecture and find info on its current configuration on the
            documentation website.
          </Text>
        </Box>

        <Box p="3" maxWidth={'350px'}>
          <Image src={'/graphics/how.png'} />
          <Heading align="center" fontSize="2xl" m="0 0 .5em">
            What are DSU & ESS?
          </Heading>
          <Text align="center">
            The Empty Set protocol has two tokens. Learn about the role they
            have in the operation of the protocol and how you can use them!
          </Text>
        </Box>
        <Box p="3" maxWidth={'350px'}>
          <Image src={'/graphics/risks.png'} />
          <Heading align="center" fontSize="2xl" m="0 0 .5em">
            Learn about the Risks?
          </Heading>
          <Text align="center">
            All DeFi protocols share some risk. Whether it's smart contract,
            protocol dependencies or external risks, protocols share some risks.
            Learn about Empty Set's profile.
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
