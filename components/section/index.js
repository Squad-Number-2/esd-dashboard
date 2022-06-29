import { Box, Container } from '@chakra-ui/react'

const section = ({ children, color }) => (
  <Box w="100%" bg={color} centerContent>
    <Container w="100%" maxW="7xl" px="40px" py="60px">
      {children}
    </Container>
  </Box>
)
export default section
