import { ens, namehash, getAddr, ENS  } from '../lib/ensutils'
import Immutable from 'immutable'
import web3 from '../lib/web3'

export function setSubnodeOwner(domain, subDomain, newOwner, account){
  ens.setSubnodeOwner(namehash(name), web3.sha3(subDomain), newOwner, {from: account});
}

export function getOwner(name){
  return ENS.owner(name)
}

export function setOwner(){
  // ENS
  // name string The name to update
  // address address The address of the new owner
  // options object An optional dict of parameters to pass to web3.
  // addr
  // params
}

//ens.setSubnodeOwner(namehash('jefflau.test'), web3.sha3('awesome'), eth.accounts[0], {from: eth.accounts[0]});

export function getSubdomains(name){
  //Todo write function to get subdomains via events for 'newOwner' and 'transferOwner'
  console.log(name)
  var mockData = [
    {
      name: 'jefflau.test',
      address: getAddr(name),
      domain: ['jefflau', 'test'],
      nodes: [
        {
          name: 'awesome.jefflau.test',
          address: '123456',
          domain: ['awesome', 'jefflau', 'test']
        },
        {
          name: 'another.jefflau.test',
          address: '234567',
          domain: ['another', 'jefflau', 'test']
        }
      ]
    }
  ]
  return Immutable.fromJS(mockData)
}
