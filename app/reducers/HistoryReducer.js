"use strict";
import Helper from '../utils/Helper';
const helper = new Helper();
const initialState = {
  pastTrips: [],
}
//this is boken - fix graphql server to upserttrips
export default (state = initialState, action) => {
  switch (action.type) {
    case "endTrip":
      const _trip = Object.assign({}, action.trip);
      state.pastTrips.push(helper.getHistoryTrip(_trip));
      return state;
    default:
      return state;
  }
};
