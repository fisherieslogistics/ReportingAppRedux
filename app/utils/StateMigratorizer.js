import zero from '../reducers/migrations/0-add-place-to-store-mutations';

import one from '../reducers/migrations/1-new-ids-for-trip-and-fishing-events';
import two from '../reducers/migrations/2-update-trip-attribute-names';
import three from '../reducers/migrations/3-add-new-fields-to-fishing-event';
import four from '../reducers/migrations/4-kill-useless-state';

const migrations = [
  one,
  two,
  three,
  four,
];

function stateShouldMigrate(migration, pastMigrations){
  return pastMigrations.find(m =>
    m.name === migration.name) === undefined;
}

function migrateUp(migration, state){
  if(stateShouldMigrate(migration.details, state.migrations)){
    migration.setOriginalState(state);
    migration.up();
    return migration.newState;
  }
  return state;
}

export default function(state) {
  let newState = Object.assign({}, state || {});
  if(! newState.migrations ){
    migrationZero = zero();
    migrationZero.setOriginalState(newState);
    migrationZero.up();
    newState = Object.assign({}, migrationZero.newState);
  }
  migrations.forEach(m => {
    m = m(newState);
    if(stateShouldMigrate(m, newState.migrations)){
      newState = migrateUp(m, newState);
    }
  });

  return newState;
}
