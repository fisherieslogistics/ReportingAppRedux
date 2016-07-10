import ModelUtils from '../utils/ModelUtils';
import UserModel from '../models/UserModel';
import VesselModel from '../models/VesselModel';
import ports from '../constants/ports';
const initialUser = ModelUtils.blankModel(UserModel);
const initialVessel = ModelUtils.blankModel(VesselModel);

const initialState = {
  ports: ports,
  vessel: initialVessel,
  vessels: [],
  user: initialUser,
  autoSuggestFavourites: {
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'setMe':
      if(!action.user){
        return state;
      }
      return state = update(state, {user: action.user});
    case 'editUser':
      let user = update(state.user, action.change);
      return update(state,  { user: user });
    case 'logout':
      return initialState;
    case 'setUser':
      return update(state,  { user: action.user });
    case 'setVessel':
      return update(state, { vessel: action.vessel });
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
          break;
        default:
      }
    default:
      return state;
  }
};

const update = (obj, change) => {
  return Object.assign({}, obj, change);
}
