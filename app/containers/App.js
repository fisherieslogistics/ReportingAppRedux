'use strict';
import React, { Component } from 'react';
import { View, StatusBar, AlertIOS } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import AsyncStorage from 'AsyncStorage';
import CodePush from 'react-native-code-push'
import ReportingApp from './ReportingApp';
import * as reducers from '../reducers';
import StateLoadActions from '../actions/StateLoadActions';
import Helper from '../utils/Helper';
import StateMigratorizer from '../utils/StateMigratorizer';
import ErrorUtils from 'ErrorUtils';

var Mailer = require('NativeModules').RNMail;

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
    console.log(err);
    throw err;
    /*AlertIOS.alert(
      "Fatal Error",
      `An email dialog will appear - please send the email containing all your current data and the error
      'Once you have pressed send on the email - please restart the iPad then re open the app`,
      [
        {
          text: 'OK', onPress: () => {
            this.sendErrorMail(err);
          }
        }
      ]
    );*/
  }

  email(to, subject, content, callback) {
    Mailer.mail({
      subject: subject,
      recipients: [to],
      ccRecipients: [],
      bccRecipients: [],
      body: content,
      /*attachment: {
        path: '',  // The absolute path of the file from which to read data.
        type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf
        name: '',   // Optional: Custom filename for attachment
      }*/
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
          console.log(err);
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

const MyApp = CodePush(App);

export default MyApp;
