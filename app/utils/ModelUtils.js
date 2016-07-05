import moment from 'moment';

const S4 = () => {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

const guid = () => { return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase()};

export default {
  blankModel: (model) => {
    const blankModel = {};
    model.forEach(value => {
        blankModel[value.id] = value.defaultValue;
    });
    blankModel.guid = guid();
    console.log(blankModel.guid);
    return blankModel;
  }
};
