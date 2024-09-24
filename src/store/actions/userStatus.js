export const setUserLoginStatus = (isLogin) => ({
    type: "SET_USER_LOGIN_STATUS",
    payload: isLogin
});

export const setCurrUser = (user) => ({
    type: "SET_CURR_USER",
    payload: user
});