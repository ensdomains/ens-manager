import getWeb3 from './web3'
import ENSconstructor from 'ethereum-ens'

var contracts = {
  1: {
    registry: "0x314159265dd8dbb310642f98f50c066173c1259b"
  },
  3: {
    registry: "0x112234455c3a32fd11230c42e7bccd4a84e02010"
  },
}

let ENS;

function getNamehash(name) {
  return getWeb3().then(({ web3 }) =>{
    var node = '0x0000000000000000000000000000000000000000000000000000000000000000';
    if (name !== '') {
        var labels = name.split(".");
        for(var i = labels.length - 1; i >= 0; i--) {
            node = web3.sha3(node + web3.sha3(labels[i]).slice(2), {encoding: 'hex'});
        }
    }
    return node.toString();
  })
}

let contract = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      }
    ],
    "name": "resolver",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      }
    ],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      },
      {
        "name": "label",
        "type": "bytes32"
      },
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "setSubnodeOwner",
    "outputs": [],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      },
      {
        "name": "ttl",
        "type": "uint64"
      }
    ],
    "name": "setTTL",
    "outputs": [],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      }
    ],
    "name": "ttl",
    "outputs": [
      {
        "name": "",
        "type": "uint64"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      },
      {
        "name": "resolver",
        "type": "address"
      }
    ],
    "name": "setResolver",
    "outputs": [],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      },
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "setOwner",
    "outputs": [],
    "payable": false,
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "node",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "node",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "name": "label",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "NewOwner",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "node",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "resolver",
        "type": "address"
      }
    ],
    "name": "NewResolver",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "node",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "ttl",
        "type": "uint64"
      }
    ],
    "name": "NewTTL",
    "type": "event"
  }
];


const getEns = () => {
  return getWeb3().then(({ web3, networkId }) => {
    return {
      ens: web3.eth.contract(contract).at(contracts[networkId].registry),
      web3
    }
  })
}

const getENS = async () => {
  let { web3, networkId } = await getWeb3()

  if(!ENS){
    ENS = new ENSconstructor(web3, contracts[networkId].registry)
  }

  return { ENS, web3}
}

const getENSEvent = (event, filter, params) =>
  getEns().then(({ens}) => {
    const myEvent = ens[event](filter,params)

    return new Promise(function(resolve,reject){
      myEvent.get(function(error, logs){
        console.log(logs)
        if(error) {
          reject(error)
        } else {
          resolve(logs)
        }
      })
    });
  })

const watchENSEvent = (event, filter, params, callback) =>
  getEns().then(({ens}) => {
    const myEvent = ens[event](filter,params)
      console.log(myEvent)
    return new Promise(function(resolve,reject){
      myEvent.watch(function(error, log){
        console.log('here in teh watchENS Event', log)
        if(error) {
          reject(error)
        } else {
          resolve(log)
        }
      })
    });
  })



export default getENS
export {
   getEns,
   getENSEvent,
   getNamehash,
   watchENSEvent
}
