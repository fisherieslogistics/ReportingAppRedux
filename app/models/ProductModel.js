import Validator from '../utils/Validator';
const valid = Validator.valid;

const model = [
  {
    label: 'Species', id: 'code', valid: valid.targetProduct, defaultValue: "", type:"speciesCodePicker",
    display: { type: 'combined', siblings: ['weight'] }
  },
  {
    label: 'Weight', id: 'weight', valid: valid.greaterThanZero, type: 'number', defaultValue: "0", unit: 'kg',
    display: { type: 'child' },
  },
];

export default model;
