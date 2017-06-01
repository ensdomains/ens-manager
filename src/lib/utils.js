export function uniq(a, param){
    return a.filter(function(item, pos, array){
        return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
    })
}
