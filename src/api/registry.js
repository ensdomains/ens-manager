import ENS, { namehash, getENSEvent } from './ens'
import { fromJS } from 'immutable'
import web3 from './web3'
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
  ENS().then(ENS => ENS.setSubnodeOwner(namehash(node), web3.sha3(label), newOwner, {from: web3.eth.accounts[0]}))

export const getRootDomain = name =>
  getOwner(name).then(owner =>
    fromJS([{
      name,
      owner,
      nodes: []
    }])
  )

export const getSubdomains = name => {
  return namehash(name).then(namehash =>
    getENSEvent('NewOwner', {node: namehash}, {fromBlock: 900000, toBlock: 'latest'}).then(logs => {
      let labelPromises = logs.map(log => decryptHash(log.args.label))
      return Promise.all(labelPromises).then(labels => {
        let ownerPromises = labels.map(label => getOwner(`${label}.${name}`))

        return Promise.all(ownerPromises).then(owners => {
          let subdomains = labels.map((value, index) => {
            //if(label === false)
            // TODO add check for labels that haven't been found
            return {
              label: value,
              node: name,
              owner: owners[index],
              name: value + '.' + name,
              nodes: []
            }
          })

          return subdomains
        })
      })
    })
  )
}
