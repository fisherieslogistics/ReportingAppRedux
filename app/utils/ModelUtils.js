import moment from 'moment';
import base64 from 'base-64';
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';

function mongoObjectId() {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    const id = timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16)).toLowerCase();
    return id;
}

function toGlobalId(type, id) {
 return base64.encode([type, id].join(':'));
}

function globalId(type){
  return toGlobalId(type, mongoObjectId())
}

function attributeShouldRender(attr) {
  return !!attr.display;
}

export { globalId };

export default {
  getFishingEventModel(){
    return FishingEventModel.concat(TCERFishingEventModel);
  },
  blankModel: (model, type) => {
    const blankModel = {};
    model.forEach(value => {
      blankModel[value.id] = value.defaultValue;
    });
    blankModel.objectId = type ? globalId(type) : mongoObjectId();
    return blankModel;
  },
  blankModelWithoutObjectId: (model) => {
    const blankModel = {};
    model.forEach(value => {
      blankModel[value.id] = value.defaultValue;
    });
    return blankModel;
  },
  getRenderableAttributes: (model) => model.filter(attributeShouldRender),

};
