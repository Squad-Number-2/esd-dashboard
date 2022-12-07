import { useState } from 'react'
import { Flex, Box, Text, Button, Input } from '@chakra-ui/react'

import contracts from '../../contracts'

import useAlerts from '../../contexts/useAlerts'

import { setApproval } from '../../utils/ethers'
import { commas, isNumeric } from '../../utils/helpers'
import { redeem } from '../../utils/reserve'
import { BigNumber, utils } from 'ethers'

export default function Mint({ balance, allowance, estimates }) {
  const { watchTx } = useAlerts()

  const [valid, setValid] = useState(true)
  const [value, setValue] = useState({
    bn: BigNumber.from(0),
    string: '0.0'
  })

  const updateValue = (input) => {
    if (isNumeric(input)) {
      const bn = utils.parseUnits(input, 18)
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
    const response = await setApproval(
      contracts().DOLLAR.address,
      contracts().RESERVE.address
    )
    watchTx(response.hash, 'Approve DSU')
  }

  const executeRedeem = async () => {
    const response = await redeem(value.bn)
    watchTx(response.hash, 'Redeem USDC')
    setValue({
      bn: BigNumber.from(0),
      string: '0.0'
    })
  }

  const isInvalid = () => {
    if (value.string === '0.0') return false
    if (0 >= parseFloat(value.string)) return 'Value too low'
    if (balance < parseFloat(value.string)) return 'Balance too low'
    return false
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
            value={value.string}
            isInvalid={!valid}
            onChange={(e) => updateValue(e.target.value)}
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
            disabled={isInvalid()}
            onClick={() => executeRedeem()}
          >
            {isInvalid() ? isInvalid() : ' Redeem USDC'}
          </Button>
        )}
      </Flex>
    </Box>
  )
}
