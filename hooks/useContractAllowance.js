import { ethers } from 'ethers'
import { web3 } from '../utils/ethers'
import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../contexts/useWeb3'

const currentBalance = (contract, spender, digits, fixed) => {
  const { account } = useWeb3()
  let [block, setBlock] = useState(0)
  let [balance, setBalance] = useState(0)

  const erc20 = new ethers.Contract(
    contract,
    [
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
          {
            name: '_spender',
            type: 'address',
          },
        ],
        name: 'allowance',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ],
    web3
  )

  const fetchAllowance = async () => {
    const rawNum = await erc20.allowance(account, spender)
    const normalised = parseFloat(
      ethers.utils.formatUnits(rawNum, digits || 18)
    ).toFixed(fixed ? fixed : 4)
    setBalance(normalised)
  }

  useEffect(() => {
    if (account) fetchAllowance()
  }, [account])

  useEffect(() => {
    web3.on('block', async (newBlock) => {
      if (newBlock > block && newBlock !== block && account) {
        fetchAllowance()
        setBlock(newBlock)
      }
    })
  }, [])

  return balance
}

export default currentBalance
