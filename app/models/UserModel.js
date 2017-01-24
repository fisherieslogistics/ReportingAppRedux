import Validator from '../utils/Validator';
const valid = Validator.valid;

const UserModel = [
  {
    id: 'firstName', defaultValue: "", label: "First Name", valid: valid.anyValue,
    display:  { type: 'single'},
  },
  {
    id: 'lastName', defaultValue: "", label: "Last Name", valid: valid.anyValue,
    display: { type: 'single'},
  },
  {
    id: 'permitHolderName', defaultValue: "", label: "Permit Holder Name", valid: valid.anyValue,
    display: { type: 'single'},
  },
  {
    id: 'permitHolderNumber', defaultValue: "", label: "Permit Holder Number", valid: valid.anyValue,
    display: { type: 'single'},
  },
  {
    id: 'email', defaultValue: "", label: "Email", valid: valid.anyValue,
    display: { type: 'single'},
  },
  {
    label: 'Host IP for Navicom use 192.168.1.1', defaultValue: "192.168.1.1", id: "hostIp", valid: valid.anyValue,
    display: { type: 'single'},
  },
  {
    label: 'Host Port or Navicom use 5003', defaultValue: "5003", type: 'number', id: "hostPort", valid: valid.anyValue,
    display: { type: 'single'},
  },
  {
    id: 'contacts', defaultValue: [], valid: valid.anyValue,
  },
];

export default UserModel;
