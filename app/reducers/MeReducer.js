import ModelUtils from '../utils/ModelUtils';
import UserModel from '../models/UserModel';
import VesselModel from '../models/VesselModel';

const initialUser = ModelUtils.blankModel(UserModel);
const initialVessel = ModelUtils.blankModel(VesselModel);

const initialState = {
  ports: ['Port of Napier', 'Eastland Port Gisbourne', 'Viaduct Harbour Auckland', 'Port Motueka', 'Port Nelson Wharf',
          'Careys bay Wharf', 'Port Chalmers', 'South Port Bluff', 'Westport Harbour Wharf',
          'Port Lyttleton', 'Prime Port Timaru'],
  vessel: initialVessel,
  vessels: [initialVessel],
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
    case 'setUser':
      console.log(initialUser);
      console.log(action);
      return update(state,  { user: action.user });
    case 'setVessel':
      return update(state, { vessel: action.vessel });
    case 'setVessels':
      return update(state, { vessels: action.vessels });
    case 'setPorts':
      return update(state, { ports: action.ports });
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
