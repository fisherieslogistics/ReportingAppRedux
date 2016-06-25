'use strict';
import React, { Component } from 'react';
import { View, Dimensions, StatusBar } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import AsyncStorage from 'AsyncStorage';
import ReportingApp from './ReportingApp';
import * as reducers from '../reducers';
import StateLoadActions from '../actions/StateLoadActions';
import Helper from '../utils/Helper';
import TimedActions from '../actions/TimedActions';

const timedActions = new TimedActions();
const helper = new Helper();
const stateLoadActions = new StateLoadActions();
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    }
  }

  componentDidMount(){
    switch ("a") {
      case "a":
          helper.loadSavedState((savedState)=>{
            store.dispatch(stateLoadActions.loadSavedState(savedState));
            setTimeout(() => {
              this.setState({loaded: true});
              timedActions.startActions(store.dispatch, store.getState);
            });
          });
        break;
      case "b":
          helper.clearLocalStorage();
        break;
    }
  }

  render() {
    var width = Dimensions.get('window').width; //full width
    var height = Dimensions.get('window').height; //full height
    if(!this.state.loaded){
      return (<View></View>);
    }
    return (
      <Provider store={store}>
        <View>
        <StatusBar />
        <ReportingApp
          store={store} />
        </View>
      </Provider>
    );
  }
}
