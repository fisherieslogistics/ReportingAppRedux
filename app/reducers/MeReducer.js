import ModelUtils from '../utils/ModelUtils';
import UserModel from '../models/UserModel';

let initialState = {
  initialUse: true,
  ports: ['Port of Napier', 'Eastland Port Gisbourne', 'Viaduct Harbour Auckland', 'Port Motueka', 'Port Nelson Wharf',
          'Careys bay Wharf', 'Port Chalmers', 'South Port Bluff', 'Westport Harbour Wharf',
          'Port Lyttleton', 'Prime Port Timaru'],
  vessel: {name: "Nancy Glen 2", number: 76533},
  user: ModelUtils.blankModel(UserModel),
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
  }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'setMe':
            if(!action.user){
              return state;
            }
            return { ...state, user: action.user };
        case 'editUser':
            const user = Object.assign({}, state.user, action.change);
            return Object.assign({}, state,  { user: action.user });
        case 'setVessel':
            return Object.assign({}, state, { vessel: action.vessel });
        case 'setPorts':
            return Object.assign({}, state, { ports: action.ports });
        case 'setCedricData':
            return Object.assign({}, state, { cedricData: action.data});
        case 'logout':
            return Object.assign({}, state, defaultState);
        default:
            return state;
    }
};
