import Validator from '../utils/Validator';

const model = [
  {label: 'Number of in Trip',   id: 'id',                 valid: Validator.valid.anyValue,         type: 'number',    readOnly: true},
  {label: 'Target Species',      id: 'targetSpecies',      valid: Validator.valid.product,              type: 'product'},
  {label: 'Date/Time at Start',  id: 'datetimeAtStart',    valid: Validator.valid.anyValue,         type: 'datetime'},
  {label: 'Date/Time at End',    id: 'datetimeAtEnd',      valid: Validator.valid.anyValue,         type: 'datetime'},
  {label: 'Location at Start',   id: 'locationAtStart',    valid: Validator.valid.anyValue,         type: 'location'},
  {label: 'Location at End',     id: 'locationAtEnd',      valid: Validator.valid.anyValue,         type: 'location',  readOnly: true},
  {label: 'Products Valid',      id: 'productsValid',      valid: Validator.valid.alwaysValid, defaultValue: false,   hidden: true },
  {label: 'products',            id: 'products',           valid: Validator.valid.alwaysValid, defaultValue: [],      hidden: true },
];

export default model;
