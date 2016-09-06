const lookup = {
  Production: {
    ApiEndpoint: 'http://api.fisherylogistics.com/',
  },
  Staging: {
    ApiEndpoint: 'http://fisherieslogistics.com:5003/',
  },
  Local:  {
    ApiEndpoint: 'http://localhost:5003/',
  }
}

export default (state = lookup.Production, action) => {
  switch(action.type){
    case "devMode":
      return Object.assign({}, lookup[action.payload]);
    default:
      return state;
  }
}
