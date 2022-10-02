import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
  Button,
  Input,
  InputGroup,
  InputRightAddon
} from '@chakra-ui/react'

import contracts from '../../contracts'
const { USDC, RESERVE } = contracts()
import useAlerts from '../../contexts/useAlerts'

import { web3, setApproval } from '../../utils/ethers'
import { mint } from '../../utils/reserve'
import { BigNumber } from 'ethers'

export default function Mint({ balance, allowance }) {
  const { watchTx } = useAlerts()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [valid, setValid] = useState(true)
  const [value, setValue] = useState({
    bn: BigNumber.from(0),
    string: '0.0'
  })

  const updateValue = (input) => {
    if (input.match(/^\d{1,}(\.\d{0,4})?$/)) {
      const bn = BigNumber.from(input).mul(
        BigNumber.from('10').pow(BigNumber.from(6))
      )
      console.log(input)
      setValid(true)
      return setValue({ bn, string: input.toString() })
    }
    setValid(false)
    return setValue({ ...value, string: input.toString() })
  }

  const setMax = () => {
    updateValue(balance)
  }

  const executeApprove = async () => {
    const response = await setApproval(USDC.address, RESERVE.address)
    watchTx(response.hash, 'Approving USDC')
  }
  const executeMint = async () => {
    const response = await mint(value.toString())
    watchTx(response.hash, 'Minting DSU')
    setValue('')
    onClose()
  }

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Mint DSU
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint DSU tokens</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="grey" fontSize="sm">
              DSU can be minted by depositing USDC into the DAOs reserve. The
              DSU is redeemable for the contents of the reserve at the current
              reserve ratio.
            </Text>
            <br />
            <Text color="grey" fontSize="sm">
              Balance: {balance} USDC
            </Text>
            <InputGroup>
              <Input
                placeholder="0.00"
                value={value.string}
                isInvalid={parseFloat(value) > parseFloat(balance)}
                onChange={(e) => updateValue(e.target.value)}
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
                onClick={() => executeApprove()}
              >
                Approve USDC
              </Button>
            ) : (
              <Button
                disabled={valid}
                colorScheme="green"
                onClick={() => executeMint()}
              >
                Mint DSU
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
