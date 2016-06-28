import ModelUtils from '../utils/ModelUtils';
import UserModel from '../models/UserModel';

const initialUser = ModelUtils.blankModel(UserModel);
const initialState = {
  ports: ['Port of Napier', 'Eastland Port Gisbourne', 'Viaduct Harbour Auckland', 'Port Motueka', 'Port Nelson Wharf',
          'Careys bay Wharf', 'Port Chalmers', 'South Port Bluff', 'Westport Harbour Wharf',
          'Port Lyttleton', 'Prime Port Timaru'],
  vessel: {name: "Nancy Glen 2", number: 76533},
  user: initialUser,
  customInputs: {
    product: [
      {label: "Bins", type: "number", name: "bins"},
      {label: "State", type: "string", name: "state"},
      {label: "Size (110)", type: "number", name: "size"},
      {label: "Notes", type: "string", name: "notes"},
      {label: "Discard KGs", type: "number", name: "discards"}
    ],
    fishingEvent: [
      {label: "Cod End", type: "string"},
      {label: "Sweeps", type: "string"},
      {label: "Bridles", type: "string"},
      {label: "Moon", type: "string"},
      {label: "Wind Speed kts", type: "number"},
      {label: "Wind direction", type: "string"},
      {label: "Notes", type: "string"}
    ]
  },
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
      console.log(user);
      return update(state,  { user: user });
    case 'setVessel':
      return update(state, { vessel: action.vessel });
    case 'setPorts':
      return update(state, { ports: action.ports });
    case 'setCedricData':
      return update(state, { cedricData: action.data});
    case 'logout':
      return update(state, defaultState);
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
