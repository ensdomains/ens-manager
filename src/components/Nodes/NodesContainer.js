import { db } from 'redaxe';
import { withProps, compose } from 'recompose';
import NodesLayout from './NodesLayout';
import React from 'react';
const alphabeticalSort = (a, b) => a.get('name').localeCompare(b.get('name'));

const NodesContainer = compose(withProps(props => ({ db, alphabeticalSort })))(
  NodesLayout
);

export default NodesContainer;
