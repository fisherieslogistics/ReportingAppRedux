"use strict";

const initialState = {
  viewingForm: null,
  viewingFormIndex: null,
}

const update = (obj, change) => Object.assign({}, obj, change)

const FormReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'endTrip':
      return initialState;
    case 'setViewingForm':
      return update(state, {viewingForm: action.form, viewingFormIndex: action.index});
    }
    return state;
};

export default FormReducer;
