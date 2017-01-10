'use strict';
import React, { Component } from 'react';
import { View, StatusBar, AlertIOS } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import ReportingApp from './ReportingApp';
import StateLoadActions from '../actions/StateLoadActions';
import Helper from '../utils/Helper';
import StateMigratorizer from '../utils/StateMigratorizer';
//eslint unfriendly imports
/* eslint-disable */
import * as reducers from '../reducers';
import ErrorUtils from 'ErrorUtils';
const Mailer = require('NativeModules').RNMail;
/* eslint-enable */

const helper = new Helper();
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

    this.handleError = this.handleError.bind(this);
    this.email = this.email.bind(this);
    this.sendErrorMail = this.sendErrorMail.bind(this);
    this.resetState = this.resetState.bind(this);

    ErrorUtils.setGlobalHandler(this.handleError);

    this.watchId = null;
    this.state = {
      loaded: false,
    }
  }

  handleError(err){
    throw err;
    return;
    AlertIOS.alert(
      "Fatal Error",
      `An email dialog will appear - please send the email containing all your current data and the error
      'Once you have pressed send on the email - please restart the iPad then re open the app`,
      [
        {
          text: 'OK', onPress: () => {
            try {
              this.sendErrorMail(err);
            }
            catch(e) {
              this.handleNoEmail(err)
            }
          }
        }
      ]
    );
  }

  handleNoEmail(err){
    AlertIOS.alert("Error and Email not working", "Please restart iPad if still broken - then call Rimu on 0220487896")
  }

  email(to, subject, content, callback) {
    Mailer.mail({
      subject,
      recipients: [to],
      ccRecipients: [],
      bccRecipients: [],
      body: content,
    }, (error, event) => {
      callback(error, event);
    });
  }

  sendErrorMail(err) {
    helper.loadSavedStateAsync().then((state) => {
      const content = {
        errorObj: JSON.stringify(err),
        errorText: err.text,
        stack: err.stack,
        state: helper.serialize(state),
      }
      this.email("rimu@fisherylogistics.com", "error from reporting app", JSON.stringify(content), (err, event) => {
        if(err) {
          this.resetState(state);
          return;
        }
        this.resetState(state);
      });
    });
  }

  resetState(state){
    const auth = Object.assign({}, state.auth || {});
    const me = Object.assign({}, state.me || {});
    this.setState({
      loaded: false,
    });
    Promise.all([
      helper.saveErrorToLocalStorage(state, 'error'),
      helper.saveToLocalStorage({}, 'reset'),
    ]).then((res) => {
      store.dispatch(stateLoadActions.loadSavedState({auth, me}));
      setTimeout(() => {
        this.setState({loaded: true});
      }, 2000);
    }).catch(err => {
      store.dispatch(stateLoadActions.loadSavedState({}));
      setTimeout(() => {
        this.setState({loaded: true});
      }, 2000);
    });
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
      store.dispatch(stateLoadActions.loadSavedState(state));
      //setTimeout(() => {
        this.setState({loaded: true});
      //});
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
