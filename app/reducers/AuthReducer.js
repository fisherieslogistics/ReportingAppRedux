import AsyncStorage from 'AsyncStorage';

export default (state = {loggedIn: false, loginMessage: "Hope you like it better than paper."}, action) => {
    switch (action.type) {
    case 'login':
        return Object.assign({}, state, { loggedIn: true,
                                          token: action.token,
                                          refreshToken: action.refreshToken,
                                          loginMessage: "Nice To See You!"});
        return newState;
    case 'loginError':
        return Object.assign({}, state, { loggedIn: false,
                                          token: null,
                                          refreshToken: null,
                                          loginMessage: action.message,
                                          uiLokkaClient: null });
        return newState;
    case 'logout':
      return Object.assign({}, state, { loggedIn: false,
                                        token: null,
                                        refreshToken: null,
                                        loginMessage: "Hope you like it better than paper.",
                                        uiLokkaClient: null });
    case 'setLokka':
        return Object.assign({}, state, { uiLokkaClient: action.uiLokkaClient });

    default:
        return state;
    }
};
