"use strict";

class AuthActions {

  setAuth(auth){
    return {
      type: 'setAuth',
      auth: auth
    }
  }

  logout(){
    return {
      type: 'logout'
    };
  }

  loginError(message){
    return {
      type: 'loginError',
      message: message
    }
  }
}

export default AuthActions;
