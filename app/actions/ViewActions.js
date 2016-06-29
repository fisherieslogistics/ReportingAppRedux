"use strict";
import moment from 'moment';

class ViewActions{
    initAutoSuggestBarChoices(choices, favourites, text, name, inputId){
      //use a name change to tell it to re initialise
      return {
        type: 'initAutoSuggestBarChoices',
        choices: choices,
        favourites: favourites,
        text: text,
        name: name,
        inputId: inputId
      }
    }

    changeAutoSuggestBarText(text, name){
      return {
        type: 'changeAutoSuggestBarText',
        text: text,
        name: name
      }
    }

    toggleAutoSuggestBar(visible){
      return {
        type: 'toggleAutoSuggestBar',
        visible: visible
      }
    }
}

export default ViewActions;
