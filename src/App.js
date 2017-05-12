import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable'
import Main from './Main';
import './index.css';
import Redax from './lib/Redax';

var initialData = {
  rootName: '',
  rootAddress: ''
}

const app = new Redax(
  Immutable.fromJS(initialData),
  () => ReactDOM.render(<Main />, document.getElementById('root'))
)

export default app
