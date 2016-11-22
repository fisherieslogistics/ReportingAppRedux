import Migration from '../../utils/Migration';

function up(state) {
  let newState = Object.assign({}, state);
  delete newState.view;
  delete newState.forms;
  delete newState.uiEvents;
  delete newState.gear;
  delete newState.sync;
  delete newState.api;
  return newState;
}

export default function(state) {
  return new Migration('4-kill-useless-state', 1.14, up);
}
