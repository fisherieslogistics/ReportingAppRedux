'use strict';
import React, { Component } from 'react';
import { View, StatusBar, AlertIOS } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import ReportingApp from './ReportingApp';
import StateLoadActions from '../actions/StateLoadActions';
import Helper from '../utils/Helper';
const helper = new Helper();
//eslint unfriendly imports
/* eslint-disable */
import * as reducers from '../reducers';
/* eslint-enable */

const stateLoadActions = new StateLoadActions();
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }

  componentDidMount(){
    helper.loadSavedStateAsync().then((state) => {
      store.dispatch(stateLoadActions.loadSavedState(state));
      this.setState({loaded: true});
    });
  }

  render() {
    if(!this.state.loaded){
      return (<View></View>);
    }
    return (
      <Provider store={store}>
        <View>
        <StatusBar
          barStyle="light-content"
        />
        <ReportingApp
          store={store} />
        </View>
      </Provider>
    );
  }
}

export default App;
