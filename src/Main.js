import React, { Component } from 'react'
import logo from './logo.svg'
import './Main.css'
import app from './App'
import Nodes from './components/Nodes'
import { getAddr } from './lib/ensutils'

function updateAddress(e) {
  app.update(
    app.db.set('rootName', e.target.value)
          .set('rootAddress', getAddr(e.target.value))
  )
}

const Main = () => (
  <div className="App">
    <div>ENS Management</div>
    <input type="text" id="address" onChange={updateAddress} />
    <span>hash</span><span>{app.db.get('rootAddress')}</span>
    <Nodes />
  </div>
)

export default Main;
