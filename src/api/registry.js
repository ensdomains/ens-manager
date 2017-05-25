import ENS, { ens, namehash } from '../lib/ens'
import Immutable from 'immutable'
import web3 from '../lib/web3'
import { decryptHash } from './preimage'
import { appendSubDomains } from '../updaters/nodes'

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

export function getSubdomains(name){
  //Todo check subdomain owner and replace
  console.log(name)

  console.log(ens)

  ens.then(ens => {
    return namehash(name).then(namehash => {
      const myEvent = ens.NewOwner({ node: namehash },{fromBlock: 0, toBlock: 'latest'})

      myEvent.get(function(error, logs){
        console.log(logs)
        let promises = logs.map(log => decryptHash(log.args.label))
        Promise.all(promises).then(values => {
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
          appendSubDomains(subdomains, name)
        })
      })
    })
  })

  return getOwner(name).then(address =>
    Immutable.fromJS([{
      name,
      address,
      nodes: []
    }])
  )
}
