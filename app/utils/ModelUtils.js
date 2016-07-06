import moment from 'moment';

function mongoObjectId() {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

export default {
  blankModel: (model) => {
    const blankModel = {};
    model.forEach(value => {
      blankModel[value.id] = value.defaultValue;
    });
    blankModel.objectId = mongoObjectId();
    return blankModel;
  }
};
