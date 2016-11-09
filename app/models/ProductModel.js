import Validator from '../utils/Validator';
const valid = Validator.valid;

const model = [
  {label: 'Species', id: 'code', valid: valid.targetProduct, defaultValue: "", type:"product",
    editorDisplay: {editor: 'event', type: 'combined', siblings: ['weight']}},
  {label: 'Containers', id: 'numberOfContainers', type: 'number', valid: valid.alwaysValid, defaultValue: "0", optional: true},
  {label: 'Weight', id: 'weight', valid: valid.alwaysValid, type: 'number', defaultValue: "0", unit: 'kg'},
  {label: 'State', id: 'state', valid: valid.alwaysValid, defaultValue: "gre",
    editorDisplay: {editor: 'event', type: 'combined', siblings: ['containerType', 'grade', 'treatment']}, optional: true },
  {label: 'Container Type', id: 'containerType', valid: valid.alwaysValid, defaultValue: "", type: 'container', optional: true},
  {label: 'Grade', id: 'grade', valid: valid.alwaysValid, defaultValue: "", optional: true},
  {label: 'Treatment', id: 'treatment', valid: valid.alwaysValid, defaultValue: "iced", optional: true},
];

export default model;
