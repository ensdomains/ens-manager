import { fromJS, Record, List } from 'immutable'
import './index.css'
import createStore from 'redaxe'
import ImmutableLogger from './lib/ImmutableLogger'
import { syncData, localStorageMiddlewareImmutable } from './lib/LocalStorage'

let syncProp = ['nodeCache', 'rootName', 'rootAddress']
let initialData = new Record({
  nameSearch: '',
  nodes: new List(),
  reverseNodes: new List(),
  nodeCache: new List(),
  notifications: new List(),
  publicResolver: '',
  selectedNode: '',
  updateForm: ({
    newOwner: '',
    newResolver: '',
    newSubDomain: '',
    subDomain: '',
    newAddr: '',
    newContent: ''
  }),
  selectedReverseNode: '',
  reverseRecordSearch: '',
  reverseRecordForm: new new Record({
    name: '',
    resolverAddr: ''
  }),
  currentTab: 'nodeDetails'
})

console.log(new initialData)
//var syncedData = syncData(syncProp)(initialData)

let middleware = [
  ImmutableLogger,
  //localStorageMiddlewareImmutable(syncProp, Immutable)
]

export default createStore(
  fromJS(new initialData),//fromJS(syncedData),
  middleware
)
