import app from '../App'
import { fromJS } from 'immutable'
import { getSubdomains, getRootDomain, getOwner, getResolver } from '../api/registry'
import { addNotification } from './notifications'

//web3

export function updatePublicResolver(address){
  app.update(
    app.db.set('publicResolver', address)
  )
}

export function updateReadOnly(value){
  app.update(
    app.db.set('readOnly', value)
  )
}

export function updateAddress(value) {
  app.update(
    app.db.set('rootName', value)
  )
  getOwner(value).then(owner =>
    app.update(app.db.set('rootAddress', owner))
  )
}

export function updateForm(formName, data) {
  app.update(
    app.db.setIn(['updateForm', formName], data)
  )
}

export function updateNode(name, prop, data) {
  const domainArray = name.split('.')
  let indexOfNode,
      updatePath = ['nodes', 0]

  if(domainArray.length > 2) {
    let domainArraySliced = domainArray.slice(0, domainArray.length - 2)
    updatePath = resolveUpdatePath(domainArraySliced, updatePath, app.db)
  }

  updatePath = [...updatePath, prop]

  app.update(
    app.db.setIn(updatePath, data)
  )
}

export function setNodeDetails(name, address) {
  const fetchSubdomains = name =>
    getSubdomains(name).then(subdomains => {
      appendSubDomains(subdomains, name)
      subdomains.forEach(subdomain =>
        fetchSubdomains(subdomain.name)
      )
    })

  addNotification('Node details set')

  getRootDomain(name).then(rootDomain => {
    app.update(
      app.db.set('nodes', rootDomain)
    )
    return name
  }).then(fetchSubdomains)

  getResolver(name).then(data =>
    app.update(
      app.db.set('resolver', data)
    )
  )

}

export function selectNode(data) {
  app.update(
    app.db.set('selectedNode', data)
  )
}

export function appendSubDomain(subDomain, domain, owner){
  const domainArray = domain.split('.')
  let indexOfNode,
      updatePath = ['nodes', 0, 'nodes']

  if(domainArray.length > 2) {
    let domainArraySliced = domainArray.slice(0, domainArray.length - 2)
    updatePath = resolveUpdatePath(domainArraySliced, updatePath, app.db)
  }

  app.update(
    app.db.updateIn(updatePath, nodes => nodes.push(fromJS({
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
  let indexOfNode,
      updatePath = ['nodes', 0, 'nodes']

  if(domainArray.length > 2) {
    let domainArraySliced = domainArray.slice(0, domainArray.length - 2)
    updatePath = resolveUpdatePath(domainArraySliced, updatePath, app.db)
  }

  subDomains.forEach(domain => {
    app.update(
      app.db.updateIn(updatePath, nodes => nodes.push(fromJS(domain)))
    )
  })

  addNotification(subDomains.length + ' subdomains found')
}

export function resolveUpdatePath (domainArray, path, db) {
  if(domainArray.length === 0 ){
    return path
  }

  let domainArrayPopped = domainArray.slice(0, domainArray.length - 1)
  let currentLabel = domainArray[domainArray.length - 1]


  console.log(db.getIn(path))
  let indexOfNode = db.getIn(path).findIndex(node =>
    node.get('label') === currentLabel
  );

  let updatedPath;
  if(typeof domainArray[domainArray.length - 1] === 'string') {
    updatedPath = [...path, indexOfNode, 'nodes']
  } else {
    updatedPath = [...path, 'nodes', indexOfNode]
  }

  return resolveUpdatePath(domainArrayPopped, updatedPath, db)
}
