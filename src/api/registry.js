import getENS, { getNamehash, getENSEvent, getEns } from './ens'
import { fromJS } from 'immutable'
import { decryptHashes } from './preimage'

export async function getOwner(name) {
  let { ENS , web3} = await getENS()
  return ENS.owner(name)
}

export async function getResolver(name){
  let { ENS, web3 } = await getENS()
  let registry = await ENS.registryPromise
  return registry.resolverAsync(name)
}

export async function checkSubDomain(subDomain, domain) {
  let { ENS } = await getENS()
  return ENS.owner(subDomain + '.' + domain)
}


export async function setNewOwner(name, newOwner) {
  let { ENS, web3 } = await getENS()
  return ENS.setOwner(name, newOwner, {from: web3.eth.accounts[0]})
}

export async function setSubnodeOwner(label, node, newOwner) {
  let { ENS, web3 } = await getENS()
  return ENS.setSubnodeOwner(getNamehash(node), web3.sha3(label), newOwner, {from: web3.eth.accounts[0]})
}
export async function getRootDomain(name){
  let owner = await getOwner(name)
  return fromJS([{
    name,
    owner,
    nodes: []
  }])
}

export const getSubdomains = async name => {
  let namehash = await getNamehash(name)
  let logs = await getENSEvent('NewOwner', {node: namehash}, {fromBlock: 900000, toBlock: 'latest'})
  let labels = await decryptHashes(...logs.map(log => log.args.label))
  let ownerPromises = labels.map(label => getOwner(`${label}.${name}`))
  let resolverPromises = labels.map(label => getResolver(`${label}.${name}`))

  return Promise.all([
    Promise.all(ownerPromises),
    Promise.all(resolverPromises)
  ]).then(([owners, resolvers]) => {
    return labels.map((value, index) => {
      //if(label === false)
      // TODO add check for labels that haven't been found
      return {
        label: value,
        node: name,
        owner: owners[index],
        name: value + '.' + name,
        resolver: resolvers[index],
        nodes: []
      }
    })
  })
}
