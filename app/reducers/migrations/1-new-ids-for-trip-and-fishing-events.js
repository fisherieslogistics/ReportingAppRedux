import Migration from '../../utils/Migration';
import { globalId } from '../../utils/ModelUtils';

function migrateIds(item, type){
  const changes = {
    objectId: globalId(type),
    __legacyId: oldTrip.objectId,
  }
  return Object.assign({}, item, changes);
}

function up(state) {
  let newState = Object.assign({}, state);

  if(newState.trip){
    newState = Object.assign({}, newState, { trip: migrateIds(newState.trip, 'Trip') });
  }

  if(newState.fishingEvents){
    const newEvents = newState.fishingEvents.events.map(
      fe => migrateIds(fe, 'FishingEvent'));

    newFishingEvents = Object.assign(
      {}, newState.fishingEvents, { events: newEvents });

    newState.fishingEvents = newFishingEvents;
  }

  return newState;
}

export default function(state) {
  return new Migration('1-new-ids-for-trip-and-fishing-events', 1.14, up);
}
