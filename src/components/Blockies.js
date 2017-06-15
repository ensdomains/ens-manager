import React from 'react'
import createIcon from '../lib/blockies'

export default ({ address, imageSize = 16}) => {
  var imgURL = createIcon({
    seed: address,
    size: 4,
    scale: 2,
  }).toDataURL();
  var style = {
    backgroundImage: 'url(' + imgURL + ')',
    width: imageSize + 'px',
    height: imageSize + 'px',
    display: 'inline-block',
  };

  return <span className="ethereum-address-icon" style={style} />
}
