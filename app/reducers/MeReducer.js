import ModelUtils from '../utils/ModelUtils';
import UserModel from '../models/UserModel';
import VesselModel from '../models/VesselModel';
import ports from '../constants/ports';
const initialUser = ModelUtils.blankModel(UserModel);
const initialVessel = ModelUtils.blankModel(VesselModel);

const initialState = {
  ports,
  vessel: initialVessel,
  containers: [
    { value: 'Tubs # 16', description: "t", weight: 26 },
    { value: "Iki Bins #10 Packed", description: "i", weight: 14 },
    { value: "Iki Bins flat packed", description: "u", weight: 20 },
    { value: "Individual fish", description: "f", weight: 2 },
    { value: "Fish in Slurry", description: "s", weight: 26 },
    { value: "Bulk Kgs", description: "k", weight: 1 },
    { value: "Dolav", description: "d", weight: 350 },
    { value: "Iki Bins export", description: "x", weight: 14 },
    { value: "Bins", description: "b", weight: 35 },
  ],
  vessels: [],
  user: initialUser,
  formType: 'tcer',
  autoSuggestFavourites: {
    speciesCode: [],
  },
};

const update = (obj, change) => Object.assign({}, obj, change)

export default (state = initialState, action) => {
  switch (action.type) {
    case "setCatchDetailsExpanded":
      state.catchDetailsExpanded = action.catchDetailsExpanded;
      return state;
    case 'setMe':
      if(!action.user){
        return state;
      }
      return update(state, {user: action.user});
    case 'devMode':
      return initialState;
    case 'setUser':
      return update(state,  { user: action.user, containers: action.user.bins || initialState.containers });
    case 'setVessel':
      return update(state, { vessel: action.vessel });
    case 'setFormType':
      return update(state, { formType: action.formType });
    case 'setVessels':
      return update(state, { vessels: action.vessels, vessel: action.vessels[0] });
    case 'addPort':
      state.ports[action.region].push(action.port);
      return state;
    case 'changeSpecies':
      if(action.value.length !== 3 || action.value === 'OTH'){
        return state;
      }
      if(!state.autoSuggestFavourites.speciesCode){
        state.autoSuggestFavourites.speciesCode = [];
      }
      const faves = state.autoSuggestFavourites.speciesCode.filter(s => s !== action.value);
      faves.unshift(action.value);
      if(faves.length >= 10){
        faves.pop();
      }
      state.autoSuggestFavourites.speciesCode = faves;
      state.autoSuggestFavourites.targetSpecies = faves;
      return state;
    default:
      return state;
  }
};
