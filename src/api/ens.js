import web3 from './web3'
import ENSconstructor from 'ethereum-ens'

var contracts = {
  1: {
    registry: "0x314159265dd8dbb310642f98f50c066173c1259b",
    publicResolver: "0x1da022710df5002339274aadee8d58218e9d6ab5"
  },
  3: {
    registry: "0x112234455c3a32fd11230c42e7bccd4a84e02010",
    publicResolver: "0x4c641fb9bad9b60ef180c31f56051ce826d21a9a"
  },
}

function namehash(name) {
  return web3().then(({ web3 }) =>{
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


const ens = web3().then(({ web3, networkId }) => {
  let contract = web3.eth.contract([
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
  ]);

  return contract.at(contracts[networkId].registry)
})


//
// function getContent(name) {
//   var node = namehash(name)
//   var resolverAddress = ens.resolver(node);
//   if (resolverAddress === '0x0000000000000000000000000000000000000000') {
//     return "0x0000000000000000000000000000000000000000000000000000000000000000";
//   }
//   return resolverContract.at(resolverAddress).content(node);
// }
const ENS = () =>
  web3().then(({ web3, networkId }) => ({
    ENS: new ENSconstructor(web3, contracts[networkId].registry),
    web3
  }))

const getENSEvent = (event, filter, params) =>
  ens.then(ens => {
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

export default ENS
export {
   ens,
   getENSEvent,
   namehash
}
