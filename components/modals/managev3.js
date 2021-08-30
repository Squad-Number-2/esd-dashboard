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
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react'

import useContractAllowance from '../../hooks/useContractAllowance'
import useContractBalance from '../../hooks/useContractBalance'

import { web3, setApproval, getSymbol } from '../../utils/ethers'
import {
  findNFTByPool,
  getNFTApproval,
  approveV3Staker,
  transferNft,
  stakeV3Token,
  claimReward,
} from '../../utils/pools'
import { migrate } from '../../utils/migration'
import { commas } from '../../utils/helpers'

import useAlerts from '../../contexts/useAlerts'

export default function Manage({ account, pool, symbol, program, poolLink }) {
  const { watchTx, alerts } = useAlerts()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deposit, setDeposit] = useState('')
  const [approval, setApproval] = useState(false)
  const [positions, setPositions] = useState([])

  useEffect(async () => {
    if (account) {
      const lpPositions = await findNFTByPool(account, pool.address, symbol)
      const approval = await getNFTApproval(account)
      setApproval(approval)
      setPositions(lpPositions)
      console.log(lpPositions)
    }
  }, [account, alerts])

  const executeApproveTransfer = async () => {
    const response = await approveV3Staker()
    watchTx(response.hash, 'Approving contract')
  }
  const executeTransfer = async (id) => {
    const response = await transferNft(account, id)
    watchTx(response.hash, 'Transfering NFT')
  }

  const executeStake = async (id) => {
    const response = await stakeV3Token(program, id)
    watchTx(response.hash, 'Staking NFT')
  }
  const executeClaim = async (amount) => {
    const response = await claimReward(account, amount)
    watchTx(response.hash, 'Claiming ESS')
  }

  //   const executeApproveDeposit = async () => {
  //     // const response = await setApproval(pool.address, incentivizer.address)
  //     watchTx(response.hash, 'Approving contract')
  //   }

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Manage V3 LP
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage V3 LP Pool - {symbol}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="grey" fontSize="sm">
              You can deposit your LP NFTs into the staker to receive rewards.
              To receive LP token you can go to the pool{' '}
              <Link href={poolLink} isExternal={true}>
                <b>here</b>
              </Link>{' '}
              and provide tokens.
            </Text>
            <br />
            {positions.map((position) => (
              <Flex key={position.id} justifyContent="space-between">
                TokenID: #{position.id}
                <Flex>
                  {!approval ? (
                    <Button
                      colorScheme="pink"
                      onClick={() => executeApproveTransfer()}
                    >
                      Approve
                    </Button>
                  ) : null}
                  {!position.deposited ? (
                    <Button
                      colorScheme="pink"
                      onClick={() => executeTransfer(position.id)}
                    >
                      Transfer
                    </Button>
                  ) : null}
                  {!position.staked ? (
                    <Button
                      colorScheme="green"
                      onClick={() => executeStake(position.id)}
                    >
                      Stake
                    </Button>
                  ) : null}
                  {position.staked ? (
                    <Button
                      colorScheme="green"
                      onClick={() => executeStake(position.id)}
                    >
                      Unstake
                    </Button>
                  ) : null}
                  {position.reward ? (
                    <Button
                      ml={1}
                      colorScheme="green"
                      onClick={() => executeClaim(position.reward)}
                    >
                      Claim ESS
                    </Button>
                  ) : null}
                </Flex>
              </Flex>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
