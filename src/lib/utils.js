import getWeb3 from '../api/web3'

export const uniq = (a, param) =>
  a.filter((item, pos) =>
    a.map(mapItem => mapItem[param]).indexOf(item[param]) === pos
  )

export function getEtherScanAddr(){
  return getWeb3().then(({ networkId}) => {
    console.log(networkId)
    switch(networkId) {
      case 1:
        return "https://etherscan.io/"
      case "1":
        return "https://etherscan.io/"
      case 3:
        return "https://ropsten.etherscan.io/"
      case "3":
        return "https://ropsten.etherscan.io/"
    }
  })
}
