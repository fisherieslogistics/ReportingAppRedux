const EndpointLookup = {
  Production: 'api.fisherylogistics.com',
  Staging: 'fisherieslogistics.com',
  Local: '192.168.178.41',
  'Rimu PC ASTRO': '192.168.20.119',
  JarethIp: '192.168.20.135',
}
const port = 5003;

export default (state = EndpointLookup.Production, action) => {
  //return EndpointLookup.Production;
  console.log(state, action);
  switch(action.type){
    case "devMode":
      console.log(action);
      const endpoint = EndpointLookup[action.payload];
      return Object.assign({}, state, { ApiEndpoint: `http://${endpoint}:${port}/`});
    default:
      return EndpointLookup.Production;
  }
}

export { EndpointLookup }
