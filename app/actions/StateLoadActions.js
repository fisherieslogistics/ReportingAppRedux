"use strict";
import moment from 'moment';

class StateLoadActions {
  loadSavedState (savedState) {
    console.log("loaded it", savedState);
    return {
      type: 'loadSavedState',
      savedState: savedState
    }
  }
}

export default StateLoadActions;
