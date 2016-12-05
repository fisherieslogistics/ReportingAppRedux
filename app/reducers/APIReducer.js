const EndpointLookup = {
  Production: 'api.fisherylogistics.com',
  Staging: 'fisherieslogistics.com',
  Local: '192.168.178.41',
  'Rimu PC ASTRO': '192.168.20.119',
  JarethIp: '192.168.20.135',
}
const port = 5003;

function getEndpointObject(key){
  const endpoint = EndpointLookup[key];
  return {
    ApiEndpoint: `http://${endpoint}:${port}/`,
    AuthEndpoint: `http://${endpoint}:${port}/`,
  };
}

const production = getEndpointObject('Production');

export default (state = production, action) => {
  switch(action.type){
    case "devMode":
      return Object.assign({}, state, getEndpointObject(action.payload));
    default:
      return production;
  }
}

export { EndpointLookup }
