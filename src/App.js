import Immutable, { fromJS, Record, List, Map } from 'immutable'
import './index.css'
import createStore from 'redaxe'
import ImmutableLogger from './lib/ImmutableLogger'
import { syncDataImmutable, localStorageMiddlewareImmutable } from './lib/LocalStorage'
import { nodeTransformer } from './localStorage';

let updateFormRecord = Record({
  newOwner: '',
  newResolver: '',
  newSubDomain: '',
  subDomain: '',
  newAddr: '',
  newContent: ''
}, 'updateFormRecord')

let initialDataRecord = Record({
  readOnly: false,
  nameSearch: '',
  nodes: List(),
  reverseNodes: List(),
  nodeCache: List(),
  notifications: List(),
  preImageDB: Map(),
  publicResolver: '',
  selectedNode: '',
  isAboutModalActive: false,
  updateForm: updateFormRecord(),
  selectedReverseNode: '',
  reverseRecordSearch: '',
  reverseUpdateForm: new new Record({
    newName: '',
    newResolverAddr: ''
  }),
  currentTab: 'nodeDetails',
  accounts: List(),
}, 'initialDataRecord')

let initialData = new initialDataRecord()
let syncProp = ['preImageDB', 'nodes']
let transformers = [nodeTransformer]
let syncedData = syncDataImmutable(syncProp, initialData, transformers, Immutable)
let middleware = [
  ImmutableLogger,
  localStorageMiddlewareImmutable(syncProp, Immutable)
]

export default createStore(
  fromJS(syncedData),
  middleware
)
