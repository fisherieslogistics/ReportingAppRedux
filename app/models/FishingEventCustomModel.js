import Validator from '../utils/Validator';

const FishingEventCustomModel = [
  {label: 'Number of in Trip',   id: 'id',                 valid: Validator.valid.alwaysValid,         type: 'number',    readOnly: true},
  {label: 'Lengthener',   id: 'Lengthener',    valid: Validator.valid.alwaysValid,         type: 'string', defaultValue: {}},
  {label: 'Cod End',   id: 'Cod End',    valid: Validator.valid.alwaysValid,         type: 'string', defaultValue: {}},
  {label: 'Chaffing Mat',   id: 'Chaffing Mat',    valid: Validator.valid.alwaysValid,         type: 'string', defaultValue: {}},
  {label: 'Ground Rope',   id: 'Ground Rope',    valid: Validator.valid.alwaysValid,         type: 'string', defaultValue: {}},
  {label: 'Tickler Chains',   id: 'Tickler Chains',    valid: Validator.valid.alwaysValid,         type: 'string', defaultValue: {}},
  {label: 'Door Spread',   id: 'Door Spread',    valid: Validator.valid.alwaysValid,         type: 'string', defaultValue: {}},
  {label: 'Sweeps',   id: 'Sweeps',    valid: Validator.valid.alwaysValid,         type: 'string', defaultValue: {}},
];

export default FishingEventCustomModel;
