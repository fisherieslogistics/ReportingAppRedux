"use strict";
import moment from 'moment';
import request from 'superagent';
const getLokkaClient = require('./getLokkaClient');
const graphQLEndpoint = require('./GraphQLEndpoint');

class UserActions{

    login(username, password) {
        return (dispatch, getState) => {
            request.post(graphQLEndpoint.default + 'oauth/token')
              .type('form')
              .send({ 'grantType': 'password' })
              .send({ 'username': username })
              .send({ 'password': password })
              .end((err, res) => {
                  if(err) {
                      let message = err.status == 400 ? "Incorrect Email Or Password." : "Oh no something is wrong! Please check your phone range - problem? call 0220497896";
                      dispatch({
                        type: 'loginError',
                        message: message
                      });
                  } else {
                      dispatch({
                          type: 'login',
                          token: res.body.accessToken,
                          refreshToken: res.body.refreshToken,
                          loggedIn: true
                      });
                      dispatch(this.getMe());
                  }
              });
        };
    }

    getMe() {
        return (dispatch, getState) => {
            const uiLokkaClient = getLokkaClient.default(getState().default, dispatch);
            uiLokkaClient.query(`
              {
                viewer {
                  firstName
                  lastName
                  username
                  email
                  formData{
                    cedricClientNumber
                    firstName
                    formType
                    lastName
                    permitHolderNumber
                  }
                  vessels {
                      name
                      registration
                    id: Id
                  }
                }
              }
            `).then(result => {
                dispatch({
                    type: 'setVessels',
                    vessels: result.viewer.vessels
                });
                dispatch({
                    type: 'setMe',
                    user: result.viewer
                });
                dispatch({
                    type: 'setCedricData',
                    data: result.viewer.formData
                });

            });
        };
    }
    logout(){
      return {
        type: 'logout'
      }
    }
}
export default UserActions;
