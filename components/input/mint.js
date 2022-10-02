import { useEffect, useState } from 'react'
import { Flex, Box, Text, Button, Input } from '@chakra-ui/react'

import contracts from '../../contracts'

import useAlerts from '../../contexts/useAlerts'

import { setApproval } from '../../utils/ethers'
import { commas, isNumeric } from '../../utils/helpers'
import { mint } from '../../utils/reserve'
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
      contracts().USDC.address,
      contracts().RESERVE.address
    )
    watchTx(response.hash, 'Approving USDC')
  }

  const executeMint = async () => {
    const response = await mint(value.bn)
    watchTx(response.hash, 'Minting DSU')
    setValue({
      bn: BigNumber.from(0),
      string: '0.0'
    })
  }

  return (
    <Box maxW={'340px'} mr={5} mb={3}>
      <Text fontSize={'lg'} fontWeight={500}>
        {'Mint DSU'}
      </Text>
      <Text maxW="330px">
        {'You can mint DSU with USDC at a 1-to-1 ratio.'}
      </Text>
      <Box my="2">
        <Text w="full" textAlign="right" fontSize={'sm'} color={'gray.500'}>
          {`Wallet: ${commas(balance)} USDC`}
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
              : `$${estimates.mint.toFixed(2)}`}
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
            Approve USDC
          </Button>
        ) : (
          <Button
            size={'lg'}
            border="2px solid #000"
            variant={'outline'}
            colorScheme={'black'}
            disabled={!valid}
            onClick={() => executeMint()}
          >
            Mint DSU
          </Button>
        )}
      </Flex>
    </Box>
  )
}
