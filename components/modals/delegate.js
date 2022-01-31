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
  Divider
} from '@chakra-ui/react'

import useContractAllowance from '../../hooks/useContractAllowance'

import { ethers } from 'ethers'
import { web3, setApproval, zeroAddress } from '../../utils/ethers'
import { setDelegate } from '../../utils/governor'
import useAlerts from '../../contexts/useAlerts'

export default function Delegate({ account }) {
  const { watchTx } = useAlerts()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState('')

  const executeDelegate = async () => {
    const response = await setDelegate(value)
    watchTx(response.hash, 'Setting delegate')
    setValue('')
    onClose()
  }
  const executeSelf = async () => {
    const response = await setDelegate(account)
    watchTx(response.hash, 'Setting delegate')
    setValue('')
    onClose()
  }

  return (
    <>
      <Link onClick={onOpen} fontSize={'smaller'}>
        Change Delegate →
      </Link>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delegate your ESS</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text m="0 0 1em" fontSize="sm">
              In order to vote or submit governance proposals you must delegate
              your ESS. You can choose to delegate to yourself or another
              address to delegate on your behalf.
            </Text>
            <Box align="center" m="0 0 1em">
              <InputGroup m="0 0 1em">
                <Input
                  placeholder={'0x000....'}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </InputGroup>
              <Button
                colorScheme="green"
                w="100%"
                disabled={!ethers.utils.isAddress(value)}
                onClick={() => executeDelegate()}
              >
                Delegate ESS to address
              </Button>
              <Divider m="1em 0" />

              <Button
                colorScheme="green"
                w="100%"
                onClick={() => executeSelf()}
              >
                Delegate ESS to yourself
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
