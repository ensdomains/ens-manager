import { db, update} from 'redaxe'
import { fromJS, Record } from 'immutable'
import {
  getSubdomains,
  getRootDomain,
  getOwner,
  getResolver,
  getAddr,
  buildSubDomain
} from '../api/registry'
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
      updatePath = []
  let domainArraySliced = domainArray.slice(0, domainArray.length - 1)

  updatePath = resolveQueryPath(domainArraySliced, updatePath, db)
  updatePath = [...updatePath, prop]

  console.log(updatePath)

  update(
    db.setIn(updatePath, data)
  )
}

const fetchSubdomains = name =>
  getSubdomains(name).then(subdomainsRaw => {
    let subdomains = subdomainsRaw.map(subdomain => ({
        ...subdomain,
        fetchingSubdomains: subdomain.decrypted,
        refreshed: true
      })
    )

    updateNode(name, 'fetchingSubdomains', false)
    appendSubDomains(subdomains, name)
    subdomains.forEach(subdomain => {
      if(subdomain.decrypted) {
        fetchSubdomains(subdomain.name)
      }
    })
  })

const fetchSubdomainsUntil = (name, tilName) =>
  getSubdomains(name).then(subdomainsRaw => {
    let subdomains = subdomainsRaw.map(subdomain => ({
        ...subdomain,
        fetchingSubdomains: subdomain.decrypted
      })
    )

    appendSubDomains(subdomains, name)
    subdomains.forEach(subdomain => {
      if(subdomain.decrypted && subdomain.name !== tilName) {
        fetchSubdomains(subdomain.name)
      }
    })
  })

export function setNodeDetails(name) {
  getRootDomain(name).then(rootDomainRaw => {
    let rootDomain = {
      ...rootDomainRaw,
      fetchingSubdomains: true,
      refreshed: true
    }

    let domainArray = rootDomain.name.split('.')
    console.log(domainArray)

    const getDomain = name =>
      db.get('nodes').filter(node => node.get('name') === name).get(0)

    const checkDomainExists = name =>
      db.get('nodes').filter(node => node.get('name') === name).size > 0

    
    if(checkDomainExists(name) && getDomain(name).get('refreshed') === true){
      addNotification(`${name} already added as a root domain`)
      return false
    } else if(checkDomainExists(name) && getDomain(name).get('refreshed') === false) {
      console.log('here2')
      console.log(rootDomain, domainArray)
      removeRootDomain(name)
    }
    
    update(
      db.set('nodes', db.get('nodes').push(fromJS(rootDomain)))
    )
    selectNode(name)
    return name
  }).then(fetchSubdomains)
}

export function setNodeDetailsSubDomain(name, owner) {
  let domainArray = name.split('.')
  let rootDomain = domainArray.slice(-2).join('.')
  let currentDomainArray = rootDomain.split('.')
  let frontDomains = domainArray.slice(0, domainArray.length - 2)

  getRootDomain(rootDomain).then(rootDomainObj => {
    update(
      db.set('nodes', db.get('nodes').push(fromJS(rootDomainObj)))
    )
    frontDomains.forEach(async label => {
      appendSubDomain(await buildSubDomain(label, currentDomainArray.join('.'), owner))
      currentDomainArray.unshift(label)
    })
    selectNode(name)
    return rootDomain
  }).then((rootDomain)=> fetchSubdomainsUntil(rootDomain, name))
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

  if(indexOfNode === -1){
    return false
  }

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
  if(subDomains.length !== 0 ) {
    let plural = subDomains.length === 1 ? '' : 's'
    addNotification(`${subDomains.length} subdomain${plural} found for ${rootDomain}`)
  }
}

export function removeRootDomain(domain) {
  const domainArray = domain.split('.')
  let indexOfNode,
      updatePath = ['nodes']

  indexOfNode = db.getIn(updatePath).findIndex(node => node.get('name') === domainArray[0] + '.' + domainArray[1])
  update(
    db.updateIn(updatePath, nodes => nodes.delete(indexOfNode))
  )
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

export function updateReverseNode(address, prop, data) {
  let indexOfNode = db.reverseNodes.findIndex(node => node.address === address)
  update(
    db.setIn(['reverseNodes', indexOfNode, prop], data)
  )
}
