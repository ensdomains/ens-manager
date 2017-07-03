import Immutable, { fromJS, Record, List, Map } from 'immutable'
import './index.css'
import createStore from 'redaxe'
import ImmutableLogger from './lib/ImmutableLogger'
import { syncDataImmutable, localStorageMiddlewareImmutable } from './lib/LocalStorage'

let updateFormRecord = Record({
  newOwner: '',
  newResolver: '',
  newSubDomain: '',
  subDomain: '',
  newAddr: '',
  newContent: ''
}, 'updateFormRecord')

let initialDataRecord = Record({
  nameSearch: '',
  nodes: List(),
  reverseNodes: List(),
  nodeCache: List(),
  notifications: List(),
  preImageDB: Map(),
  publicResolver: '',
  selectedNode: '',
  updateForm: updateFormRecord(),
  selectedReverseNode: '',
  reverseRecordSearch: '',
  reverseUpdateForm: new new Record({
    newName: '',
    newResolverAddr: ''
  }),
  currentTab: 'nodeDetails',
  currentAccount: ''
}, 'initialDataRecord')

let syncProp = ['preImageDB']

let initialData = new initialDataRecord()

var syncedData = syncDataImmutable(syncProp, initialData, Immutable)
let middleware = [
  ImmutableLogger,
  localStorageMiddlewareImmutable(syncProp, Immutable)
]

export default createStore(
  fromJS(syncedData),
  middleware
)
