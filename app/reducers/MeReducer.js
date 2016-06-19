let initialState = {
    ports: [],
    vessel: null,
    user: {
      fishingEventType: "tcer",
      customInputs: {
        product: [
          {label: "Bins Of", type: "number"},
          {label: "State", type: "string"},
          {label: "Size (110)", type: "number"},
          {label: "Notes", type: "string"},
          {label: "Discard KGs", type: "number"}
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
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'setMe':
            if(!action.user){
              return state;
            }
            return Object.assign({}, state, { user: action.user });
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
