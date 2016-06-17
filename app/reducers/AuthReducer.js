import AsyncStorage from 'AsyncStorage';

export default (state = {loggedIn: false, login_message: "Hope you like it better than paper."}, action) => {
    switch (action.type) {
    case 'login':
        return Object.assign({}, state, { loggedIn: true,
                                          token: action.token,
                                          refreshToken: action.refreshToken,
                                          login_message: "Nice To See You!"});
        return newState;
    case 'login_error':
        return Object.assign({}, state, { loggedIn: false,
                                          token: null,
                                          refreshToken: null,
                                          login_message: action.message,
                                          ui_lokkaClient: null });
        return newState;
    case 'logout':
      return Object.assign({}, state, { loggedIn: false,
                                        token: null,
                                        refreshToken: null,
                                        login_message: "Hope you like it better than paper.",
                                        ui_lokkaClient: null });
    case 'setLokka':
        return Object.assign({}, state, { ui_lokkaClient: action.ui_lokkaClient });

    default:
        return state;
    }
};
