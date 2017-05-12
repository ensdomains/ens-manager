import React from 'react'
import app from '../App'

export default () => (
  <div>{app.db.get('rootName')}</div>
)
