"use strict";

class StateLoadActions {
  loadSavedState (savedState) {
    return {
      type: 'loadSavedState',
      savedState,
    }
  }
  setTcpDispatch (dispatch) {
    return {
      type: 'setTcpDispatch',
      payload: {
        dispatch,
      },
    }
  }
}

export default StateLoadActions;
