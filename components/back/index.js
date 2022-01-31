import { IconButton } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'

const Back = ({}) => {
  const router = useRouter()
  return (
    <IconButton
      icon={<ArrowBackIcon w={6} h={6} />}
      variant="ghost"
      colorScheme="white"
      mb="-4px"
      onClick={() => router.back()}
    />
  )
}

export default Back
