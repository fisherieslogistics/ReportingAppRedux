import ModelUtils from '../utils/ModelUtils';
import UserModel from '../models/UserModel';
import VesselModel from '../models/VesselModel';
import ports from '../constants/ports';
const initialUser = ModelUtils.blankModel(UserModel, 'USER');
const initialVessel = ModelUtils.blankModel(VesselModel, 'VESSEL');

const initialState = {
  ports,
  vessel: initialVessel,
  user: initialUser,
  hostIp: '192.168.1.1',
  hostPort: '5003',
  autoSuggestFavourites: {
    speciesCode: [],
    targetSpecies: [],
  },
  dataToSend: 0,
};

const update = (obj, change) => Object.assign({}, obj, change)

export default (state = initialState, action) => {
  switch (action.type) {
    case 'updateUser':
      const updatedUser = update(state.user, action.change);
      return update(state, { user: updatedUser });
    case 'updateDataToSend':
      return update(state, { dataToSend: action.payload })
    case 'updateVessel':
      const updatedVessel = update(state.vessel, action.change);
      return update(state, { vessel: updatedVessel });
    case 'addPort':
      state.ports[action.region].push(action.port);
      return state;
    case 'changeSpecies':
      if(action.value && action.value.toString().length === 3){
        const faves = state.autoSuggestFavourites.speciesCode.filter(s => s !== action.value);
        faves.unshift(action.value);
        if(faves.length >= 10){
          faves.pop();
        }
        state.autoSuggestFavourites.speciesCode = faves;
        state.autoSuggestFavourites.targetSpecies = faves;
      }
      return state;
    default:
      return state;
  }
};
