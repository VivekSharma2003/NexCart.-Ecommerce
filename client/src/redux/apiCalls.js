import { loginFailure, loginStart, loginSuccess, logout, registerStart, registerSuccess, registerFailure } from "./userRedux.js";
import { publicRequest } from "../requestMethods.js";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

export const handleLogout = (dispatch) => {
  dispatch(logout());
  localStorage.removeItem("persist:root");
};

export const register = async (dispatch, user) => {
  dispatch(registerStart());
  try {
    const res = await publicRequest.post("/auth/register", user);
    dispatch(registerSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(registerFailure());
    return null;
  }
};
