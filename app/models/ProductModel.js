import Validator from '../utils/Validator';
const valid = Validator.valid;

const model = [
  {label: 'Species', id: 'code', valid: valid.greaterThanZero, type: 'product', defaultValue: null,
    editorDisplay: {editor: 'event', type: 'combined', siblings: ['numberOfContainers', 'weight']}},
  {label: 'Number of Containers', id: 'numberOfContainers', type: 'number', valid: valid.greaterThanZero, defaultValue: null},
  {label: 'Weight', id: 'weight', valid: valid.greaterThanZero, type: 'number', defaultValue: null},
  {label: 'State', id: 'state', valid: valid.alwaysValid, defaultValue: null,
    editorDisplay: {editor: 'products', type: 'combined', siblings: ['containerType', 'grade', 'treatment']}},
  {label: 'Container Type', id: 'containerType', valid: valid.alwaysValid, defaultValue: null},
  {label: 'Grade', id: 'grade', valid: valid.alwaysValid, defaultValue: null},
  {label: 'Treatment', id: 'treatment', valid: valid.alwaysValid, defaultValue: null},
];

export default model;
