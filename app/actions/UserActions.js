"use strict";

class UserActions{

    editUser(key, value){
      return {
        'type': 'editUser',
        'key': key,
        'value': value
      }
    }

    logout(){
      return {
        type: 'logout'
      }
    }
}
export default UserActions;
