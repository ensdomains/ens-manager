import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import NodeLayout from '../src/components/Nodes/NodeLayout'
import { Record, List, fromJS } from 'immutable'
import Blockies from '../src/components/Blockies'
import { ThemeProvider } from 'styled-components'
import theme from '../src/theme'
import '../src/globalStyles'

const BlackBackground = ({ children }) => (
  <div style={{ background: 'black', height: '100%', width: '100%' }}>
    {children}
  </div>
)

const NodeDefaults = ({ children }) => (
  <ThemeProvider theme={theme}>
    <BlackBackground>{children}</BlackBackground>
  </ThemeProvider>
)

storiesOf('Node', module)
  .add('Root node only', () => (
    <NodeDefaults>
      <NodeLayout
        db={new Record(
          {
            nodes: List(),
            selectedNode: '',
            accounts: List()
          },
          'initialDataRecord'
        )()}
        data={fromJS({
          name: 'jefflau.eth',
          owner: '0x123',
          fetchingSubdomains: false,
          nodes: []
        })}
        isSelected={() => false}
        Blockies={Blockies}
        handleSelectNode={action('clicked')}
      />
    </NodeDefaults>
  ))
  .add('Root node selected', () => (
    <NodeDefaults>
      <NodeLayout
        db={new Record(
          {
            nodes: List(),
            selectedNode: 'jefflau.eth',
            accounts: List()
          },
          'initialDataRecord'
        )()}
        data={fromJS({
          name: 'jefflau.eth',
          owner: '0x123',
          fetchingSubdomains: false,
          nodes: []
        })}
        isSelected={() => true}
        Blockies={Blockies}
        handleSelectNode={action('clicked')}
      />
    </NodeDefaults>
  ))
