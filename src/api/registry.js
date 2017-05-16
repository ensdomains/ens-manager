import { ens, namehash, getAddr  } from '../lib/ensutils'
import Immutable from 'immutable'
import web3 from '../lib/web3'

export function setSubnodeOwner(domain, subDomain, newOwner, account){
  ens.setSubnodeOwner(namehash(name), web3.sha3(subDomain), newOwner, {from: account});
}

//ens.setSubnodeOwner(namehash('jefflau.test'), web3.sha3('awesome'), eth.accounts[0], {from: eth.accounts[0]});

export function getSubdomains(name){
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
