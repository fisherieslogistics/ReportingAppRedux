"use strict";
import moment from 'moment';

class ViewActions{
    closeAlert() {
        return {
            type: 'alertClosed',
            timestamp: moment()
        };
    }
    showForms(){
      return {
        type:'showForms'
      }
    }
    hideForms(){
      return {
        type:'hideForms'
      }
    }
    showHome(){
      return {
        type: 'showHome'
      }
    }
    hideHome(){
      return {
        type: 'hideHome'
      }
    }
}

export default ViewActions;
