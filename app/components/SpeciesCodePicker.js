import {connect} from 'react-redux';
/* eslint-disable */
import Subscribable from 'Subscribable';
/* eslint-enable */
import { AutoSuggestPicker } from './common/AutoSuggestPicker';
import ViewActions from '../actions/ViewActions';

const viewActions = new ViewActions();

class SpeciesCodePicker extends AutoSuggestPicker {

  initChoices(){
    let choices = [];
    if(!this.props.text){
      let usedCodes = this.props.fishingEvent.products.map(
        p => p.code);

      this.props.favourites.forEach((f) => {
        if(!usedCodes.includes(f)){
          choices.push(this.props.choices.find(c => c.value === f));
        }
      });

      usedCodes = usedCodes.concat(this.props.favourites);
      choices = choices.concat(
        this.props.choices.filter(
          r => !usedCodes.includes(r.value)));

    } else {
      choices = this.props.choices;
    }

    this.props.dispatch(
      viewActions.initAutoSuggestBarChoices(
        choices,
        this.props.value,
        this.props.inputId,
    ));
  }

}

const select = (State) => {
  const state = State.default;
  const fEvents = state.fishingEvents.events;
  return {
    eventEmitter: state.uiEvents.eventEmitter,
    fishingEvent: fEvents[state.view.viewingEventId -1],
    favourites: state.me.autoSuggestFavourites.speciesCode,
  };
}

export default connect(select)(SpeciesCodePicker);
