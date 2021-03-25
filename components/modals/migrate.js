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
import { web3, setApproval } from '../../utils/ethers'
import { migrate } from '../../utils/migration'

export default function Mint({ account, esd, esds }) {
  // Check Approvals
  // No letters
  // Input =< Balance

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState('')

  const allowance = useContractAllowance(
    contracts.oldDollar.address,
    contracts.migrator.address
  )

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
              <Button
                colorScheme="pink"
                onClick={() =>
                  setApproval(
                    contracts.oldDollar.address,
                    contracts.migrator.address
                  )
                }
              >
                Approve ESD
              </Button>
            ) : (
              <Button
                colorScheme="green"
                onClick={async () => await migrate(account)}
              >
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
