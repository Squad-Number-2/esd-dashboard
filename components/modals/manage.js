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
  StatNumber
} from '@chakra-ui/react'

import useContractAllowance from '../../hooks/useContractAllowance'
import useContractBalance from '../../hooks/useContractBalance'

import { web3, setApproval, getSymbol } from '../../utils/ethers'
import {
  depositToCrvPool,
  withdrawFromCrvPool,
  claimFromCrvPool,
  exitFromCrvPool
} from '../../utils/pools'
import { migrate } from '../../utils/migration'
import { commas } from '../../utils/helpers'

import useAlerts from '../../contexts/useAlerts'

export default function Manage({ pool, incentivizer, symbol, user, poolLink }) {
  const { watchTx } = useAlerts()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deposit, setDeposit] = useState('')
  const [withdraw, setWithdraw] = useState('')

  const allowanceDeposit = useContractAllowance(
    pool.address,
    incentivizer.address
  )

  const walletBalance = useContractBalance(pool.address, 18, 4)

  const setMaxDeposit = () => {
    setDeposit(parseFloat(walletBalance))
  }

  const executeApproveDeposit = async () => {
    const response = await setApproval(pool.address, incentivizer.address)
    watchTx(response.hash, 'Approving contract')
  }
  const executeDeposit = async () => {
    const response = await depositToCrvPool(incentivizer, deposit.toString())
    watchTx(response.hash, 'Depositing ' + symbol)
    setDeposit('')
    onClose()
  }

  const executeWithdraw = async () => {
    const response = await withdrawFromCrvPool(
      incentivizer,
      withdraw.toString()
    )
    watchTx(response.hash, 'Withdrawing ' + symbol)
    setWithdraw('')
    onClose()
  }

  const executeClaim = async () => {
    const response = await claimFromCrvPool(incentivizer)
    watchTx(response.hash, 'Claiming ESS')
    onClose()
  }
  const executeExit = async () => {
    const response = await exitFromCrvPool(incentivizer)
    watchTx(response.hash, 'Exiting pool & claiming ESS')
    onClose()
  }

  return (
    <>
      <Link onClick={onOpen}>Manage →</Link>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage LP Pool - {symbol}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="grey" fontSize="sm">
              You can deposit your LP tokens into this pool to receive rewards.
            </Text>
            <Text color="grey" fontSize="sm">
              To receive LP token you can go to the pool{' '}
              <Link href={poolLink} isExternal={true}>
                <b>here</b>
              </Link>{' '}
              and add tokens.
            </Text>
            <br />
            <Text color="grey" fontSize="sm">
              Wallet: {walletBalance} {symbol}
            </Text>
            {/* DEPOSIT */}
            <Flex mb="10px">
              <InputGroup w="100">
                <Input
                  placeholder="0.00"
                  value={deposit}
                  isInvalid={parseFloat(deposit) > parseFloat(walletBalance)}
                  onChange={(e) => setDeposit(e.target.value)}
                />
                <InputRightAddon>
                  <Button onClick={() => setMaxDeposit()} variant="ghost">
                    Max
                  </Button>
                </InputRightAddon>
              </InputGroup>
              {parseInt(allowanceDeposit) === 0 ? (
                <Button
                  disabled={deposit > walletBalance}
                  colorScheme="pink"
                  onClick={() => executeApproveDeposit()}
                  ml="10px"
                >
                  Approve
                </Button>
              ) : (
                <Button
                  disabled={
                    parseFloat(deposit) > parseFloat(walletBalance) ||
                    0 === parseFloat(walletBalance) ||
                    parseFloat(walletBalance) === ''
                  }
                  colorScheme="green"
                  onClick={() => executeDeposit()}
                  ml="23px"
                >
                  Deposit
                </Button>
              )}
            </Flex>
            {/* Withdraw */}
            <Text color="grey" fontSize="sm">
              Pool: {user.underlying} {symbol}
            </Text>
            <Flex>
              <InputGroup>
                <Input
                  placeholder="0.00"
                  value={withdraw}
                  isInvalid={parseFloat(withdraw) > parseFloat(user.underlying)}
                  onChange={(e) => setWithdraw(e.target.value)}
                />
              </InputGroup>

              <Button
                disabled={
                  parseFloat(withdraw) > parseFloat(user.underlying) ||
                  0 === parseFloat(user.underlying)
                }
                colorScheme="green"
                onClick={() => executeWithdraw()}
                ml="10px"
              >
                Withdraw
              </Button>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => executeClaim()} colorScheme="green">
              Claim {commas(user.reward)} ESS
            </Button>
            <Button
              m="0 0 0 1em"
              variant="outline"
              colorScheme="grey"
              mr={3}
              onClick={() => executeExit()}
            >
              Exit & Claim
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
