
import Client from '../api/Client';
import queries from '../api/Queries';
import AuthActions from './AuthActions';
import UserActions from './UserActions';
import Helper from '../utils/Helper';

const userActions = new UserActions();
const authActions = new AuthActions();
const helper = new Helper();
let client;

const parseUser = (viewer) => {
  const dummy = {
    firstName: 'First name',
    lastName: 'Last Name',
    permitHolderName: 'Permit Holder Name',
    permitHolderNumber: 'Permit Holder Number',
    email: 'test@test.com',
    bins: [],
  };
  return viewer ? {
    firstName: viewer.firstName,
    lastName: viewer.lastName,
    permitHolderName: viewer.formData.permit_holder_name,
    permitHolderNumber: viewer.formData.permit_holder_number,
    email: viewer.email,
    bins: viewer.bins,
  } : dummy;
}

class ApiActions {

  setUpClient(dispatch, ApiEndpoint, AuthEndpoint){
    client = new Client(dispatch, ApiEndpoint, AuthEndpoint);
  }

  checkMe(auth, dispatch){
    client.query(queries.getMe, auth).then((res) => {
      if(res && res.data){
        dispatch(userActions.setUser(parseUser(res.data.viewer)));
      }
    });
  }

  login(username, password){
    return (dispatch) => {
      client.login(username, password).then((auth) => {
        if(!auth){
          return dispatch(authActions.loginError("please try that again "));
        }
        dispatch(authActions.setAuth(auth));
        client.query(queries.getMe, helper.updateAuth({}, auth))
          .then((res) => {
            if(res && res.data){
              const viewer = res.data.viewer;
              dispatch(userActions.setVessels(viewer.vessels));
              if(viewer.vessels.length){
                dispatch(userActions.setVessel(viewer.vessels[0]));
              }
              dispatch(userActions.setUser(parseUser(viewer)));
            }
          });
      });
    }
  }

  mutate(mutation, variables, auth){
    return client.mutate(mutation, variables, auth);
  }

}

export default ApiActions;
