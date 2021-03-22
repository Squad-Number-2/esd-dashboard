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
import contracts from '../../contracts'
import { web3, setApproval } from '../../utils/ethers'
import { mint } from '../../utils/reserve'

export default function Mint({ balance, allowance }) {
  // Check Approvals
  // No letters
  // Input =< Balance

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState('')

  const setMax = () => {
    setValue(parseFloat(balance))
  }

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Mint ESD
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint ESD tokens</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="grey" fontSize="sm">
              ESD can be minted by depositing USDC into the DAOs reserve. The
              ESD is redeemable for the contents of the reserve at the current
              reserve ratio.
            </Text>
            <br />
            <Text color="grey" fontSize="sm">
              Balance: {balance} USDC
            </Text>
            <InputGroup>
              <Input
                placeholder="0.00"
                value={value}
                isInvalid={parseFloat(value) > parseFloat(balance)}
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
            {parseInt(allowance) === 0 ? (
              <Button
                disabled={value > balance}
                colorScheme="pink"
                onClick={() =>
                  setApproval(contracts.usdc.address, contracts.reserve.address)
                }
              >
                Approve USDC
              </Button>
            ) : (
              <Button
                disabled={parseFloat(value) > parseFloat(balance)}
                colorScheme="green"
                onClick={async () => await mint(value)}
              >
                Mint ESD
              </Button>
            )}

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
