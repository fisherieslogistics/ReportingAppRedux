import moment from 'moment';
import base64 from 'base-64';
function mongoObjectId() {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    var _id = timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
    return _id;
};

function toGlobalId(type, id) {
 return base64.encode([type, id].join(':'));
}

export function globalId(type){
  return toGlobalId(type, mongoObjectId())
}

export default {
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
  }
};
