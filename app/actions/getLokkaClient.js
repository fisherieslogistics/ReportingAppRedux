const Lokka = require('lokka').Lokka;
var JWTAuthTransport = require('./lokkaTransportJwtAuth');
var graphQLEndpoint = require('./GraphQLEndpoint');
import request from 'superagent';

function Refresh() {
    console.log("REFRESING");
    return new Promise((resolve, reject) => {
      request.post(graphQLEndpoint + 'oauth/token')
        .type('form')
        .send({ 'grantType': 'refreshToken' })
        .send({ 'refreshToken': this.refreshToken })
        .end((err, res) => {
          if(err) {
            reject(err);
          } else {
            dispatch({
                type: 'login',
                token: res.body.accessToken,
                refreshToken: res.body.refreshToken,
            });
            resolve(res.body.accessToken);
          }
        });
    });
}

export default function(state, dispatch) {
  if(state.auth.uiLokkaClient) {
    return state.auth.uiLokkaClient;
  }
  let client = new Lokka({
      transport: new JWTAuthTransport.default(graphQLEndpoint.default + 'graphql',
       { accessToken: state.auth.token },
        Refresh.bind({ dispatch, refreshToken: state.auth.refreshToken}))
  });

  dispatch(
    {
        type: 'setLokka',
        uiLokkaClient: client
    }
  );

  return client;
}
