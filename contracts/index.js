import DollarABI from './Dollar.json'
import GovernorAlphaABI from './GovernorAlpha.json'
import IncentivizerABI from './Incentivizer.json'
import MigratorABI from './Migrator.json'
import MockV1DAOABI from './MockV1DAO.json'
import MockV1DollarABI from './MockV1Dollar.json'
import ProxyImplABI from './ProxyImpl.json'
import ProxyRootABI from './ProxyRoot.json'
import RegistryABI from './Registry.json'
import ReserveABI from './Reserve.json'
import ReserveImplABI from './ReserveImpl.json'
import StakeABI from './Stake.json'
import TimelockABI from './Timelock.json'
import VesterABI from './Vester.json'
import usdcABI from './USDC.json'
import curveABI from './curve_pool.json'
import prop1init from './prop1init.json'
import batcher from './erc721batcher.json'
import univ3Positions from './univ3positions.json'
import univ3Pool from './univ3Pool.json'
import univ3Staker from './univ3Staker.json'
import wrapOnlyBatcher from './wrapOnlyBatcher.json'

import mainnet_addresses from './addresses.json'
import testnet_addresses from './goerli_addresses.json'
import { web3 } from '../utils/ethers'

const abi = {
  DOLLAR: DollarABI,
  STAKE: StakeABI,
  TIMELOCK: TimelockABI,
  REGISTRY: RegistryABI,
  GOVERNORALPHA: GovernorAlphaABI,
  PROXYIMPL: ProxyImplABI,
  PROXYROOT: ProxyRootABI,
  RESERVE: ReserveABI,
  V1_DAO: MockV1DAOABI,
  V1_DOLLAR: MockV1DollarABI,
  MIGRATOR: MigratorABI,
  USDC: usdcABI,
  PROP1_INIT: prop1init,
  BATCHER: batcher,
  UNIV3_POSITIONS: univ3Positions,
  UNIV3_STAKER: univ3Staker,
  GOVERNORALPHA_OLD: GovernorAlphaABI,
  WRAP_ONLY_BATCHER: wrapOnlyBatcher
}
// Hardcode Pools & Vestings
let mainnet = {
  UNIV3_DSU_USDC: {
    abi: univ3Pool,
    address: mainnet_addresses['UNIV3_DSU_USDC']
  },
  UNIV3_ESS_WETH: {
    abi: univ3Pool,
    address: mainnet_addresses['UNIV3_ESS_WETH']
  },
  CURVE_DSU: { abi: curveABI, address: mainnet_addresses['CURVE_DSU'] },
  INCENTIVIZER_DSU: {
    abi: IncentivizerABI,
    address: mainnet_addresses['INCENTIVIZER_DSU']
  },
  UNISWAP_DSU_ESS: {
    abi: curveABI,
    address: mainnet_addresses['UNISWAP_DSU_ESS']
  },
  INCENTIVIZER_DSU_ESS: {
    abi: IncentivizerABI,
    address: mainnet_addresses['INCENTIVIZER_DSU_ESS']
  }
}

Object.keys(abi).map((i) => {
  mainnet[i] = { address: mainnet_addresses[i], abi: abi[i] }
})

let testnet = {
  UNIV3_DSU_USDC: {
    abi: univ3Pool,
    address: 'mock'
  },
  UNIV3_ESS_WETH: {
    abi: univ3Pool,
    address: 'mock'
  },
  CURVE_DSU: { abi: curveABI, address: 'mock' },
  INCENTIVIZER_DSU: {
    abi: IncentivizerABI,
    address: 'mock'
  },
  UNISWAP_DSU_ESS: {
    abi: curveABI,
    address: 'mock'
  },
  INCENTIVIZER_DSU_ESS: {
    abi: IncentivizerABI,
    address: 'mock'
  }
}

Object.keys(abi).map((i) => {
  testnet[i] = {
    address: testnet_addresses[i] ? testnet_addresses[i] : 'mock',
    abi: abi[i]
  }
})

const contracts = () => {
  if (web3 && web3._network && web3._network.chainId === 5) return testnet
  return mainnet
}

export default contracts
