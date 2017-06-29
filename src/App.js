import Immutable, { fromJS, Record, List } from 'immutable'
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
})

let initialDataRecord = Record({
  nameSearch: '',
  nodes: List(),
  reverseNodes: List(),
  nodeCache: List(),
  notifications: List(),
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
})

let syncProp = ['updateForm']

let initialData = initialDataRecord()

var syncedData = syncDataImmutable(syncProp, initialData, Immutable)
let middleware = [
  ImmutableLogger,
  localStorageMiddlewareImmutable(syncProp, Immutable)
]

export default createStore(
  fromJS(syncedData),
  middleware
)
