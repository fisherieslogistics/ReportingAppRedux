import Migration from './Migration';

function up(state) {
  if(!state.trip){
    return state;
  }
  const newTrip = Object.assign({}, state.trip); 
  return state;
}

export default function(state) {
  return new Migration('1-update-trip-attibute-names', 1.14, up);
}
