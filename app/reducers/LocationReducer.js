const initialState = {
  latest: "",
  latest400: [],
};

const update = (obj, change) => Object.assign({}, obj, change)

export default (state = initialState, action) => {
  switch (action.type) {
    case "NMEAStringRecieved":
      const latest400 = [...state.latest400];
      if(latest400.length < 400){
        latest400.pop();
      }
      latest400.shift(action.payload.NMEAString);
      const newState = update(state, { latest400, latest: action.payload.position  });
      return newState;
    default:
      return state;
  }
};
