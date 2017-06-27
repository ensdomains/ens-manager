import { db, update} from 'redaxe'
import { fromJS, Record } from 'immutable'
import { getSubdomains, getRootDomain, getOwner, getResolver, getAddr } from '../api/registry'
import { selectNode } from './nodeDetails'
import { addNotification } from './notifications'

//web3

export const setPublicResolverReducer = (db, address) =>
  db.set('publicResolver', address)

export function setPublicResolver(address){
  update(setPublicResolverReducer(db, address))
}

export const updateReadOnlyReducer = (db, value) =>
  db.set('readOnly', value)

export function updateReadOnly(value){
  update(updateReadOnlyReducer(db, value))
}

export function updateSearchName(name) {
  update(
    db.set('nameSearch', name)
  )
}

export function updateReverseAddress(address){
  update(
    db.set('reverseRecordSearch', address)
  )
}

export function updateNode(name, prop, data) {
  const domainArray = name.split('.')
  let indexOfNode,
      updatePath = ['nodes', 0]

  if(domainArray.length > 2) {
    let domainArraySliced = domainArray.slice(0, domainArray.length - 2)
    updatePath = resolveQueryPath(domainArraySliced, updatePath, db)
  }

  updatePath = [...updatePath, prop]

  update(
    db.setIn(updatePath, data)
  )
}

const fetchSubdomains = name =>
  getSubdomains(name).then(subdomains => {
    appendSubDomains(subdomains, name)
    subdomains.forEach(subdomain => {
      if(subdomain.decrypted) {
        fetchSubdomains(subdomain.name)
      }
    })
  })

export function setNodeDetails(name) {

  getRootDomain(name).then(rootDomain => {
    update(
      db.set('nodes', db.get('nodes').push(fromJS(rootDomain)))
    )
    selectNode(name)
    return name
  }).then(fetchSubdomains)

}

export function setReverseNodeReducer(db, reverseNode){
  return db.update('reverseNodes', nodes => nodes.push(new new Record(reverseNode)))
}

export function setReverseRecordDetails(reverseNode) {
  update(setReverseNodeReducer(db, reverseNode))
}

export function appendSubDomain(subDomainProps){
  const { label, node, labelHash } = subDomainProps
  const domainArray = node.split('.')
  let indexOfNode
  let updatePath = ['nodes']
  let domainArraySliced = domainArray.slice(0, domainArray.length - 1)

  updatePath = resolveQueryPath(domainArraySliced, updatePath, db)

  removeSubDomainWithHash(labelHash, node, updatePath) //remove duplicate

  update(
    db.updateIn(updatePath, nodes => nodes.push(fromJS({
      ...subDomainProps,
      nodes: [],
      decrypted: true
    })))
  )

  fetchSubdomains(name)
}

function removeSubDomainWithHash(labelHash, node, queryPath){
  let indexOfNode = db.getIn(queryPath).findIndex(node => node.get('labelHash') === labelHash)

  update(
    db.updateIn(queryPath, nodes => nodes.delete(indexOfNode))
  )
}

export function appendSubDomains(subDomains, rootDomain) {
  const domainArray = rootDomain.split('.')
  let updatePath = ['nodes']

  let domainArraySliced = domainArray.slice(0, domainArray.length - 1)
  updatePath = resolveQueryPath(domainArraySliced, updatePath, db)

  subDomains.forEach(domain => {
    update(
      db.updateIn(updatePath, nodes => nodes.push(fromJS(domain)))
    )
  })

  let plural = subDomains.length === 1 ? '' : 's'

  addNotification(`${subDomains.length} subdomain${plural} found for ${rootDomain}`)
}

export function removeSubDomain(subDomain, rootDomain) {
  const domainArray = rootDomain.split('.')
  let indexOfNode,
      updatePath = ['nodes']

  let domainArraySliced = domainArray.slice(0, domainArray.length - 1)
  updatePath = resolveQueryPath(domainArraySliced, updatePath, db)

  indexOfNode = db.getIn(updatePath).findIndex(node => node.get('name') === subDomain + '.' + rootDomain)
  update(
    db.updateIn(updatePath, nodes => nodes.delete(indexOfNode))
  )
}

export function resolveQueryPath(domainArray, path, db) {
  if(domainArray.length === 0 ){
    return path
  }

  let domainArrayPopped = domainArray.slice(0, domainArray.length - 1)
  let currentLabel = domainArray[domainArray.length - 1]

  function findIndex(path, db, label) {
    return db.getIn(path).findIndex(node =>
      node.get('label') === label
    );
  }

  let updatedPath;
  if(typeof path[path.length - 1] === 'string') {
    let index = findIndex(path, db, currentLabel)
    updatedPath = [...path, index, 'nodes']
  } else {
    updatedPath = [...path, 'nodes']
    let index = findIndex(updatedPath, db, currentLabel)
    updatedPath = [...updatedPath, index]
  }

  return resolveQueryPath(domainArrayPopped, updatedPath, db)
}

export function getNodeInfoSelector(db, name, prop){
  const domainArray = name.split('.')
  let indexOfNode,
      updatePath = []

  let domainArraySliced = domainArray.slice(0, domainArray.length - 1)
  updatePath = resolveQueryPath(domainArraySliced, updatePath, db)
  updatePath = [...updatePath, prop]
  return db.getIn(updatePath)
}

export function getNodeInfo(name, prop) {
  return getNodeInfoSelector(db, name, prop)
}

export function getParentNodeSelector(db, name) {
  const domainArray = name.split('.')

  if(domainArray.length === 2) { //if is just a root node
    return false
  }

  let parentNodeArray = domainArray.slice(1),
      parentNodeArraySliced = parentNodeArray.slice(0, parentNodeArray.length - 1),
      updatePath = []

  updatePath = resolveQueryPath(parentNodeArraySliced, updatePath, db)

  return db.getIn(updatePath)
}

export function getParentNode(name) {
  return getParentNodeSelector(db, name)
}

export function getReverseNodeInfoSelector(address, prop) {
  let indexOfNode = db.reverseNodes.findIndex(node => node.address === address)
  return db.getIn(['reverseNodes', indexOfNode, prop])
}
