import { fromJS, Record, List } from 'immutable'
import './index.css'
import createStore from 'redaxe'
import ImmutableLogger from './lib/ImmutableLogger'
import { syncData, localStorageMiddlewareImmutable } from './lib/LocalStorage'

let syncProp = ['nodeCache', 'rootName', 'rootAddress']
let initialData = new new Record({
  nameSearch: '',
  nodes: new List(),
  reverseNodes: new List(),
  nodeCache: new List(),
  notifications: new List(),
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
  currentTab: 'nodeDetails'
})

//var syncedData = syncData(syncProp)(initialData)

let middleware = [
  ImmutableLogger,
  //localStorageMiddlewareImmutable(syncProp, Immutable)
]

export default createStore(
  fromJS(initialData),//fromJS(syncedData),
  middleware
)
