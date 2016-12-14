
import request from 'superagent';
import moment from 'moment';

class Client {
  constructor(dispatch, ApiEndpoint, AuthEndpoint) {
    this.apiEndpoint = ApiEndpoint;
    this.authEndpoint = AuthEndpoint;
    this.dispatch = dispatch;
    this.mutate = this.mutate.bind(this);
    this.query = this.query.bind(this);
    this.login = this.login.bind(this);
    this.performRefreshableRequest = this.performRefreshableRequest.bind(this);
    this._query = this._query.bind(this);
    this._refresh = this._refresh.bind(this);
    this._mutate = this._mutate.bind(this);
  }

  mutate(query, variables, auth){
    return this.performRefreshableRequest(this._mutate.bind(this, query, variables, auth), auth);
  }

  query(query, auth){
    return this.performRefreshableRequest(this._query.bind(this, query, auth), auth);
  }

  login(username, password){
    return this.promisifyRequestBody(this._login(username, password));
  }

  performRefreshableRequest(func, auth){
    if(this.refreshNeeded(auth)){
      return this.promisifyRequestBody(this._refresh(auth))
                 .catch((err) => {
                  throw err;
               })
               .then((newAuth) => {
                  const req = func();
                  req.set("Authorization", `Bearer ${newAuth.refreshToken}`);
                 return self.promisifyRequestBody(req);
               });
    }
    return this.promisifyRequestBody(func());
  }

  promisifyRequestBody(req){
      return new Promise((resolve, reject) => {
      req.end((err, res) => {
        if(err){
          try{
            reject(err.response.text);
          }catch(e){
            reject(err);
          }
        }else{
          resolve(res.body);
        }
      });
    });
  }

  refreshNeeded(auth){
    if(!auth){
      return true;
    }
    const nearFuture = new moment();
    nearFuture.add(2, 'minute');
    return (auth.expiresAt.unix() < nearFuture.unix());
  }

  _mutate(query, variables, auth) {
    return request.post(this.apiEndpoint + 'graphql')
      .type('application/json')
      .send(
        {query, variables: {data: variables}}
      )
      .set("Authorization", "Bearer "  + auth.accessToken);
  }

  _query(query, auth) {
    return request.post(this.apiEndpoint + 'graphql')
             .type('application/graphql')
             .send(query)
             .set("Authorization", "Bearer " + auth.accessToken);
  }

  _login(username, password){
    return request.post(this.apiEndpoint + 'oauth/token')
             .type('form')
             .send({ 'grant_type': 'password' })
             .send({ username })
             .send({ password });
  }

  _refresh({ refreshToken }){
    if(!refreshToken) {
      return Promise.reject("No Refresh Token")
    }
    return request.post(this.authEndpoint + 'oauth/token')
             .type('form')
             .send({'grant_type': 'refresh_token'})
             .send({'refresh_token': refreshToken});
  }

  _reject(msg){
    return Promise.reject(msg);
  }

}

export default Client;
