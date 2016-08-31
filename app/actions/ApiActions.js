"use strict";

import Client from '../api/Client';
import queries from '../api/Queries';
import AuthActions from './AuthActions';
import UserActions from './UserActions';
import Helper from '../utils/Helper';
import {
  AlertIOS,
} from 'react-native';

const userActions = new UserActions();
const authActions = new AuthActions();
const helper = new Helper();
let client;
class ApiActions {

  setUpClient(dispatch, ApiEndpoint, timeoutMS){
    client = new Client(dispatch, ApiEndpoint, timeoutMS);
  }

  login(username, password){
    return (dispatch, getState) => {
      client.login(username, password)
        .catch((err) => {
          //dispatch(authActions.loginError(JSON.stringify(err)));

          //TODO: USE SERVER ERROR IN FUTURE
        })
        .then((auth) => {
          if(!auth){
            return dispatch(authActions.loginError("please try that again" + auth));
          }else{
            //TODO: This needs to be in a popup dispatcher and not in the logic here
            AlertIOS.alert(
              "Login Succes!",
              'Press Ok to continue',
              [
                {text: 'Ok', onPress: () => {
                  return;
                }, style: 'cancel'},
              ]
            );

          }
          dispatch(authActions.setAuth(auth));
          client.query(queries.getMe, helper.updateAuth({}, auth))
            .catch((err) => {
              console.log(err);
            })
            .then((res) => {
              let viewer = res.data.viewer;
              dispatch(userActions.setVessels(viewer.vessels));
              if(viewer.vessels.length){
                dispatch(userActions.setVessel(viewer.vessels[0]));
              }
              dispatch(userActions.setUser(parseUser(viewer)));
            });

        });
     }
  }

  query(query, auth, callback){

  }

  mutate(mutation, variables, auth){
    return client.mutate(mutation, variables, auth);
  }

}

const parseUser = (viewer) => {
  return {
    firstName: viewer.firstName,
    lastName: viewer.lastName,
    permitHolderName: viewer.formData.permit_holder_name,
    permitHolderNumber: viewer.formData.permit_holder_number,
    email: viewer.email,
  }
}

export default ApiActions;
