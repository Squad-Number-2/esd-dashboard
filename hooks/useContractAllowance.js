import { ethers } from 'ethers'
import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../contexts/useWeb3'
import { fetchAllowance } from '../utils/ethers'

import contracts from '../contracts'

const currentAllowance = (contract, spender, digits, fixed) => {
  const { web3, account, status } = useWeb3()
  let [block, setBlock] = useState(0)
  let [allowance, setAllowance] = useState(0)

  const getAllowance = async () => {
    if (!contracts()[contract]) return 0 // Shitty mock for multinetwork
    return await fetchAllowance(
      account,
      contracts()[contract].address,
      contracts()[spender].address,
      digits,
      fixed
    )
  }
  const setWatcher = () => {
    web3.on('block', async (newBlock) => {
      if (newBlock > block && newBlock !== block && account) {
        setAllowance(await getAllowance())
        setBlock(newBlock)
      }
    })
  }

  useEffect(() => {
    const func = async () => {
      if (account && status === 'connected') {
        setAllowance(await getAllowance())
      }
    }
    func()
  }, [account, status])

  useEffect(() => {
    const func = () => {
      if (web3) setWatcher()
    }
    func()
  }, [web3])

  return allowance
}

export default currentAllowance
