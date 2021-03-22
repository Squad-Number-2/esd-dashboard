import { ethers } from 'ethers'
// Set provider for pre-render operations where no wallet is present.
// let provider = new ethers.providers.JsonRpcProvider(atob(ETH_NODE))
export let web3 = new ethers.providers.InfuraProvider(
  'homestead',
  process.env.INFURA
)

const MaxUint = ethers.constants.MaxUint256

export const registerProvider = (wallet) => {
  if (wallet) {
    console.log('Using Wallet provider')
    web3 = new ethers.providers.Web3Provider(wallet)
  } else if (window && window.ethereum) {
    console.log('Using Window provider')
    web3 = new ethers.providers.Web3Provider(window.ethereum)
  }
}

export const setApproval = async (contract, spender, amount) => {
  const signer = web3.getSigner()

  const erc20 = new ethers.Contract(
    contract,
    [
      {
        constant: false,
        inputs: [
          {
            name: '_spender',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    signer
  )
  try {
    return await erc20.approve(spender, amount ? amount : MaxUint)
  } catch (error) {
    return error
  }
}

export const zeroAddress = ethers.constants.AddressZero
