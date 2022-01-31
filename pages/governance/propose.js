import { useEffect, useState } from 'react'
import Page from '../../components/page'
import { useWeb3 } from '../../contexts/useWeb3'
import { zeroAddress } from '../../utils/ethers'
import { commas } from '../../utils/helpers'
import ActionModal from '../../components/modals/action'
import Section from '../../components/section'

import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import { propose } from '../../utils/governor'
import Back from '../../components/back'
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
  IconButton
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'

export default function Home() {
  const { web3, connectWallet, disconnectWallet, account } = useWeb3()

  const [preview, setPreview] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [actions, setActions] = useState([])

  const addAction = (action) => {
    setActions([...actions, action])
  }

  const submit = async () => {
    let targets = []
    let values = []
    let signatures = []
    let calldatas = []

    actions.map((action) => {
      targets.push(action.target)
      values.push(0)
      signatures.push(action.signature)
      calldatas.push(action.callData)
    })

    const desc = '# ' + title + '\n' + description
    const response = await propose(targets, values, signatures, calldatas, desc)
  }

  const removeAction = (action) => {
    setActions(
      actions.filter((item) => JSON.stringify(item) != JSON.stringify(action))
    )
  }

  return (
    <Page
      header={'Create a new proposal'}
      subheader={
        'Enter the details of your governance action and include actions to change contracts'
      }
      back
    >
      <Section>
        <Flex>
          <Box pr="4em" w="60%">
            <Flex alignItems={'flex-end'}>
              <Back />
              <Heading fontSize="3xl" fontWeight={'400'}>
                Proposal Information
              </Heading>
            </Flex>

            <Divider mt="2" mb="4" borderWidth={1} borderColor={'black'} />
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
                  colorScheme="black"
                  variant="outline"
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
                <ReactMarkdown plugins={[gfm]} children={description} />
                <Button
                  m="1em 0 0"
                  colorScheme="black"
                  size="md"
                  variant="outline"
                  onClick={() => setPreview(false)}
                >
                  Edit Proposal
                </Button>
                <Button
                  m="1em 0 0 .5em"
                  colorScheme="pink"
                  size="md"
                  variant="outline"
                  onClick={() => submit()}
                >
                  Submit Proposal
                </Button>
              </>
            )}
          </Box>
          <Box h="fit-content" w="40%">
            <Heading fontSize="3xl" fontWeight={'400'}>
              Proposal Actions
            </Heading>
            <Divider mt="2" mb="4" borderWidth={1} borderColor={'black'} />

            {actions
              ? actions.map((action, i) => (
                  <Box mb=".5em" key={i + 'action'}>
                    <Flex align="center" justify="space-between">
                      <Text fontSize="sm">{action.signature}</Text>
                      <IconButton
                        size="sm"
                        icon={<CloseIcon />}
                        onClick={() => removeAction(action)}
                      />
                    </Flex>
                    <Text fontSize="sm">{JSON.stringify(action.values)}</Text>
                  </Box>
                ))
              : null}
            <ActionModal addAction={addAction} />
          </Box>
        </Flex>
      </Section>
    </Page>
  )
}
