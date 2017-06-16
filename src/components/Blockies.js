import React from 'react'
import createIcon from '../lib/blockies'

export default ({ address, imageSize = 42}) => {
  var imgURL = createIcon({
    seed: address,
    size: 10,
    scale: 5,
  }).toDataURL();
  var style = {
    backgroundImage: 'url(' + imgURL + ')',
    backgroundSize: 'cover',
    width: imageSize + 'px',
    height: imageSize + 'px',
    display: 'inline-block',
  };

  return <span className="ethereum-address-icon" style={style} />
}
