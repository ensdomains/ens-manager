import React from 'react'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'
import Main from './Main'
import './index.css'
import Redax from './lib/Redax'
import ImmutableLogger from './lib/ImmutableLogger'
import { syncData, localStorageMiddlewareImmutable } from './lib/LocalStorage'

let syncProp = ['nodeCache', 'rootName', 'rootAddress']
let initialData = {
  rootName: '',
  rootAddress: '0x0000000000000000000000000000000000000000',
  nodes: [],
  nodeCache: [],
  selectedNode: {},
  updateForm: {
    newOwner: '',
    newResolver: ''
  }
}

//var syncedData = syncData(syncProp)(initialData)

let middleware = [
  ImmutableLogger,
  //localStorageMiddlewareImmutable(syncProp, Immutable)
]

const app = new Redax(
  Immutable.fromJS(initialData),//Immutable.fromJS(syncedData),
  () => ReactDOM.render(<Main />, document.getElementById('root')),
  middleware
)

export default app
