import Validator from '../utils/Validator';
const valid = Validator.valid;

const model = [
  {
    label: 'Species', id: 'code', valid: valid.targetProduct, defaultValue: "", type:"picker",
    display: { type: 'combined', siblings: ['weight'] }
  },
  {
    label: 'Weight', id: 'weight', valid: valid.alwaysValid, type: 'number', defaultValue: "0", unit: 'kg',
    display: { type: 'child' },
  },
];

export default model;
