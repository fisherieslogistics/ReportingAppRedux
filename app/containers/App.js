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

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
  }

  render() {
    var width = Dimensions.get('window').width; //full width
    var height = Dimensions.get('window').height; //full height
    return (
      <Provider store={store}>
        <View style={{paddingTop: 20, width: width, height: height}}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
        />
        <ReportingApp
          store={store} />
        </View>
      </Provider>
    );
  }
}
