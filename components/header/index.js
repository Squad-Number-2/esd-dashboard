import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import { Row, Column } from '../helpers'
import { useWeb3 } from '../../contexts/useWeb3'

function NavBar() {
  const router = useRouter()
  const { connectWallet, disconnectWallet, account, status } = useWeb3()
  const logoUrl = `/logo/logo_${false ? 'black' : 'white'}.svg`
  console.log(account)
  /// Need to refactor to add
  const buttonText = () => {
    switch (status) {
      case 'connected':
        return account
          ? account.slice(0, 4) + '...' + account.slice(-4, -1)
          : '......'
        break
      case 'disconnected':
        return 'Connect Wallet'
        break
      default:
        return 'Connecting'
        break
    }
  }

  return (
    <Wrapper>
      <Section>
        <LogoLink onClick={() => router.push('/')}>
          <img src={logoUrl} height="40px" alt="Empty Set Dollar" />
        </LogoLink>
        <Row w={'auto'}>
          <Button
            active={router.pathname === '/stable'}
            onClick={() => router.push('/stable')}
          >
            ESD
          </Button>
          <Button
            active={router.pathname === '/share'}
            onClick={() => router.push('/share')}
          >
            ESDS
          </Button>
          <Button
            active={router.pathname === '/governance'}
            onClick={() => router.push('/governance')}
          >
            Governance
          </Button>
          <WalletButton
            inverted
            onClick={() =>
              status === 'connected'
                ? disconnectWallet()
                : connectWallet('injected')
            }
          >
            {buttonText()}
          </WalletButton>
        </Row>
      </Section>
    </Wrapper>
  )
}

const LogoLink = styled.a`
  margin-right: '16px';
  height: '40px';
`

const Wrapper = styled(Row)`
  width: 100%;
  padding: 0px 20px;
  box-sizing: border-box;
  justify-content: center;
  @media (max-width: 960px) {
    padding: 20px 20px;
  }
`

const Section = styled.header`
  background: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  width: 100%;
  max-width: 1200px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`

const Button = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 16px;
  font-size: 14px;
  height: 40px;
  color: white;
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};
  cursor: pointer;
`
const WalletButton = styled.button`
  color: ${({ inverted }) => (inverted ? 'black' : '#00d661')};
  border: ${({ inverted }) => (inverted ? 'none' : '1px solid')};
  box-sizing: border-box;
  border-radius: 8px;
  padding: 8px 16px 6px;
  background: ${({ inverted }) => (inverted ? '#00d661' : 'none')};
  font-size: 18px;
  outline: none;
`
export default NavBar
