import getENS, { getNamehash, getENSEvent } from './ens'
import { fromJS } from 'immutable'
import { decryptHashes } from './preimage'

export async function getOwner(name) {
  let { ENS , web3} = await getENS()
  return ENS.owner(name)
}
  //ENS().then(({ENS}) =>

export async function getResolver(name){
  let { ENS, web3 } = await getENS()
  return ENS.resolver(name)
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
}

// export const getSubdomains = async name => {
//   return namehash(name).then(namehash =>
//     getENSEvent('NewOwner', {node: namehash}, {fromBlock: 900000, toBlock: 'latest'}).then(logs => {
//       let labelsPromise = decryptHashes(...logs.map(log => log.args.label))
//       return labelsPromise.then(labels => {
//         let ownerPromises = labels.map(label => getOwner(`${label}.${name}`))
//
//         return Promise.all(ownerPromises).then(owners => {
//           let subdomains = labels.map((value, index) => {
//             //if(label === false)
//             // TODO add check for labels that haven't been found
//             return {
//               label: value,
//               node: name,
//               owner: owners[index],
//               name: value + '.' + name,
//               nodes: []
//             }
//           })
//
//           return subdomains
//         })
//       })
//     })
//   )
// }
