import Migration from '../../utils/Migration';

function up(state) {
  if(!state.trip){
    return state;
  }
  const oldTrip = Object.assign({}, state.trip);
  let newState = Object.assign({}, state);
  const changes = {
    startPort: oldTrip.leavingPort,
    endPort: oldTrip.estimatedReturnPort,
    startDate: oldTrip.sailingTime,
    endDate: oldTrip.ETA,
    complete: oldTrip.completed,
  }
  let newTrip = Object.assign({}, oldTrip, changes);
  delete newTrip.leavingPort;
  delete newTrip.estimatedReturnPort;
  delete newTrip.sailingTime;
  delete newTrip.ETA;
  delete newTrip.lastSubmitted;
  delete newTrip.completed;
  return Object.assign({}, newState, { trip, newTrip });
}

export default function(state) {
  return new Migration('2-update-trip-attibute-names', 1.14, up);
}
