import Migration from './Migration';

function up(state) {

  state.migrations = [];
  return state;

}

export default function(state) {
  return new Migration('0-add-place-to-store-mutations', 1.14, up);
}
