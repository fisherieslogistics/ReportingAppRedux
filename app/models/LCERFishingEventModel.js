import Validator from '../utils/Validator';
import Helper from '../utils/Helper';
const valid = Validator.valid;
let model = [];

model = [
  {label: 'Bottom Depth', id: 'bottomDepth', valid: valid.greaterThanZero, type: 'number',
    editorDisplay: {editor: 'event', type: 'single'}, unit: 'm'
  },
  {label: 'Number of Hooks', id: 'numberOfHooks', valid: valid.greaterThanZero, type: 'number',
    editorDisplay: {editor: 'event', type: 'single'}
  },
  {label: 'Hook Spacing', id: 'hookSpacing', valid: valid.greaterThanZero, type: 'float',
    editorDisplay: {editor: 'gear', type: 'single'}, unit: 'm'
  }
];

export default model;
