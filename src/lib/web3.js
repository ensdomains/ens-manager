import Web3 from 'web3'

let web3,
    provider

if (typeof window.web3 !== 'undefined') {
  provider = window.web3.currentProvider
  web3 = new Web3(window.web3.currentProvider);
  //console.log(window.web3)
} else {
  // set the provider you want from Web3.providers
  provider = new Web3.providers.HttpProvider("http://localhost:8545")
  web3 = new Web3(provider);
}

export default web3

export {
  provider
}
