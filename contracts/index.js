import usdc from './usdc'
import governor from './governor'
import dollar from './dollar'
import stake from './stake'
import oldDao from './oldDao'
import oldDollar from './oldDollar'

let contracts = { usdc, governor, dollar, stake, oldDao, oldDollar }

// Stake Deployed to: 0x3332f56a061cf2b4172A9DE58253AB21B4331818
// Dollar Deployed to: 0x0B283FBD3475CBf6825B3a112958Ee9b42Dfcd2b
// Registry Deployed to: 0xe13DbE3Ac039C2ca815A885017654aEd31F7B12A
// GovernorAlpha Deployed to: 0xD03a54cAdE6d8C4fe9e1D9e777bDcFC425950efc

contracts.governor.address = '0xD03a54cAdE6d8C4fe9e1D9e777bDcFC425950efc'
contracts.dollar.address = '0x0B283FBD3475CBf6825B3a112958Ee9b42Dfcd2b'

export default contracts
