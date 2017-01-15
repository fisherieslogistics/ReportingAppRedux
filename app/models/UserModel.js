import Validator from '../utils/Validator';
const valid = Validator.valid;

const UserModel = [
  {
    id: 'firstName', defaultValue: "", label: "First Name", valid: valid.alwaysValid,
    display:  { type: 'single'},
  },
  {
    id: 'lastName', defaultValue: "", label: "Last Name", valid: valid.alwaysValid,
    display: { type: 'single'},
  },
  {
    id: 'permitHolderName', defaultValue: "", label: "Permit Holder Name", valid: valid.alwaysValid,
    display: { type: 'single'},
  },
  {
    id: 'permitHolderNumber', defaultValue: "", label: "Permit Holder Number", valid: valid.alwaysValid,
    display: { type: 'single'},
  },
  {
    id: 'email', defaultValue: "", label: "Email", valid: valid.alwaysValid,
    display: { type: 'single'},
  },
  {
    id: 'contacts', defaultValue: [], valid: valid.alwaysValid,
  },
];

export default UserModel;
