"use strict";
import moment from 'moment';
import request from 'superagent';

class Client{

    constructor({endpoint, username, password, token}){
      this.graphQLEndpoint = endpoint;
      this.username = username;
      this.password = password;
      this.token = token;
    }

    setToken(token){
      this.token = token;
    }

    login() {
      var self = this;
      return new Promise((reject, resolve) => {
        request.post(self.graphQLEndpoint + 'oauth/token')
          .type('form')
          .send({ 'grantType': 'password' })
          .send({ 'username': this.username })
          .send({ 'password': this.password })
          .end((err, res) => {
            if(err){
              return reject(err);
            }else{
              self.setToken(res.body.access_token);
              return resolve(res);
            }
          });
        });
    }

    query(query){
      var self = this;
      return new Promise((resolve, reject) =>{
        request.post(self.graphQLEndpoint + 'graphql')
          .type('application/graphql')
          .send(query)
          .set("Authorization", "Bearer " + self.token)
          .end((err, res) => {
            if(err){
              reject(err);
            }else{
              resolve(res);
            }
          });
        });
    }
    /*{data: {
        geopoints: geoPoints,
        clientMutationId: "VMSData" + new Date().getTime()
      }*/
//      var query = "mutation($data: UpsertGeoPointsInput!){upsertGeoPointsMutation(input: $data){geopointIds}}";
    mutate(query, variables){
       var self = this;
        return new Promise((resolve, reject) => {
          request.post(self.graphQLEndpoint + 'graphql')
            .type('application/json')
            .send({
              query: query,
              variables: variables
            })
            .set("Authorization", "Bearer " + self.token)
            .end((err, res) => {
              if(err){
                return reject(err);
              }else{
                return resolve(res);
              }
            });
          });
    }
}
export default Client;
