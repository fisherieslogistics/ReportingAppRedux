
import Client from '../api/Client';
import queries from '../api/Queries';
import AuthActions from './AuthActions';
import UserActions from './UserActions';
import Helper from '../utils/Helper';

const userActions = new UserActions();
const authActions = new AuthActions();
const helper = new Helper();
let client;

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

const parseUser = (viewer) => {
  const customers = flatten(viewer.organisation.customerGroups.edges.map(e => flatten(e.node.customers.edges.map(cu => cu.node))));
  const contacts = customers.map(c => Object.assign({}, c, { messages: c.messageThread.messages.edges.map(m => m.node) }));
  return {
    firstName: viewer.firstName,
    lastName: viewer.lastName,
    permitHolderName: viewer.formData.permit_holder_name,
    permitHolderNumber: viewer.formData.permit_holder_number,
    email: viewer.email,
    bins: viewer.bins,
    organisationId: viewer.organisation.id,
    contacts,
  };
}

class ApiActions {

  setUpClient(dispatch, ApiEndpoint, AuthEndpoint){
    client = new Client(dispatch, ApiEndpoint, AuthEndpoint);
  }

  checkMe(auth, dispatch){
    if(!auth.loggedIn){
      return;
    }
    client.query(queries.getMe, auth).then((res) => {
      if(res && res.data){
        const user = parseUser(res.data.viewer);
        dispatch(userActions.setUser(user));
      } else {
        throw new Error(res);
      }
    }).catch((e) => {
      console.log(e);
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
