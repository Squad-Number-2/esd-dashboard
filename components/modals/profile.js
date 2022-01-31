import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Link,
  Box,
  Text,
  useDisclosure,
  Button,
  Input,
  InputGroup
} from '@chakra-ui/react'

import useContractAllowance from '../../hooks/useContractAllowance'

import { ethers } from 'ethers'
import { web3, setApproval, zeroAddress } from '../../utils/ethers'
import { setAddressProfile } from '../../utils/governor'
import useAlerts from '../../contexts/useAlerts'

export default function Delegate({ account }) {
  const { addAlert } = useAlerts()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [name, setName] = useState('')
  const [twitter, setTwitter] = useState('')
  const [image, setImage] = useState('')

  const save = async () => {
    const response = await setAddressProfile(account, { name, twitter, image })
    addAlert('success', 'Set wallet profile')
    setTwitter('')
    setName('')
    setImage('')
    onClose()
  }

  return (
    <>
      <Link onClick={onOpen}>Edit Profile</Link>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Your Voting Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text m="0 0 1em" fontSize="sm">
              You are able to change the way your wallet is displayed on the
              governance pages. Fill out the fields below to update it's
              appearance.
            </Text>
            <Box align="center" m="0 0 1em">
              <InputGroup m="0 0 1em">
                <Input
                  placeholder={'Name - ie. Empty Set Squad'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </InputGroup>
              <InputGroup m="0 0 1em">
                <Input
                  placeholder={'Twitter handle - ie. @emptysetsquad'}
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
              </InputGroup>
              <InputGroup m="0 0 1em">
                <Input
                  placeholder={'Image URL - ie. https://test.com/image.png'}
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </InputGroup>
              <Button
                colorScheme="green"
                w="100%"
                isDisabled={name === ''}
                onClick={() => save()}
              >
                Sign Message & Save
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
