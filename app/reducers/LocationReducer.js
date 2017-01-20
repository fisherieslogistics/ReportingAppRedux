const initialState = {
  positions: {
    latest: {},
    last400: [],
  },
};

const update = (obj, change) => Object.assign({}, obj, change)

export default (state = initialState, action) => {
  switch (action.type) {
    case "NMEAStringRecieved":
      const latest400 = state.positions.latest;
      if(latest400.length > 400){
        latest400.pop();
        latest400.shift(action.payload.NMEAString);
      }
      return update(state, { latest400, latest: action.payload.NMEAString, });
    default:
      return state;
  }
};
