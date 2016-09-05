import Validator from '../utils/Validator';
const valid = Validator.valid;

const model = [
  {label: 'Code', id: 'code', valid: valid.alwaysValid, defaultValue: "", optional: true, editorDisplay: {editor: 'event', type: 'single'} },
  {label: 'Name', id: 'name', valid: valid.alwaysValid, defaultValue: "", optional: true, editorDisplay: {editor: 'event', type: 'single'}},
  {label: 'Amount', id: 'amount', valid: valid.alwaysValid, defaultValue: "", optional: true, editorDisplay: {editor: 'event', type: 'single'}},
  {label: 'Notes', id: 'notes', valid: valid.alwaysValid, defaultValue: "", optional: true, editorDisplay: {editor: 'event', type: 'single'}},
];

export default model;
