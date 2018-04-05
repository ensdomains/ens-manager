import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import { Button, Welcome } from '@storybook/react/demo'
import NodeLayout from '../src/components/Nodes/NodeLayout'
import { Record, List, fromJS } from 'immutable'
import Blockies from '../src/components/Blockies'

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
))

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ))

const initialDataRecord = Record(
  {
    nodes: List(),
    selectedNode: '',
    accounts: List()
  },
  'initialDataRecord'
)

let mockStore = new initialDataRecord()

let mockData = fromJS({
  name: 'jefflau.eth',
  owner: '0x123',
  fetchingSubdomains: false,
  nodes: []
})

storiesOf('Node', module)
  .add('with text', () => (
    <NodeLayout
      db={mockStore}
      data={mockData}
      isSelected={() => false}
      Blockies={Blockies}
    />
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ))
