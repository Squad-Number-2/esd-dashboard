import { useEffect, useState } from 'react'
import styled from 'styled-components'

import Page from '../../components/page'

import { useWeb3 } from '../../contexts/useWeb3'
import { zeroAddress } from '../../utils/ethers'
import { commas } from '../../utils/helpers'
import ActionModal from '../../components/modals/action'

import {
  fetchProposals,
  fetchDelegate,
  fetchDelegations,
  propose,
} from '../../utils/governor'

import {
  Flex,
  Grid,
  Box,
  Link,
  Heading,
  Text,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  Input,
  Textarea,
  Divider,
  Center,
} from '@chakra-ui/react'

export default function Home() {
  const { web3, connectWallet, disconnectWallet, account } = useWeb3()

  const [preview, setPreview] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [actions, setActions] = useState([])

  const addAction = (action) => {
    setActions([...actions, action])
    console.log(actions)
  }

  const submit = async () => {
    let targets = []
    let values = []
    let signatures = []
    let calldatas = []

    actions.map((action) => {
      targets.push(action.target)
      //   values.push(action.values)
      values.push(0)
      signatures.push(action.signature)
      calldatas.push(action.callData)
    })

    const desc = '# ' + title + '\n' + description
    const response = await propose(targets, values, signatures, calldatas, desc)
  }

  return (
    <Page
      header={'Create a new proposal'}
      subheader={
        'Enter the details of your governance action and include actions to change contracts'
      }
    >
      <Box m={'-97px 0 20px'}>
        <Flex>
          <Box
            bg="white"
            p="2em 4em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            w="60%"
          >
            <Heading fontSize="xl">Proposal Information</Heading>
            {!preview ? (
              <>
                <Text fontSize="lg" m="1em 0 .5em">
                  Title
                </Text>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Proposal title goes here"
                  size="md"
                />
                <Text fontSize="lg" m="1em 0 .5em">
                  Description
                </Text>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter proposal details here...."
                  size="md"
                />
                <Button
                  m="1em 0 0"
                  colorScheme="green"
                  size="md"
                  onClick={() => setPreview(true)}
                >
                  Preview Proposal
                </Button>
              </>
            ) : (
              <>
                <Text fontSize="lg" m="1em 0 .5em">
                  {title}
                </Text>
                <Text fontSize="sm" m="1em 0 .5em">
                  {description}
                </Text>
                <Button
                  m="1em 0 0"
                  colorScheme="green"
                  size="md"
                  variant="outline"
                  onClick={() => setPreview(false)}
                >
                  Edit Proposal
                </Button>
                <Button
                  m="1em 0 0 .5em"
                  colorScheme="green"
                  size="md"
                  onClick={() => submit()}
                >
                  Submit Proposal
                </Button>
              </>
            )}
          </Box>
          <Box
            bg="white"
            p="2em 4em"
            ml="1em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            h="fit-content"
            w="40%"
          >
            <Heading fontSize="xl" mb="1em">
              Proposal Actions
            </Heading>
            {actions
              ? actions.map((action) => (
                  <Box mb=".5em">
                    <Text fontSize="sm">{action.signature}</Text>
                    <Text fontSize="sm">{JSON.stringify(action.values)}</Text>
                  </Box>
                ))
              : null}
            <ActionModal addAction={addAction} />
          </Box>
        </Flex>
      </Box>
    </Page>
  )
}
