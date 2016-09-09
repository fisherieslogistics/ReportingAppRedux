import Migration from '../../utils/Migration';
import { globalId } from '../../utils/ModelUtils';

function migrate(item, type){
  const changes = {
    protecteds: [],
    discards: [],
    incidents: [],
  };
  return Object.assign({}, item, changes);
}

function up(state) {
  let newState = Object.assign({}, state);

  if(newState.fishingEvents){
    const newEvents = newState.fishingEvents.events.map(
      fe => migrate(fe));

    newFishingEvents = Object.assign(
      {}, newState.fishingEvents, { events: newEvents });

    newState.fishingEvents = newFishingEvents;
  }

  return newState;
}

export default function(state) {
  return new Migration('3-add-fields-to-fishing-events', 1.14, up);
}
