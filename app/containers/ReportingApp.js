'use strict';
import React, { Component } from 'react';
import Dashboard from '../components/Dashboard';
import {connect} from 'react-redux';

class ReportingApp extends Component {
  render() {
    return (<Dashboard />);
  }
}
export default connect((state, dispatch) => {
  let d_state = state.default;
  return {
  }
})(ReportingApp);
