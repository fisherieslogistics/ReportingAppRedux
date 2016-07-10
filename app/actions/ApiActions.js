"use strict";

import Client from '../api/Client';
import queries from '../api/Queries';
import AuthActions from './AuthActions';
import UserActions from './UserActions';
import Helper from '../utils/Helper';

const userActions = new UserActions();
const authActions = new AuthActions();
const helper = new Helper();
let client;
class ApiActions {

  setUpClient(dispatch, timeoutMS){
    client = new Client(dispatch, timeoutMS);
  }

  login(username, password){
    return (dispatch, getState) => {
      client.login(username, password)
        .catch((err) => {
          dispatch(authActions.loginError(JSON.stringify(err)));
        })
        .then((auth) => {
          if(!auth){
            return dispatch(authActions.loginError("please try that again" + auth));
          }
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
              dispatch(authActions.setAuth(helper.updateAuth({}, auth)));
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
