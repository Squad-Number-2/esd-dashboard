import styled from 'styled-components'
import { Row, Column } from '../components/helpers'

import { useWeb3 } from '../contexts/useWeb3'
import { web3 } from '../utils/ethers'
import { useRouter } from 'next/router'

import useCurrentBlock from '../hooks/useCurrentBlock'

import Header from '../components/header'
import Footer from '../components/footer'

export default function Home() {
  const router = useRouter()

  const { web3, connectWallet, disconnectWallet, account } = useWeb3()
  const block = useCurrentBlock()

  return (
    <div>
      <Header />
      <>
        <Wrapper>
          <Column w={'100%'} style={{ maxWidth: '1200px' }} m={'50px 0 0'}>
            <Title>Welcome to the Empty Set Dollar DAO </Title>
            <Subtitle>
              Manage your ESD, Trade you ESDS tokens and participate in
              Governance.
            </Subtitle>
          </Column>
        </Wrapper>

        <ContentWrapper ai={'center'}>
          <CardRow topRow>
            <Card wide>
              <Row>
                <Column w={'50%'}>
                  <CardTitle>Migrate your ESD V1 to ESD V1.5</CardTitle>
                  <p>
                    ESD has recently upgraded. Connect your wallet and click the
                    migrate button to burn your ESD V1 tokens and receive the
                    equivalent ESDS.
                  </p>
                  <p>
                    Learn more about the transition on <a>our blog</a>.
                  </p>
                </Column>
                <Column w={'50%'} ai={'center'}>
                  <div>
                    <InfoTitle>Your ESD V1 Balance</InfoTitle>
                    <div>ø 2,300</div>
                  </div>
                  <br />
                  <Button>Migrate Now</Button>
                </Column>
              </Row>
            </Card>
          </CardRow>
          <CardRow>
            <Card>
              <CardTitle>Your Balance</CardTitle>
              <Grid>
                <div>
                  <InfoTitle>ESD Balance</InfoTitle>
                  <div>ø 3.50</div>
                </div>
                <div>
                  <InfoTitle>ESDS Balance</InfoTitle>
                  <div>12,004.00</div>
                </div>
                <div>
                  <InfoTitle>Incentivized ESD</InfoTitle>
                  <div>ø 8,459.30</div>
                </div>
                <div>
                  <InfoTitle>Incentizer APY</InfoTitle>
                  <div>13.68%</div>
                </div>
              </Grid>
            </Card>
            <Card>
              <CardTitle>Get Started with ESD</CardTitle>
              <Column jc={'space-between'} h={'100%'} p={'10px 0 0 '}>
                <Cta onClick={() => router.push('/esd')}>
                  - Mint & Redeem ESD tokens &rarr;
                </Cta>
                <Cta onClick={() => router.push('/esds')}>
                  - Purchase ESD share tokens to earn rewards &rarr;
                </Cta>
                <Cta onClick={() => router.push('/governance')}>
                  - Make a proposal or vote in the governance process &rarr;
                </Cta>
              </Column>
            </Card>
          </CardRow>
          <Infobox ai={'center'}>
            <h1>Need to know more?</h1>
            <Row>
              <InfoCard
                href={'https://docs.emptyset.finance/'}
                target={'_blank'}
              >
                <img src={'/graphics/new.png'} style={{ width: '100%' }} />
                <h3>New to Empty Set Dollar?</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Quisque luctus, velit ac tincidunt ultrices, mauris arcu
                  imperdiet{' '}
                </p>
              </InfoCard>
              <InfoCard
                href={'https://docs.emptyset.finance/faqs/bonding'}
                target={'_blank'}
              >
                <img src={'/graphics/how.png'} style={{ width: '100%' }} />
                <h3>How do you use the DAO/LP?</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Quisque luctus, velit ac tincidunt ultrices, mauris arcu
                  imperdiet{' '}
                </p>
              </InfoCard>
              <InfoCard
                href={'https://docs.emptyset.finance/faqs/risks'}
                target={'_blank'}
              >
                <img src={'/graphics/risks.png'} style={{ width: '100%' }} />
                <h3>Learn about the Risks?</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Quisque luctus, velit ac tincidunt ultrices, mauris arcu
                  imperdiet{' '}
                </p>
              </InfoCard>
            </Row>
          </Infobox>
        </ContentWrapper>
      </>
      <Footer />
    </div>
  )
}

const Title = styled.h1`
  color: ${({ black }) => (black ? 'black' : 'white')};
  margin-bottom: 0px;
  font-weight: bold;
`
const CardTitle = styled.h2`
  margin: 0px;
  font-weight: bold;
`
const InfoTitle = styled.h3`
  font-weight: 400;
  margin-bottom: 10px;
  color: #00d661;
`
const Cta = styled.a`
  color: black;
  padding: 10px 0px;
`

const Subtitle = styled.p`
  color: white;
`
const ContentWrapper = styled(Column)`
  background: white;
  width: 100%;
  flex-grow: 1;
  margin: 150px 0 0;
  padding: 0 20px 50px;
  box-sizing: border-box;
`
const Infobox = styled(Column)`
  margin: 50px 0 0;
  max-width: 1200px;
  h3 {
    margin: 10px 0px 0px;
  }
  p {
    padding: 0px 10px;
    text-align: center;
    font-size: 14px;
    line-height: 32px;
  }
`
const InfoCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30px;
  flex-grow: 1;
  :last-child {
    margin-right: 0px;
  }
`

const CardRow = styled(Row)`
  width: 100%;
  max-width: 1200px;
  margin: ${({ topRow }) => (topRow ? '-97px 0 20px' : 0)};
`

const Card = styled(Column)`
  background: #ffffff;
  border: 1px solid #e8e8e8;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 34px 68px;
  margin-right: 30px;
  flex-grow: 1;
  max-width: ${({ wide }) => (wide ? '100%' : 'calc(50% - 15px)')};
  :last-child {
    margin-right: 0px;
  }
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  grid-auto-rows: minmax(70px, auto);
`
const Button = styled.button`
  color: #00d661;
  border: 1px solid;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 8px 16px 6px;
  background: none;
  font-size: 18px;
  outline: none;
  max-height: 40px;
`

const Wrapper = styled(Row)`
  width: 100%;
  padding: 0px 20px;
  box-sizing: border-box;
  justify-content: center;
`
