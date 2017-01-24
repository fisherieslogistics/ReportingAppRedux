"use strict";

class UserActions{

  updateUser(inputId, value) {
    const change = {};
    change[inputId] = value
    return {
      type: 'updateUser',
      change,
      inputId,
      value,
    }
  }

  updateVessel(inputId, value) {
    const change = {};
    change[inputId] = value
    return {
      type: 'updateVessel',
      change,
    }
  }

  addPort(region, port){
    return {
      type: 'addPort',
      region,
      port
    }
  }

}

export default UserActions;
