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
import StateMigratorizer from '../utils/StateMigratorizer';
import ErrorUtils from 'ErrorUtils';


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
    console.log('ErrorUtils', ErrorUtils);
    this.watchId = null;
    this.state = {
      loaded: false,
    }
  }

  get loadMigratedState(){
    return ( async () => {
      const state = await helper.loadSavedStateAsync();
      const result = this.migrateState(state);
      const hadMigrations = state && state.migrations && state.migrations.length;
      if( !hadMigrations || (result.migrations.length > state.migrations.length) ){
        await helper.saveToLocalStorage(result, 'migrations');
        return await helper.loadSavedStateAsync();
      } else {
        return Promise.resolve(state);
      }
    })();
  }

  migrateState(state){
    return StateMigratorizer(state);
  }

  componentDidMount(){
    this.loadMigratedState.then((state) => {
      stateLoadActions.loadSavedState(state);
      store.dispatch(stateLoadActions.loadSavedState(state));
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
