import usdc from './usdc'
import governor from './governor'
import dollar from './dollar'
import stake from './stake'
import oldDao from './oldDao'
import oldDollar from './oldDollar'
import reserve from './reserve'

let contracts = { usdc, governor, dollar, stake, oldDao, oldDollar, reserve }

// Stake Deployed to: 0x3332f56a061cf2b4172A9DE58253AB21B4331818
// Dollar Deployed to: 0x0B283FBD3475CBf6825B3a112958Ee9b42Dfcd2b
// Registry Deployed to: 0xe13DbE3Ac039C2ca815A885017654aEd31F7B12A
// GovernorAlpha Deployed to: 0xD03a54cAdE6d8C4fe9e1D9e777bDcFC425950efc
// Reserve Deployed to: 0xFd1F0D1d393e44A37e9B2d8774AE8B36dD8014A8
contracts.oldDao.address = '0xD783084469DaFc397a06bD7a5214D75Cf4F94707'
contracts.oldDollar.address = '0xE0551610571E180FB6AE6bbEAD2e4225fe0cAb31'
contracts.reserve.address = '0x9D8bA2B9602BaE36ee2F5F072f1c7Ab8945A94f2'
contracts.governor.address = '0x986EDd56a8Ec0d1B6074ea9aeA52CE04396fA306'
contracts.dollar.address = '0x2d61A9eF1F72A1E961C7Dea4f0E25bC7E6eB4Ea7'
contracts.usdc.address = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
export default contracts
