import app from './App'
import Immutable, { fromJS } from 'immutable'
import { getSubdomains, getOwner, getResolver } from './api/registry'

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

export function getNodeDetails(name, address) {
  //TODO: event log for subdomains

  getSubdomains(name).then(data =>
    app.update(
      app.db.set('nodes', data)
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

export function appendSubDomain(subDomain, domain, address){

  const domainArray = domain.split('.')
  if(domainArray.length > 2) {
    const indexOfNode = app.db.get('nodes').findIndex(node =>
      node.get('domain') === domain
    );
  } else {
    app.update(
      app.db.updateIn(['nodes', 0, 'nodes'], nodes => nodes.push(fromJS({
        address,
        name: subDomain + '.' + domain,
        nodes: []
      })))
    )
  }
}
