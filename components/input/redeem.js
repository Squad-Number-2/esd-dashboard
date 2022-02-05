import { useState } from 'react'
import { Flex, Box, Text, Button, Input } from '@chakra-ui/react'

import contracts from '../../contracts'
const { USDC, RESERVE } = contracts
import useAlerts from '../../contexts/useAlerts'

import { setApproval } from '../../utils/ethers'
import { commas } from '../../utils/helpers'
import { redeem } from '../../utils/reserve'

export default function Mint({ balance, allowance, estimates }) {
  const { watchTx } = useAlerts()
  const [value, setValue] = useState('')

  const setMax = () => {
    setValue(parseFloat(balance))
  }

  const executeApprove = async () => {
    const response = await setApproval(DOLLAR.address, RESERVE.address)
    watchTx(response.hash, 'Approve DSU')
  }

  const executeRedeem = async () => {
    const response = await redeem(value.toString())
    watchTx(response.hash, 'Redeem USDC')
    setValue('')
  }

  return (
    <Box maxW={'340px'} mr={5} mb={3}>
      <Text fontSize={'lg'} fontWeight={500}>
        {'Redeem USDC'}
      </Text>
      <Text maxW="330px">
        {
          'Your DSU can be redeemed for the underlying USDC collateral at a 1-to-1 ratio.'
        }
      </Text>
      <Box my="2">
        <Text w="full" textAlign="right" fontSize={'sm'} color={'gray.500'}>
          {`Wallet: ${commas(balance)} DSU`}
        </Text>
        <Flex borderBottom={'2px solid #000'}>
          <Input
            fontSize={'lg'}
            placeholder="0.00"
            border={0}
            _focus={{ border: 0 }}
            fontWeight={'600'}
            value={value}
            isInvalid={parseFloat(value) > parseFloat(balance)}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            onClick={() => setMax()}
            borderRadius={0}
            variant={'ghost'}
            fontSize={'xl'}
          >
            MAX
          </Button>
        </Flex>
      </Box>
      <Flex mt="5" w="full" justify={'space-between'}>
        <Box>
          <Text fontSize={'sm'}>Estimated Fee:</Text>
          <Text fontSize={'xl'} fontWeight={500}>
            {parseInt(allowance) === 0
              ? `$${estimates.approve.toFixed(2)}`
              : `$${estimates.redeem.toFixed(2)}`}
          </Text>
        </Box>
        {parseInt(allowance) === 0 ? (
          <Button
            size={'lg'}
            border="2px solid #000"
            variant={'outline'}
            colorScheme={'black'}
            onClick={() => executeApprove()}
          >
            Approve DSU
          </Button>
        ) : (
          <Button
            size={'lg'}
            border="2px solid #000"
            variant={'outline'}
            colorScheme={'black'}
            disabled={parseFloat(value) > parseFloat(balance)}
            onClick={() => executeRedeem()}
          >
            Redeem USDC
          </Button>
        )}
      </Flex>
    </Box>
  )
}
