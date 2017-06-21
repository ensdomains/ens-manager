import { fromJS } from 'immutable'
import './index.css'
import createStore from 'redaxe'
import ImmutableLogger from './lib/ImmutableLogger'
import { syncData, localStorageMiddlewareImmutable } from './lib/LocalStorage'

let syncProp = ['nodeCache', 'rootName', 'rootAddress']
let initialData = {
  nameSearch: '',
  nodes: [],
  nodeCache: [],
  notifications: [],
  publicResolver: '',
  selectedNode: '',
  updateForm: {
    newOwner: '',
    newResolver: '',
    newSubDomain: '',
    subDomain: '',
    newAddr: '',
    newContent: ''
  },
  reverseRecordSearch: '',
  reverseRecordForm: {
    name: '',
    resolverAddr: ''
  },
  currentTab: 'nodeDetails'
}

//var syncedData = syncData(syncProp)(initialData)

let middleware = [
  ImmutableLogger,
  //localStorageMiddlewareImmutable(syncProp, Immutable)
]

createStore(
  fromJS(initialData),//fromJS(syncedData),
  middleware
)
