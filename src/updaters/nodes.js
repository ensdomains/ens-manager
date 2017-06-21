import { db, update} from 'redaxe'
import { fromJS } from 'immutable'
import { getSubdomains, getRootDomain, getOwner, getResolver, getAddr } from '../api/registry'
import { selectNode } from './nodeDetails'
import { addNotification } from './notifications'

//web3

export const updatePublicResolverReducer = (db, address) =>
  db.set('publicResolver', address)

export function updatePublicResolver(address){
  update(updatePublicResolverReducer(db, address))
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
    updatePath = resolveUpdatePath(domainArraySliced, updatePath, db)
  }

  updatePath = [...updatePath, prop]

  update(
    db.setIn(updatePath, data)
  )
}

export function setNodeDetails(name) {
  const fetchSubdomains = name =>
    getSubdomains(name).then(subdomains => {
      appendSubDomains(subdomains, name)
      subdomains.forEach(subdomain =>
        fetchSubdomains(subdomain.name)
      )
    })

  addNotification('Node details set')

  getRootDomain(name).then(rootDomain => {
    update(
      db.set('nodes', db.get('nodes').push(fromJS(rootDomain)))
    )
    selectNode(name)
    return name
  }).then(fetchSubdomains)

}

export function appendSubDomain(subDomain, domain, owner){
  const domainArray = domain.split('.')
  let indexOfNode,
      updatePath = ['nodes']

  let domainArraySliced = domainArray.slice(0, domainArray.length - 1)
  updatePath = resolveUpdatePath(domainArraySliced, updatePath, db)

  update(
    db.updateIn(updatePath, nodes => nodes.push(fromJS({
      owner,
      label: subDomain,
      node: domain,
      name: subDomain + '.' + domain,
      nodes: []
    })))
  )

  addNotification(subDomain + '.' + domain +  'subdomain found')
}

export function appendSubDomains(subDomains, rootDomain) {
  const domainArray = rootDomain.split('.')
  let updatePath = ['nodes']

  let domainArraySliced = domainArray.slice(0, domainArray.length - 1)
  updatePath = resolveUpdatePath(domainArraySliced, updatePath, db)

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

  let domainArraySliced = domainArray.slice(0, domainArray.length - 2)
  updatePath = resolveUpdatePath(domainArraySliced, updatePath, db)

  indexOfNode = db.getIn(updatePath).findIndex(node => node.get('name') === subDomain + '.' + rootDomain)
  update(
    db.updateIn(updatePath, nodes => nodes.delete(indexOfNode))
  )
}

export function resolveUpdatePath(domainArray, path, db) {
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

  return resolveUpdatePath(domainArrayPopped, updatedPath, db)
}

export function getNodeInfoSelector(name, prop) {
  const domainArray = name.split('.')
  let indexOfNode,
      updatePath = []

  let domainArraySliced = domainArray.slice(0, domainArray.length - 1)
  updatePath = resolveUpdatePath(domainArraySliced, updatePath, db)

  updatePath = [...updatePath, prop]
  return db.getIn(updatePath)
}
