import { ethers } from 'ethers'
import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../contexts/useWeb3'
import { fetchBalance } from '../utils/ethers'
import contracts from '../contracts'

const currentBalance = (contract, digits, fixed) => {
  const { web3, account, status } = useWeb3()
  let [block, setBlock] = useState(0)
  let [balance, setBalance] = useState(0)

  const getBalance = async () => {
    if (contracts()[contract].address === 'mock') {
      return 0
    } else {
      // Shitty mock for multinetwork
      return await fetchBalance(
        contracts()[contract].address,
        account,
        digits,
        fixed
      )
    }
  }
  const setWatcher = () => {
    web3.on('block', async (newBlock) => {
      if (newBlock > block && newBlock !== block && account) {
        setBalance(await getBalance())
        setBlock(newBlock)
      }
    })
  }

  useEffect(() => {
    const func = async () => {
      if (account && status === 'connected' && web3) {
        setBalance(await getBalance())
      }
    }
    func()
  }, [account, status])

  useEffect(() => {
    if (web3) setWatcher()
  }, [web3])

  return balance
}

export default currentBalance
