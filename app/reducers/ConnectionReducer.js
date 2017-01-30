
const initialState = {
  status: 'not connected',
  dataToSend: 0,
};

const update = (obj, change) => Object.assign({}, obj, change)

export default (state = initialState, action) => {
  switch (action.type) {
    case 'updateDataToSend':
      return update(state, { dataToSend: action.payload })
    case 'updateConnectionStatus':
      return update(state, { status: action.payload });
    default:
      return state;
  }
};
