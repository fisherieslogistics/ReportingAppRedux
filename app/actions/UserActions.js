"use strict";

class UserActions{

  addPort(region, port){
    return {
      type: 'addPort',
      region: region,
      port: port
    }
  }

  editUser(change){
    return {
      type: 'editUser',
      change: change
    }
  }

  setUser(user){
    return {
      type: 'setUser',
      user: user
    }
  }

  setCatchDetailsExpanded(expanded){
    return {
      type: "setCatchDetailsExpanded",
      catchDetailsExpanded: expanded
    }
  }

  setVessels(vessels){
    return {
      type: 'setVessels',
      vessels: vessels
    }
  }

  setVessel(vessel){
    return {
      type: 'setVessel',
      vessel: vessel
    }
  }

  setFormType(formType){
    return {
      type: 'setFormType',
      formType: formType,
    }
  }

}

export default UserActions;
