import React, { Component } from 'react'
import logo from './logo.svg'
import './Main.css'
import app from './App'

function updateAddress(e) {
  app.update(app.db.set('rootAddress', e.target.value))
}

const Main = () => (
  <div className="App">
    <div>ENS Management</div>
    <input type="text" id="address" onChange={updateAddress} />
    <span>{app.db.get('rootAddress')}</span>
  </div>
)

export default Main;
