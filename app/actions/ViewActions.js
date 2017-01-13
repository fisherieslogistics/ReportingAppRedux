"use strict";
import moment from 'moment';

class ViewActions{

    initAutoSuggestBarChoices(choices, text, inputId){
      //use a name change to tell it to re initialise
      return {
        type: 'initAutoSuggestBarChoices',
        choices,
        text,
        inputId
      }
    }

    changeAutoSuggestBarText(text, name){
      return {
        type: 'changeAutoSuggestBarText',
        text,
      }
    }

    orientation(orientation){
      return {
        type: 'orientation',
        orientation
      }
    }

    toggleAutoSuggestBar(visible){
      return {
        type: 'toggleAutoSuggestBar',
        visible
      }
    }
}

export default ViewActions;
