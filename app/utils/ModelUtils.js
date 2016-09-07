import moment from 'moment';

function mongoObjectId() {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    var _id = timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
    return _id;
};

function toGlobalId(type, id) {
 return base64([type, id].join(':'));
}

export default {
  blankModel: (model, type) => {
    const blankModel = {};
    model.forEach(value => {
      blankModel[value.id] = value.defaultValue;
    });
    blankModel.objectId = type ? toGlobalId(type, mongoObjectId()) : mongoObjectId();
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
