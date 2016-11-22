const EndpointLookup = {
  Production: {
    ApiEndpoint: 'http://api.fisherylogistics.com/',
  },
  Staging: {
    ApiEndpoint: 'http://fisherieslogistics.com:5003/',
  },
  Local:  {
    ApiEndpoint: 'http://localhost:5003/',
  },
  'Rimu PC ASTRO: 192.168.20.119': {
    ApiEndpoint: 'http://192.168.20.119:5003/',
  },
}

export { EndpointLookup }

export default (state = EndpointLookup.Production, action) => {
  return {  ApiEndpoint: 'http://fisherieslogistics.com:5003/' };
  switch(action.type){
    case "devMode":
      return Object.assign({}, state, EndpointLookup[action.payload]);
    default:
      return state;
  }
}
