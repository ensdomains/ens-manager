import Immutable, { fromJS, Record, List } from 'immutable'
import './index.css'
import createStore from 'redaxe'
import ImmutableLogger from './lib/ImmutableLogger'
import { syncDataImmutable, localStorageMiddlewareImmutable } from './lib/LocalStorage'

let syncProp = ['nodes', 'selectedNode']
let initialData = new new Record({
  nameSearch: '',
  nodes: List(),
  reverseNodes: List(),
  nodeCache: List(),
  notifications: List(),
  publicResolver: '',
  selectedNode: '',
  updateForm: new new Record({
    newOwner: '',
    newResolver: '',
    newSubDomain: '',
    subDomain: '',
    newAddr: '',
    newContent: ''
  }),
  selectedReverseNode: '',
  reverseRecordSearch: '',
  reverseUpdateForm: new new Record({
    newName: '',
    newResolverAddr: ''
  }),
  currentTab: 'nodeDetails',
  currentAccount: ''
})

var syncedData = syncDataImmutable(syncProp, initialData, Immutable)
let middleware = [
  ImmutableLogger,
  localStorageMiddlewareImmutable(syncProp, Immutable)
]

export default createStore(
  fromJS(syncedData),
  middleware
)
