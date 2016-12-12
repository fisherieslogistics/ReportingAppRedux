import Validator from '../utils/Validator';
import Helper from '../utils/Helper';
const valid = Validator.valid;
let model = [];

model = [
  {label: 'Number of Hooks', id: 'numberOfHooks', valid: valid.greaterThanZero, type: 'number',
    display: { type: 'single'}
  },
  {label: 'Hook Spacing', id: 'hookSpacing', valid: valid.greaterThanZero, type: 'float', repeating: true,
    display: { type: 'single'}, unit: 'm'
  },
  {label: 'Bottom Depth', id: 'bottomDepth', valid: valid.greaterThanZero, type: 'number',
    display: { type: 'single'}, unit: 'm'
  },
  {label: 'Non Fish Protected Species',  type: 'bool', id: 'nonFishProtected', valid: valid.alwaysValid, type: 'bool',
    display: { type: 'single', hideUndefined: true }
  },
];

export default model;
