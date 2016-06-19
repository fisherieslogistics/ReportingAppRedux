"use strict";
import moment from 'moment';

class StateLoadActions {
  loadSavedState (savedState) {
    return {
      type: 'loadSavedState',
      savedState: savedState
    }
  }
}

export default StateLoadActions;
