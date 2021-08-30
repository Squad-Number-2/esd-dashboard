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

import addresses from './addresses.json'

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
}
// Hardcode Pools & Vestings
let contracts = {
  UNIV3_DSU_USDC: { abi: univ3Pool, address: addresses['UNIV3_DSU_USDC'] },
  UNIV3_ESS_WETH: { abi: univ3Pool, address: addresses['UNIV3_ESS_WETH'] },
  CURVE_DSU: { abi: curveABI, address: addresses['CURVE_DSU'] },
  INCENTIVIZER_DSU: {
    abi: IncentivizerABI,
    address: addresses['INCENTIVIZER_DSU'],
  },
  UNISWAP_DSU_ESS: { abi: curveABI, address: addresses['UNISWAP_DSU_ESS'] },
  INCENTIVIZER_DSU_ESS: {
    abi: IncentivizerABI,
    address: addresses['INCENTIVIZER_DSU_ESS'],
  },
}

Object.keys(abi).map((i) => {
  contracts[i] = { address: addresses[i], abi: abi[i] }
})

export default contracts
