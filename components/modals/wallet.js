import { useState, useEffect } from 'react'
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
  Divider,
} from '@chakra-ui/react'
import { useWeb3 } from '../../contexts/useWeb3'

export default function WalletModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { connectWallet, disconnectWallet, account, status, balance } =
    useWeb3()

  useEffect(() => {
    if (account) onClose()
  }, [account])

  return (
    <>
      <Button
        onClick={() => (account ? null : onOpen())}
        variant="solid"
        colorScheme="green"
        boxShadow="md"
        borderRadius="lg"
      >
        <Text fontSize="sm" color="white.100" mr={2}>
          {account ? `` : 'Connect Wallet'}
        </Text>
        {account && (
          <>
            <Text fontSize="sm" m={0}>
              {account.substring(0, 6) +
                '...' +
                account.substring(account.length - 4)}
            </Text>
          </>
        )}
        {account && (
          <CancelButton
            margin={{ marginLeft: '8px' }}
            width="14px"
            height="14px"
            handleClick={() => disconnectWallet()}
          />
        )}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Connect your wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button
              m="5px 0"
              colorScheme="orange"
              variant="outline"
              w="100%"
              onClick={() => connectWallet('injected')}
            >
              <Image src="/logo/metamask.svg" height="25px" pr="5px" />
              Metamask
            </Button>
            <Button
              m="5px 0"
              colorScheme="blue"
              variant="outline"
              w="100%"
              onClick={() => connectWallet('walletconnect')}
            >
              <Image src="/logo/walletconnect.svg" height="20px" pr="5px" />
              Wallet Connect
            </Button>
            <Button
              m="5px 0"
              colorScheme="blue"
              variant="outline"
              w="100%"
              onClick={() => connectWallet('walletlink')}
            >
              <Image src="/logo/walletlink.png" height="25px" pr="5px" />
              Wallet Link
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const CancelButton = ({
  fill = '#fff',
  width = '16px',
  height = '16px',
  margin = {},
  handleClick,
}) => (
  <div
    onClick={handleClick}
    style={{
      border: 'none',
      outline: 'none',
      ...(Object.keys(margin).length && { ...margin }),
    }}
    className="reset"
  >
    <svg
      style={{
        cursor: 'pointerEvent',
        pointerEvents: 'none',
      }}
      width={width}
      height={height}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path
        d="M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z"
        fill={fill}
      />
    </svg>
  </div>
)
