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

}

export default UserActions;
