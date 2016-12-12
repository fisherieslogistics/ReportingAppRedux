"use strict";
import moment from 'moment';

class ViewActions{

    initAutoSuggestBarChoices(choices, favourites, text, inputId){
      //use a name change to tell it to re initialise
      return {
        type: 'initAutoSuggestBarChoices',
        choices,
        favourites,
        text,
        inputId
      }
    }

    changeAutoSuggestBarText(text, name){
      return {
        type: 'changeAutoSuggestBarText',
        text,
        name
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
