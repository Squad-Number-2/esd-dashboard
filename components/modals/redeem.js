import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Box,
  Center,
  Image,
  Link,
  Heading,
  Text,
  useDisclosure,
  Button,
  Input,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react'
import { redeem } from '../../utils/reserve'

export default function Redeem({ balance }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState('')

  const setMax = () => {
    setValue(parseFloat(balance))
  }
  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Redeem ESD
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Redeem ESD tokens</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="grey" fontSize="sm">
              ESD can be redeemed for a share of assets DAOs reserve. The ESD is
              redeemable at the current reserve ratio.
            </Text>
            <br />
            <Text color="grey" fontSize="sm">
              Balance: {balance} ESD
            </Text>
            <InputGroup>
              <Input
                placeholder="0.00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <InputRightAddon>
                <Button onClick={() => setMax()} variant="ghost">
                  Max
                </Button>
              </InputRightAddon>
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              disabled={parseFloat(value) > parseFloat(balance)}
              onClick={async () => await redeem(value)}
            >
              Redeem ESD
            </Button>
            <Button
              m="0 0 0 1em"
              variant="outline"
              colorScheme="grey"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
