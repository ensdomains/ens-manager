import ENS, { ens, namehash, getENSEvent } from '../lib/ens'
import Immutable from 'immutable'
import web3 from '../lib/web3'
import { decryptHash } from './preimage'

export function setSubnodeOwner(domain, subDomain, newOwner, account){
  //ens.setSubnodeOwner(namehash(name), web3.sha3(subDomain), newOwner, {from: account});
}

export const getOwner = name =>
  ENS().then(ENS => ENS.owner(name))


export const getResolver = name =>
  ENS().then(ENS => ENS.resolver(name))

export const checkSubDomain = (subDomain, domain) =>
  ENS().then(ENS => ENS.owner(subDomain + '.' + domain))

export function setNewOwner(name, newOwner){
  // console.log(name, newOwner, web3.eth.accounts)
  // console.log(ENS)
  return ENS().then(ENS => ENS.setOwner(name, newOwner, {from: web3.eth.accounts[0]}))
  //return ENS.setOwner(name, newOwner, {from: web3.eth.accounts[0]}).catch(console.error)
  // ENS
  // name string The name to update
  // address address The address of the new owner
  // options object An optional dict of parameters to pass to web3.
  // addr
  // params
}

//ens.setSubnodeOwner(namehash('jefflau.test'), web3.sha3('awesome'), eth.accounts[0], {from: eth.accounts[0]});

export function getRootDomain(name){

  return getOwner(name).then(owner =>
    Immutable.fromJS([{
      name,
      owner,
      nodes: []
    }])
  )
}

export const getSubdomains = name =>
  namehash(name).then(namehash =>
    getENSEvent('NewOwner', {node: namehash}, {fromBlock: 900000, toBlock: 'latest'}).then(logs => {
      let promises = logs.map(log => decryptHash(log.args.label))
      return Promise.all(promises).then(values => {
        let subdomains = values.map((value, index) => {
          //if(label === false)
          return {
            label: value,
            node: name,
            owner: logs[index].args.owner,
            name: value + '.' + name,
            nodes: []
          }
        })

        console.log(subdomains)
        return subdomains
      })
    })
  )
