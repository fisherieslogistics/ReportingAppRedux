import Validator from '../utils/Validator';
const valid = Validator.valid;

const UserModel = [
  {id: 'firstName', defaultValue: "", label: "First Name", editorDisplay: {editor: 'profile', type: 'single'}, valid: valid.alwaysValid,},
  {id: 'lastName', defaultValue: "", label: "Last Name", editorDisplay: {editor: 'profile', type: 'single'}, valid: valid.alwaysValid,},
  {id: 'permitHolderName', defaultValue: "", label: "Permit Holder Name", editorDisplay: {editor: 'profile', type: 'single'}, valid: valid.alwaysValid,},
  {id: 'permitHolderNumber', defaultValue: "", label: "Permit Holder Number", editorDisplay: {editor: 'profile', type: 'single'}, valid: valid.alwaysValid,},
  {id: 'email', defaultValue: "", label: "Email", editorDisplay: {editor: 'profile', type: 'single'}, valid: valid.alwaysValid,},
];
export default UserModel;
