"use strict";

const initialState = {
  viewingForm: null,
  viewingFormIndex: null,
}

const FormReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'endTrip':
      return initialState;
    case 'setViewingForm':
      return update(state, {viewingForm: action.form, viewingFormIndex: action.index});
    }
    return state;
};

const update = (obj, change) => {
  return Object.assign({}, obj, change);
}

export default FormReducer;
