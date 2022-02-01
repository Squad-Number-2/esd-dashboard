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
  Link,
  Text,
  useDisclosure,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image
} from '@chakra-ui/react'

import {
  findNFTByPool,
  getNFTApproval,
  approveV3Staker,
  transferNft,
  stakeV3Token,
  claimReward,
  unstakeV3Token,
  withdrawV3Token,
  userRewards
} from '../../utils/pools'

import { commas } from '../../utils/helpers'
import useAlerts from '../../contexts/useAlerts'

export default function Manage({ account, pool, symbol, program, poolLink }) {
  const { watchTx, alerts } = useAlerts()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [rewards, setRewards] = useState('0')
  const [approval, setApproval] = useState(false)
  const [positions, setPositions] = useState([])

  useEffect(async () => {
    if (account) {
      const lpPositions = await findNFTByPool(account, pool.address, symbol)
      const approval = await getNFTApproval(account)
      const reward = await userRewards(account)
      setApproval(approval)
      setPositions(lpPositions)
      setRewards(reward)
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
    const response = await stakeV3Token(symbol, id)
    watchTx(response.hash, 'Staking NFT')
  }
  const executeUnstake = async (id) => {
    const response = await unstakeV3Token(symbol, id)
    watchTx(response.hash, 'Unstaking NFT')
  }
  const executeWithdraw = async (id) => {
    const response = await withdrawV3Token(id, account)
    watchTx(response.hash, 'Withdrawing NFT')
  }
  const executeClaim = async (amount) => {
    const response = await claimReward(account, amount)
    watchTx(response.hash, 'Claiming ESS')
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
        <ModalContent maxWidth="600px">
          <ModalHeader>Manage V3 LP Pool - {symbol}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="black" fontSize="md">
              Earning Rewards
            </Text>
            <Text color="grey" fontSize="sm">
              To earn rewards deposit your LP NFTs into the staker to receive
              rewards. To create an LP position token you can go to the pool{' '}
              <Link href={poolLink} isExternal={true}>
                <b>here</b>
              </Link>{' '}
              and provide tokens.
            </Text>
            <br />

            <Text color="black" fontSize="md">
              Claiming Reward
            </Text>
            <Text color="grey" fontSize="sm">
              To claim your rewards you need to unstake your token to sweep them
              into the claimable pool. Multiple positions can be unstaked and
              claimed at once.
            </Text>

            <Table visibility={['hidden', 'visible']} variant="simple">
              <Thead>
                <Tr>
                  <Th>Token ID</Th>
                  <Th isNumeric>Rewards</Th>
                  <Th isNumeric> </Th>
                </Tr>
              </Thead>
              <Tbody>
                {positions[0] ? (
                  positions.map((position) => (
                    <Tr key={position.id}>
                      <Td>
                        <Flex align="center">
                          <Image src="/logo/uni.svg" w="24px" m="0 10px 0 0" />#
                          {position.id}
                        </Flex>
                      </Td>
                      <Td isNumeric>{commas(position.reward / 1e18)} ESS</Td>
                      <Th isNumeric>
                        {!approval ? (
                          <Button
                            colorScheme="pink"
                            onClick={() => executeApproveTransfer()}
                          >
                            Approve Staker
                          </Button>
                        ) : null}
                        {!position.deposited && approval ? (
                          <Button
                            colorScheme="pink"
                            onClick={() => executeTransfer(position.id)}
                          >
                            Transfer
                          </Button>
                        ) : null}
                        {!position.staked && position.deposited ? (
                          <>
                            <Button
                              mr={1}
                              colorScheme="pink"
                              onClick={() => executeWithdraw(position.id)}
                            >
                              Withdraw out
                            </Button>
                            <Button
                              colorScheme="green"
                              onClick={() => executeStake(position.id)}
                            >
                              Stake
                            </Button>
                          </>
                        ) : null}
                        {position.staked ? (
                          <Button
                            colorScheme="green"
                            onClick={() => executeUnstake(position.id)}
                          >
                            Unstake
                          </Button>
                        ) : null}
                      </Th>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td></Td>
                    <Td>
                      <Flex align="center">No Position NFTs found</Flex>
                    </Td>
                    <Td></Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Flex alignItems="center">
              <Text mr={1} color="grey" fontSize="md">
                {`Claimable Rewards: ${
                  rewards ? commas(rewards / 1e18) : 0
                } ESS`}
              </Text>

              <Button
                ml={1}
                colorScheme="green"
                onClick={() => executeClaim(rewards)}
              >
                Claim ESS
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
