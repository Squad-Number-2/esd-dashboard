import styled from 'styled-components'
import Head from 'next/head'

import Header from '../header'
import Footer from '../footer'

const Page = ({ children, props }) => (
  <Main>
    <Head>
      <title>Empty Set Dollar</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />
    <ContentBox>{children}</ContentBox>
    <Footer />
  </Main>
)

const Main = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`
const ContentBox = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 2;
  width: 100%;
`

export default Page
