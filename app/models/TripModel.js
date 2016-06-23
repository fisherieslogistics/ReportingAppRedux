import Validator from '../utils/Validator';

const tripModel = [
    {id: 'portFrom', valid: Validator.valid.anyValue, type: 'string'},
    {id: 'portTo', valid: Validator.valid.anyValue, type: 'string'},

    {id: 'sailingTime', valid: Validator.valid.anyValue, type: 'datetime',
      combinedValid: {attributes: ["sailingTime", "ETA"],
      func: Validator.combined.orderedLessThan}},

    {id: 'ETA', valid: Validator.valid.anyValue, type: 'datetime',
      combinedValid: {attributes: ["ETA", "sailingTime"],
      func: Validator.combined.orderedGreaterThan}},

    {id: 'lastChange', defaultValue: false, valid: Validator.valid.alwaysValid, type: 'datetime'},
    {id: 'lastSubmitted', defaultValue: false, valid: Validator.valid.alwaysValid, type: 'datetime'},
    {id: 'started', defaultValue: false, valid: Validator.valid.alwaysValid, type: 'bool', hidden: true},
];

export default tripModel
