import Validator from '../utils/Validator';

const FishingEventCustomModel = [
  {label: 'Number of in Trip',   id: 'id',                 valid: Validator.valid.anyValue,         type: 'number',    readOnly: true},
  {label: 'Lengthener',   id: 'Lengthener',    valid: Validator.valid.anyValue,         type: 'string', defaultValue: {}},
  {label: 'Cod End',   id: 'Cod End',    valid: Validator.valid.anyValue,         type: 'string', defaultValue: {}},
  {label: 'Chaffing Mat',   id: 'Chaffing Mat',    valid: Validator.valid.anyValue,         type: 'string', defaultValue: {}},
  {label: 'Ground Rope',   id: 'Ground Rope',    valid: Validator.valid.anyValue,         type: 'string', defaultValue: {}},
  {label: 'Tickler Chains',   id: 'Tickler Chains',    valid: Validator.valid.anyValue,         type: 'string', defaultValue: {}},
  {label: 'Door Spread',   id: 'Door Spread',    valid: Validator.valid.anyValue,         type: 'string', defaultValue: {}},
  {label: 'Sweeps',   id: 'Sweeps',    valid: Validator.valid.anyValue,         type: 'string', defaultValue: {}},
];

export default FishingEventCustomModel;
