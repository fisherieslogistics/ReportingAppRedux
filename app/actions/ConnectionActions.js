"use strict";

class ConnectionActions {

  updateDataToSend(dataToSend){
    return {
      type: 'updateDataToSend',
      payload: dataToSend,
    }
  }

  updateConnectionStatus(status) {
    return {
      type: 'updateConnectionStatus',
      payload: status,
    }
  }

}

export default ConnectionActions;
