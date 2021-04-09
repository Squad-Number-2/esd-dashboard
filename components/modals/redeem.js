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
import { redeem } from '../../utils/reserve'
import useAlerts from '../../contexts/useAlerts'

export default function Redeem({ balance, allowance }) {
  const { watchTx } = useAlerts()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState('')

  const setMax = () => {
    setValue(parseFloat(balance))
  }

  const executeFunc = async () => {
    const response = await redeem(value)
    watchTx(response.hash, 'ESD redeem')
    setValue('')
    onClose()
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
            {parseInt(allowance) === 0 ? (
              <Button
                disabled={value > balance}
                colorScheme="pink"
                onClick={() =>
                  setApproval(
                    contracts.dollar.address,
                    contracts.reserve.address
                  )
                }
              >
                Approve USDC
              </Button>
            ) : (
              <Button
                colorScheme="green"
                disabled={parseFloat(value) > parseFloat(balance)}
                onClick={() => executeFunc()}
              >
                Redeem ESD
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
