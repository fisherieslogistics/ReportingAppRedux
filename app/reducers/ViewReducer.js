import moment from 'moment';
import Helper from '../utils/Helper';

const helper = new Helper();
const assign = helper.assign;

let initialState = {
  viewingFishingEventId: null,
  detailView: "catch"
}

export default (state = initialState, action) => {
    switch (action.type) {
    case 'setViewingFishingEvent':
      return assign(state, {viewingFishingEventId: action.fishingEventId});
    default:
        return state;
    }
};
