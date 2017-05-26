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

  addNotification()

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
  let indexOfNode

  if(domainArray.length > 2) {
    indexOfNode = app.db.get('nodes').findIndex(node =>
      node.get('domain') === domain
    );
  } else {
    app.update(
      app.db.updateIn(['nodes', 0, 'nodes'], nodes => nodes.push(fromJS({
        owner,
        label: subDomain,
        node: domain,
        name: subDomain + '.' + domain,
        nodes: []
      })))
    )
  }
}

export function appendSubDomains(subDomains, rootDomain) {
  const domainArray = rootDomain.split('.')
  let indexOfNode

  if(domainArray.length > 2) {
    indexOfNode = app.db.get('nodes').findIndex(node =>
      node.get('domain') === rootDomain
    );
  }

  subDomains.forEach(domain => {
    app.update(
      app.db.updateIn(['nodes', 0, 'nodes'], nodes => nodes.push(fromJS(domain)))
    )
  })
}
