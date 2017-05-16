import React from 'react'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'
import Main from './Main'
import './index.css'
import Redax from './lib/Redax'
import ImmutableLogger from './lib/ImmutableLogger'

var initialData = {
  rootName: '',
  rootAddress: '0x0000000000000000000000000000000000000000',
  nodes: [],
  selectedNode: {}
}

let middleware = [ImmutableLogger]

const app = new Redax(
  Immutable.fromJS(initialData),
  () => ReactDOM.render(<Main />, document.getElementById('root')),
  middleware
)

export default app
