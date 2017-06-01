export const uniq = (a, param) =>
  a.filter((item, pos) =>
    a.map(mapItem => mapItem[param]).indexOf(item[param]) === pos
  )
