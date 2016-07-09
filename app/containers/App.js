'use strict';
import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import AsyncStorage from 'AsyncStorage';
import ReportingApp from './ReportingApp';
import * as reducers from '../reducers';
import StateLoadActions from '../actions/StateLoadActions';
import Helper from '../utils/Helper';

const helper = new Helper();
const stateLoadActions = new StateLoadActions();
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.watchId = null;
    this.state = {
      loaded: false,
    }
  }

  componentDidMount(){
    helper.loadSavedState((savedState)=>{
      store.dispatch(stateLoadActions.loadSavedState(savedState));
      setTimeout(() => {
        this.setState({loaded: true});
      });
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
          barStyle="default"
        />
        <ReportingApp
          store={store} />
        </View>
      </Provider>
    );
  }
}
