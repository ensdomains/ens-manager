import React from 'react'
import Dropdown from 'react-dropdown'
import { db } from 'redaxe'

function onSelect(){

}

export default () =>
  <div className="accounts">
    <div className="current-account">

    </div>
    <div>
      <Dropdown
        options={db.get('accounts').toJS()}
        onChange={onSelect}
        value={db.get('currentAccount')}
        placeholder="Select an option"
      />
    </div>
  </div>
