'use strict';

import request from 'superagent';
import {connect} from 'react-redux';
import moment from 'moment';
import AuthActions from '../actions/AuthActions';
import ApiEndpoint from './ApiEndpoint';
import Helper from '../utils/Helper';

const helper = new Helper();
const authActions = new AuthActions();

class Client {

  constructor(dispatch) {
    this.apiEndpoint = ApiEndpoint;
    this.dispatch = dispatch;
  }

  setAuth(auth){
    this.auth = helper.updateAuth({}, auth);
  }

  mutate(query, variables, auth){
    return this.performRefreshableRequest(this._mutate.bind(this, query, variables), auth);
  }

  query(query, auth){
    return this.performRefreshableRequest(this._query.bind(this, query), auth);
  }

  login(username, password){
    return this.promisifyRequestBody(this._login(username, password));
  }

  performRefreshableRequest(func, auth){
    this.setAuth(auth);
    let self = this;
    if(this.refreshNeeded()){
      console.log("need refresh");
      return this.promisifyRequestBody(this._refresh())
               .catch((err) => {
                 console.log(err);
                 return err;
               })
               .then((newAuth) => {
                 self.setAuth(newAuth);
                 self.dispatch(authActions.setAuth(newAuth));
                 return self.promisifyRequestBody(func());
               });
    }else{
      console.log("not need refresh");
      return this.promisifyRequestBody(func());
    }
  }

  promisifyRequestBody(req){
      return new Promise((resolve, reject) => {
      req.end((err, res) => {
        if(err){
          try{
            debugger;
            reject(err.response.text);
          }catch(e){
            console.log(e);
            debugger;
            reject(err);
          }
          return;
        }
        resolve(res.body);
      });
    });
  }

  refreshNeeded(){
    let nearFuture = new moment();
    nearFuture.add(2, 'minute');
    return (this.auth.expiresAt.unix() > nearFuture.unix())
  }

  _mutate(query, variables) {
    return request.post(this.apiEndpoint + 'graphql')
      .type('application/json')
      .send(
        {query: query, variables: {data: variables}}
      )
      .set("Authorization", "Bearer "  + this.auth.accessToken);
  }

  _query(query) {
    return request.post(this.apiEndpoint + 'graphql')
             .type('application/graphql')
             .send(query)
             .set("Authorization", "Bearer " + this.auth.accessToken);
  }

  _login(username, password){
    return request.post(this.apiEndpoint + 'oauth/token')
             .type('form')
             .send({ 'grant_type': 'password' })
             .send({ 'username': username })
             .send({ 'password': password });
  }

  _refresh(){
    return request.post(this.apiEndpoint + 'oauth/token')
             .type('form')
             .send({'grant_type': 'refresh_token'})
             .send({'refresh_token': this.auth.refreshToken});
  }

  _reject(msg){
    return Promise.reject(msg);
  }

}

export default Client;
