import ModelUtils from '../utils/ModelUtils';
import UserModel from '../models/UserModel';
import VesselModel from '../models/VesselModel';
import ports from '../constants/ports';
const initialUser = ModelUtils.blankModel(UserModel);
const initialVessel = ModelUtils.blankModel(VesselModel);

const initialState = {
  ports: ports,
  vessel: initialVessel,
  containers: [
    {value: 'Tubs # 16', description: "t", weight: 26},
    {value: "Iki Bins #10 Packed", description: "i", weight: 14},
    {value: "Iki Bins flat packed", description: "u", weight: 20},
    {value: "Individual fish", description: "f", weight: 2},
    {value: "Fish in Slurry", description: "s", weight: 26},
    {value: "Bulk Kgs", description: "k", weight: 1},
    {value: "Dolav", description: "d", weight: 350},
    {value: "Iki Bins export", description: "x", weight: 14},
    {value: "Bins", description: "b", weight: 35},
  ],
  vessels: [],
  user: initialUser,
  formType: 'tcer',
  gpsUrl: null,
  gpsPort: null,
  gpsBaud: null,
  applyGpsSettings: null,
  positionType: 'native',
  catchDetailsExpanded: true,
  autoSuggestFavourites: {
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "setGpsUrl":
      state.gpsUrl = action.url;
      return state;
    case "setGpsPort":
      state.gpsPort = action.port;
      return state;
    case "setGpsBaud":
      state.gpsBaud = action.baud;
      return state;
    case "nativeGPSOn":
      state.positionType = 'native';
      return state;
    case "ipGpsOn":
      state.positionType = 'IP';
      return state;
    case "setCatchDetailsExpanded":
      state.catchDetailsExpanded = action.catchDetailsExpanded;
      return state;
    case 'setMe':
      if(!action.user){
        return state;
      }
      return state = update(state, {user: action.user});
    case 'editUser':
      let user = update(state.user, action.change);
      return update(state,  { user: user });
    case 'logout':
    case 'devMode':
      return initialState;
    case 'setUser':
      return update(state,  { user: action.user });
    case 'setVessel':
      return update(state, { vessel: action.vessel });
    case 'setFormType':
      return update(state, { formType: action.formType });
    case 'setVessels':
      return update(state, { vessels: action.vessels });
    case 'addPort':
      state.ports[action.region].push(action.port);
      return state;
    case 'addFavourite':
      switch (action.favouriteName) {
        case "targetSpecies":
        case "species":
          let faves = update({}, state.autoSuggestFavourites);
          let change = faves[action.favouriteName] || {};
          change[action.value] = (change[action.value] || 0) + 1;
          faves[action.favouriteName] = change;
          return update(state, {autoSuggestFavourites: faves});
        default:
      }
    default:
      return state;
  }
};

const update = (obj, change) => {
  return Object.assign({}, obj, change);
}
