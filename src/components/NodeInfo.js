import React from 'react'
import app from '../App'

export default () =>
  <div className="node-info">
    {app.db.get('selectedNode')}
  </div>
