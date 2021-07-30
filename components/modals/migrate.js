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
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react'

import useContractAllowance from '../../hooks/useContractAllowance'

import contracts from '../../contracts'
const { V1_DOLLAR, MIGRATOR } = contracts
import { web3, setApproval } from '../../utils/ethers'
import { migrate } from '../../utils/migration'

import useAlerts from '../../contexts/useAlerts'

export default function Mint({ account, esd, esds }) {
  const { watchTx } = useAlerts()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState('')

  const allowance = useContractAllowance(V1_DOLLAR.address, MIGRATOR.address)

  const executeApprove = async () => {
    const response = await setApproval(V1_DOLLAR.address, MIGRATOR.address)
    watchTx(response.hash, 'Approving ESD')
  }
  const executeMigrate = async () => {
    const response = await migrate(account)
    watchTx(response.hash, 'ESD V1 migration')
    setValue('')
    onClose()
  }

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Migrate your ESD
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Migrate your ESD/ESDS from V1</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text m="0 0 5px" fontSize="sm">
              ESD has recently upgraded and now users need to migrate their
              tokens to the next version of the protocol. The migrator will take
              ESD in your wallet and ESDS from the DAO and return you ESDS V1.5,
              a tradable ERC20 token. This action is irreversible.
            </Text>
            <Text m="0 0 5px" color="red" fontSize="sm">
              Note: The migrator will <b>not</b> migrate ESD in the LP or
              coupons. These need to be withdrawn or redeemed to be migrated
              successfully.
            </Text>
            <Flex>
              <Stat>
                <StatLabel>Dollar (ESD)</StatLabel>
                <StatNumber>ø {esd}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Stake (ESDS)</StatLabel>
                <StatNumber>ø {esds}</StatNumber>
              </Stat>
            </Flex>
          </ModalBody>
          <ModalFooter>
            {parseInt(allowance) === 0 ? (
              <Button colorScheme="pink" onClick={() => executeApprove()}>
                Approve ESD
              </Button>
            ) : (
              <Button colorScheme="green" onClick={() => executeMigrate()}>
                Migrate ESD & ESDS
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
