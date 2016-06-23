"use strict";

class UserActions{

    editUser(change){
      return {
        'type': 'editUser',
        'change': change
      }
    }

    logout(){
      return {
        type: 'logout'
      }
    }
}
export default UserActions;
