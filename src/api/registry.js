import ENS, { ens, namehash, getENSEvent } from '../api/ens'
import Immutable from 'immutable'
import web3 from '../api/web3'
import { decryptHash } from './preimage'

export const getOwner = name =>
  ENS().then(ENS => ENS.owner(name))

export const getResolver = name =>
  ENS().then(ENS => ENS.resolver(name))

export const checkSubDomain = (subDomain, domain) =>
  ENS().then(ENS => ENS.owner(subDomain + '.' + domain))

export const setNewOwner = (name, newOwner) =>
  ENS().then(ENS => ENS.setOwner(name, newOwner, {from: web3.eth.accounts[0]}))

export const setSubnodeOwner = (label, node, newOwner) =>
  ENS().then(ENS => ENS.setSubnodeOwner(namehash(node), web3.sha3(label), newOwner, {from: web3.eth.accounts[0]});

export function getRootDomain(name){

  return getOwner(name).then(owner =>
    Immutable.fromJS([{
      name,
      owner,
      nodes: []
    }])
  )
}

export const getSubdomains = name => {
  return namehash(name).then(namehash =>
    getENSEvent('NewOwner', {node: namehash}, {fromBlock: 900000, toBlock: 'latest'}).then(logs => {
      let promises = logs.map(log => decryptHash(log.args.label))
      return Promise.all(promises).then(values => {
        let subdomains = values.map((value, index) => {
          //if(label === false)
          // TODO add check for labels that haven't been found
          return {
            label: value,
            node: name,
            owner: logs[index].args.owner,
            name: value + '.' + name,
            nodes: []
          }
        })

        return subdomains
      })
    })
  )
}
