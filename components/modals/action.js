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
  Divider,
  Select
} from '@chakra-ui/react'

import useContractAllowance from '../../hooks/useContractAllowance'

import contracts from '../../contracts'
const { STAKE, DOLLAR, RESERVE, TIMELOCK, GOVERNORALPHA, PROP1_INIT } =
  contracts
import { ethers } from 'ethers'
import { web3, setApproval, zeroAddress } from '../../utils/ethers'
import { setDelegate } from '../../utils/governor'

export default function Delegate({ addAction }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectTarget, setSelectTarget] = useState(false)
  const [selectFunc, setSelectFunc] = useState(false)

  const [target, setTarget] = useState(false)
  const [func, setFunc] = useState(false)
  const [values, setValues] = useState([])

  const governableContracts = {
    STAKE,
    DOLLAR,
    RESERVE,
    TIMELOCK,
    GOVERNORALPHA,
    PROP1_INIT
  }

  const onTarget = (i) => {
    setSelectTarget(i)
    setTarget(governableContracts[i])
    setFunc(false)
    setSelectFunc(false)
  }

  const onFunction = (i) => {
    if (i === false) {
      setSelectFunc(i)
      setFunc(i)
      setValues([])
    } else {
      const obj = target.abi.filter(
        (item) => item.type === 'function' && item.inputs
      )[i]
      setSelectFunc(i)
      setFunc(obj)
      // Pre-fill array for values)
      setValues(obj.inputs[0] ? Array(obj.inputs.length).fill(null) : [null])
    }
  }
  const reset = () => {
    setSelectTarget(false)
    setTarget(false)
    setSelectFunc(false)
    setFunc(false)
    setValues([])
  }

  const changeValue = (i, v) => {
    let newValues = values
    newValues[i] = v
    setValues(newValues)
  }

  const generateSignature = () => {
    let inputs = []
    func.inputs.map((i) => inputs.push(i.type))
    return `${func.name}(${inputs.join(',')})`
  }

  // not needed?
  // const encodeCall = (abi, name, values) => {
  //   let iface = new ethers.utils.Interface(abi)
  //   return iface.encodeFunctionData(name, values)
  // }

  const encodeValues = (inputs, values) => {
    let types = []
    inputs.map((input) => types.push(input.type))
    const encodedVals = ethers.utils.defaultAbiCoder.encode(types, values)
    console.log(encodedVals)
    return encodedVals
  }

  const add = () => {
    let data
    if (func.inputs[0]) {
      try {
        data = encodeValues(func.inputs, values)
      } catch (error) {
        return alert(
          'Error encoding data. Please check your inputs are correct and try again'
        )
      }
    } else {
      data = '0x'
    }

    addAction({
      target: target.address,
      signature: generateSignature(),
      callData: data,
      values
    })
    reset()
    onClose()
  }

  return (
    <>
      <Button colorScheme="black" variant={'outline'} onClick={onOpen}>
        Choose a new action
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select an action</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb="0.5em">
              <Text>Contract:</Text>
              <Select
                onChange={(e) => onTarget(e.target.value)}
                value={selectTarget}
              >
                <option value={false}>Select Target</option>
                {Object.entries(governableContracts).map((item) => (
                  <option value={item[0]}>{item[0]}</option>
                ))}
              </Select>
            </Box>
            {target ? (
              <Box>
                <Text>Function:</Text>
                <Select
                  onChange={(e) => onFunction(e.target.value)}
                  value={selectFunc}
                >
                  <option value={false}>Select Function</option>
                  {target.abi
                    .filter((item) => item.type === 'function')
                    .map((item, i) => (
                      <option value={i}>{item.name}</option>
                    ))}
                </Select>
              </Box>
            ) : null}

            {func ? (
              <>
                <Divider m="1em 0" />
                <Box>
                  {func.inputs[0] ? (
                    <>
                      <Text>Inputs: {generateSignature()}</Text>
                      {func.inputs.map((input, i) => (
                        <Box p="0.5em 0 0" key={i + 'input'}>
                          <Text fontSize="sm">{`${input.name}(${input.type})`}</Text>
                          <Input
                            placeholder="New value..."
                            value={values[i]}
                            onChange={(e) => changeValue(i, e.target.value)}
                          />
                        </Box>
                      ))}
                    </>
                  ) : (
                    <Text>No Inputs</Text>
                  )}
                </Box>
              </>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button w="100%" colorScheme="green" onClick={() => add()}>
              Add Action
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
