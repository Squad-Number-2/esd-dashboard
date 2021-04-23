import usdc from './usdc'
import governor from './governor'
import dollar from './dollar'
import stake from './stake'
import oldDao from './oldDao'
import oldDollar from './oldDollar'
import reserve from './reserve'
import migrator from './migrator'
import proxyAdmin from './proxyAdmin'
import registry from './registry'
import incentivisor from './incentivisor'

let contracts = {
  usdc,
  governor,
  dollar,
  stake,
  oldDao,
  oldDollar,
  reserve,
  migrator,
  proxyAdmin,
  registry,
  iEsdUsdc: {
    abi: incentivisor.abi,
    address: '0x80560504210626426F9F53f6E0a3FFaDE647079f',
    name: 'ESD/USD Incentivizor',
  },
}

// Ropsten addresses
contracts.stake.address = '0xe2b06fef1df17d00aabd091de62c7b39af950ecf'
contracts.oldDao.address = '0xD783084469DaFc397a06bD7a5214D75Cf4F94707'
contracts.oldDollar.address = '0xE0551610571E180FB6AE6bbEAD2e4225fe0cAb31'
contracts.reserve.address = '0x9D8bA2B9602BaE36ee2F5F072f1c7Ab8945A94f2'
contracts.governor.address = '0x986EDd56a8Ec0d1B6074ea9aeA52CE04396fA306'
contracts.dollar.address = '0x2d61A9eF1F72A1E961C7Dea4f0E25bC7E6eB4Ea7'
contracts.usdc.address = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
export default contracts
