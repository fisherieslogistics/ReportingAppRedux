import Validator from '../utils/Validator';
const valid = Validator.valid;

const model = [
  {label: 'Species', id: 'code', valid: valid.greaterThanZero, type: 'product', defaultValue: "",
    editorDisplay: {editor: 'event', type: 'combined', siblings: ['numberOfContainers', 'weight']}},
  {label: 'Number of Containers', id: 'numberOfContainers', type: 'number', valid: valid.greaterThanZero, defaultValue: "0"},
  {label: 'Weight', id: 'weight', valid: valid.greaterThanZero, type: 'number', defaultValue: "0"},
  {label: 'State', id: 'state', valid: valid.alwaysValid, defaultValue: "gre",
    editorDisplay: {editor: 'event', type: 'combined', siblings: ['containerType', 'grade', 'treatment']}},
  {label: 'Container Type', id: 'containerType', valid: valid.alwaysValid, defaultValue: "bin"},
  {label: 'Grade', id: 'grade', valid: valid.alwaysValid, defaultValue: "A"},
  {label: 'Treatment', id: 'treatment', valid: valid.alwaysValid, defaultValue: "iced"},
];

export default model;
