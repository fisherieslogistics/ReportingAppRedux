import Validator from '../utils/Validator';

const FishingEventModel = [
  {label: 'Number of in Trip',   id: 'id',                 valid: Validator.valid.anyValue,         type: 'number',    readOnly: true},
  {label: 'Target Species',      id: 'targetSpecies',      valid: Validator.valid.targetProduct,    type: 'product', defaultValue: ""},
  {label: 'Date/Time at Start',  id: 'datetimeAtStart',    valid: Validator.valid.anyValue,         type: 'datetime', defaultValue: null,
    combinedValid: {attributes: ["datetimeAtStart", "datetimeAtEnd"],
    func: Validator.combined.orderedLessThan}},
  {label: 'Date/Time at End',    id: 'datetimeAtEnd',      valid: Validator.valid.anyValue,         type: 'datetime', defaultValue: null,
    combinedValid: {attributes: ["datetimeAtEnd", "datetimeAtStart"],
                       func: Validator.combined.orderedGreaterThan}},
  {label: 'Location at Start',   id: 'locationAtStart',    valid: Validator.valid.anyValue,         type: 'location', defaultValue: {}},
  {label: 'Location at End',     id: 'locationAtEnd',      valid: Validator.valid.anyValue,         type: 'location', readOnly: true, defaultValue: {}},
  {label: 'Products Valid',      id: 'productsValid',      valid: Validator.valid.alwaysValid, defaultValue: false,   hidden: true },
  {label: 'products',            id: 'products',           valid: Validator.valid.alwaysValid, defaultValue: [],      hidden: true },
];

export default FishingEventModel;
