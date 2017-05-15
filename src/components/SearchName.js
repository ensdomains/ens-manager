import React from 'react'
import { updateAddress } from '../updaters'
import app from '../App'

export default () =>
  <div className="search-name">
    <input type="text" id="address" onChange={(e) => updateAddress(e.target.value)} />
    <span>hash</span><span>{app.db.get('rootAddress')}</span>
  </div>
