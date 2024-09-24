const initialState = {
    userLoginStatus: false,
    currUser: null
}

const userStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_USER_LOGIN_STATUS":
            return {
                ...state,
                userLoginStatus: action.payload
            };
        case "SET_CURR_USER":
            return {
                ...state,
                currUser: action.payload
            };
        default:
            return state;
    }
};

export default userStatusReducer;