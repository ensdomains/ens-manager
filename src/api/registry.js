import ENS, { ens } from '../lib/ens'
import Immutable from 'immutable'
import web3 from '../lib/web3'

export function setSubnodeOwner(domain, subDomain, newOwner, account){
  //ens.setSubnodeOwner(namehash(name), web3.sha3(subDomain), newOwner, {from: account});
}

export function getOwner(name){
  return ENS.owner(name)
}

export function setNewOwner(name, newOwner){
  console.log(name, newOwner, web3.eth.accounts)
  console.log(ENS)
  return ENS.setOwner(name, newOwner, {from: web3.eth.accounts[0]})
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
  //Todo write function to get subdomains via events for 'newOwner' and 'transferOwner'
  console.log(name)

  console.log(ens)
  // ENS.registryPromise.then((registry)=> {
  //   console.log(registry)
  //   console.log(registry.allEventsAsync())
  //   return registry.allEventsAsync()
  // }).then((value)=> console.log(value))
  //const events = []

  web3.eth.getBlockNumber(function(currentBlock){
    var myEvent = ens.NewOwner({owner: '0xdf324c9a1c0fd322526fb905fde5738a89bf1850'},{fromBlock: 0, toBlock: 'latest'})

    myEvent.get(function(error, logs){
      console.log(logs)
      logs.forEach(log => console.log(log.args.owner))
    })
  })


  var mockData1 = {
      name: 'talbert.test',
      domain: ['talbert', 'test'],
      nodes: [
        {
          name: 'awesome.talbert.test',
          address: '123456',
          domain: ['awesome', 'talbert', 'test']
        },
        {
          name: 'another.talbert.test',
          address: '234567',
          domain: ['another', 'talbert', 'test']
        }
      ]
    }

  var mockData2 = {
      name: 'jefflau.test',
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


  return getOwner(name).then(address =>
    //mock data
    Immutable.fromJS([{...mockData2, address}])
  )
}
