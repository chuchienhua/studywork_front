const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAILURE = "LOGIN_FAILURE";
const LOGOUT = "LOGOUT";

const initialState = {
  id: undefined,
  pw: undefined,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        // ...state,
        id: action.payload.id,
        pw: action.payload.pw,
      };
    case LOGIN_FAILURE:
      return {
        // ...state,
        id: undefined,
        pw: undefined,
      };
    case LOGOUT:
      return {
        // ...state,
        id: undefined,
        pw: undefined,
      };
    default:
      return state;
  }
};

export default userReducer;
