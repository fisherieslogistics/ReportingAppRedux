"use strict";
import moment from 'moment';
import ModelUtils from '../utils/ModelUtils';
import TrawlGearModel from '../models/TrawlGearModel';
import Helper from '../utils/Helper';
//TODO jjeeesssus look at the line below
const initialState = ModelUtils.blankModelWithoutObjectId(TrawlGearModel);

export default (state = initialState, action) => {
  switch(action.type) {
    case 'changeCurrentGear':
      let change = {};
      change[action.key] = action.value;
      return Object.assign({}, state, change);
    return state;
  }
  return state;
};
