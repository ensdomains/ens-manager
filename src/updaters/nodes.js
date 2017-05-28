import app from '../App'
import { fromJS } from 'immutable'
import { getSubdomains, getRootDomain, getOwner, getResolver } from '../api/registry'
import { addNotification } from './notifications'

//web3

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

export function setNodeDetails(name, address) {
  //TODO: event log for subdomains

  addNotification('Node details set')

  getRootDomain(name).then(rootDomain => {
    app.update(
      app.db.set('nodes', rootDomain)
    )
    return name
  }).then(name =>
    getSubdomains(name).then(subdomains =>
      appendSubDomains(subdomains, name)
    )
  )


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

function resolveUpdatePath (domainArray, path, db) {
  if(domainArray.length === 0 ){
    return path
  }

  let domainArrayPopped = domainArray.slice(0, domainArray.length - 1)
  let currentLabel = domainArray[domainArray.length - 1]
  let indexOfNode = db.getIn(path).findIndex(node =>
    node.get('label') === currentLabel
  );

  let updatedPath = [...path, indexOfNode, 'nodes']

  return resolveUpdatePath(domainArrayPopped, updatedPath, db)
}
