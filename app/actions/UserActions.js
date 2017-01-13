"use strict";

class UserActions{

  addPort(region, port){
    return {
      type: 'addPort',
      region,
      port
    }
  }

  setUser(user){
    return {
      type: 'setUser',
      user
    }
  }

  sendMessage(message) {
    return {
      type: 'sendMessage',
      message,
    }
  }

  messageSent() {
    return {
      type: 'messageSent',
    }
  }

  setCatchDetailsExpanded(expanded){
    return {
      type: 'setCatchDetailsExpanded',
      catchDetailsExpanded: expanded
    }
  }

  setVessels(vessels){
    return {
      type: 'setVessels',
      vessels
    }
  }

  setVessel(vessel){
    return {
      type: 'setVessel',
      vessel
    }
  }

  setFormType(formType){
    return {
      type: 'setFormType',
      formType,
    }
  }

}

export default UserActions;
