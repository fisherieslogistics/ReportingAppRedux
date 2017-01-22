const initialState = {
  latest: "",
  latest400: [],
};

const update = (obj, change) => Object.assign({}, obj, change)

export default (state = initialState, action) => {
  switch (action.type) {
    case "NMEAStringRecieved":
      const latest400 = [...state.latest400];
      latest400.shift(action.payload.NMEAString);
      if(latest400.length < 400){
        latest400.pop();
      }
      const newState = update(state, { latest400, latest: action.payload.NMEAString });
      console.log(newState);
      return newState;
    default:
      return state;
  }
};
