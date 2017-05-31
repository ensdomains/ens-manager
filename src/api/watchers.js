import { watchENSEvent, getNamehash,getENSEvent} from './ens'

export async function watchResolverEvent(name) {
  let namehash = await getNamehash(name)
  return watchENSEvent('NewResolver', {node: namehash}, {fromBlock: 'latest'})
}

export async function watchOwnerEvent(name) {
  let namehash = await getNamehash(name)
  return watchENSEvent('NewOwner', {node: namehash}, {fromBlock: 'latest'})
}
