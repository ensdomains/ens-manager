import React from 'react'
import ReactDOM from 'react-dom'
import { fromJS } from 'immutable'
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
  notifications: [],
  publicResolver: '',
  selectedNode: '',
  updateForm: {
    newOwner: '',
    newResolver: '',
    newSubDomain: '',
    subDomain: ''
  }
}

//var syncedData = syncData(syncProp)(initialData)

let middleware = [
  ImmutableLogger,
  //localStorageMiddlewareImmutable(syncProp, Immutable)
]

const app = new Redax(
  fromJS(initialData),//fromJS(syncedData),
  () => ReactDOM.render(<Main />, document.getElementById('root')),
  middleware
)

export default app
