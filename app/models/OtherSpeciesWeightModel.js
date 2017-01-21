import Validator from '../utils/Validator';
const valid = Validator.valid;

const model = [
  {
    label: 'OtherSpeciesWeight', id: 'otherSpeciesWeight', valid: valid.anyValue, type: 'number', defaultValue: "0", unit: 'kg',
    display: { type: 'single' },
  },
];

export default model;
