import { Flex, Box, Center, Image, Link, Heading, Text } from '@chakra-ui/react'

export default function MoreInfo() {
  return (
    <Box p="8">
      <Center>
        <Text fontSize="3xl">Need to know more?</Text>
      </Center>
      <Flex>
        <Box p="3">
          <Image src={'/graphics/new.png'} width={'100%'} />
          <Heading align="center" fontSize="2xl" m="0 0 .5em">
            Need to know more?
          </Heading>
          <Text align="center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            luctus, velit ac tincidunt ultrices, mauris arcu imperdiet
          </Text>
        </Box>

        <Box p="3">
          <Image src={'/graphics/how.png'} width={'100%'} />
          <Heading align="center" fontSize="2xl" m="0 0 .5em">
            How do you use the DAO/LP?
          </Heading>
          <Text align="center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            luctus, velit ac tincidunt ultrices, mauris arcu imperdiet
          </Text>
        </Box>
        <Box p="3">
          <Image src={'/graphics/risks.png'} width={'100%'} />
          <Heading align="center" fontSize="2xl" m="0 0 .5em">
            Learn about the Risks?
          </Heading>
          <Text align="center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            luctus, velit ac tincidunt ultrices, mauris arcu imperdiet
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
