import { INPUT_ERROR } from "../redux/reducers/error-handling/ErrorConstants";
import { SUCCESS } from "../redux/reducers/alert/AlertConstants";
import { ERROR as ALERT_ERROR } from "../redux/reducers/alert/AlertConstants";
import {
  LOGIN,
  SET_USER_ID,
  SET_TOKEN
} from "../redux/reducers/auth/AuthConstants";
import { LOADING } from "../redux/reducers/loading/LoadingConstants";

/*****************
 * Register User *
 *****************/
export const registerUser = (data, props) => async dispatch => {
  const {
    firstName,
    lastName,
    email,
    password,
    gender,
    dob,
    confirmPassword
  } = data;

  try {
    dispatch({ type: INPUT_ERROR, payload: null });
    // Check for any empty fields
    if (!firstName) {
      const err = new Error("Please enter your first name");
      err.name = "firstName";
      throw err;
    }
    if (!lastName) {
      const err = new Error("Please enter your last name");
      err.name = "lastName";
      throw err;
    }
    if (!email) {
      const err = new Error("Please enter a valid email");
      err.name = "email";
      throw err;
    }

    if (!gender) {
      const err = new Error("Please select a gender");
      err.name = "gender";
      throw err;
    }
    // Check for a valid date of birth
    const currentDate = Date.now(),
      inputDate = new Date(dob);
    // Calculate age
    const dateDiff = new Date(Date.now() - inputDate.getTime());
    const age = Math.abs(dateDiff.getUTCFullYear() - 1970);
    if (inputDate > currentDate || !dob) {
      const err = new Error("Enter a valid date of birth");
      err.name = "dob";
      throw err;
    }
    if (age < 18) {
      const err = new Error(
        "You need to be at least 18 years or older to register"
      );
      err.name = "dob";
      throw err;
    }

    if (!password || password.length < 10) {
      const err = new Error(
        "Enter a password that is at least 10 characters long"
      );
      err.name = "password";
      throw err;
    }

    if (!confirmPassword || password !== confirmPassword) {
      const err = new Error("Passwords do not match");
      err.name = "password";
      throw err;
    }
    // Parse date
    const parsedDate = new Date(dob).toISOString();

    const formData = {
      firstName,
      lastName,
      email,
      password,
      dob: parsedDate,
      gender
    };

    dispatch({
      type: LOADING,
      payload: {
        type: "register",
        userId: null,
        value: true
      }
    });

    const data = await fetch(`${process.env.REACT_APP_API_URI}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "register",
        userId: null,
        value: false
      }
    });

    if (data.status === 422) {
      const error = new Error(data.message);
      error.name = data.type;
      throw error;
    }

    // Dispatch success alert to user
    dispatch({
      type: SUCCESS,
      payload: {
        message: "You have successfully registered",
        type: "success"
      }
    });

    dispatch({
      type: LOADING,
      payload: {
        type: "register",
        userId: null,
        value: false
      }
    });

    // Redirect user to login page
    props.history.push("/login");
  } catch (err) {
    dispatch({ type: INPUT_ERROR, payload: err });
  }
};

/**************
 * User Login *
 **************/
export const loginUser = (email, password, props) => async dispatch => {
  try {
    // Check for valid input
    if (!email) {
      const error = new Error("Invalid email");
      error.type = "error";
      throw error;
    }

    if (!password || password.length < 10) {
      const error = new Error("Invalid email or password");
      error.type = "error";
      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "login",
        userId: null,
        value: true
      }
    });

    const data = await fetch(`${process.env.REACT_APP_API_URI}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "login",
        userId: null,
        value: false
      }
    });

    if (data.status === 401) {
      dispatch({
        type: ALERT_ERROR,
        payload: { message: "Invalid email or password", type: "error" }
      });
      return;
    }

    // Continue if there are no errors
    const token = data.token,
      userId = data.userId;

    // Set token to local storage
    localStorage.setItem("token", token);

    // Set user id to local storage
    localStorage.setItem("userId", userId);

    dispatch({
      type: LOADING,
      payload: {
        type: "login",
        userId: null,
        value: false
      }
    });

    // Set is Auth to true in state
    dispatch({ type: LOGIN, payload: true });

    // Set userId in state
    dispatch({ type: SET_USER_ID, payload: data.userId });

    // Reload page to get redirected back to homepage
    window.location.reload();
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/****************************
 * Send password reset link *
 ****************************/
export const sendResetLink = (email, props) => async dispatch => {
  try {
    // Check if email is empty
    if (!email) {
      const error = new Error("Not a valid email address");
      error.name = "email";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "reset",
        userId: null,
        value: true
      }
    });

    const data = await fetch(
      `${process.env.REACT_APP_API_URI}/auth/password-reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "reset",
        userId: null,
        value: false
      }
    });

    if (data.status === 404) {
      const error = new Error(data.message);
      error.name = "email";
      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "reset",
        userId: null,
        value: false
      }
    });

    if (data.status === 404) {
      const error = new Error(data.message);
      error.name = "email";
      throw error;
    }

    // Continue if there are no errors

    dispatch({
      type: LOADING,
      payload: {
        type: "reset",
        userId: null,
        value: false
      }
    });

    // Send success alert to user
    dispatch({
      type: SUCCESS,
      payload: { message: data.message, type: "success" }
    });

    // // Reset any errors
    dispatch({ type: INPUT_ERROR, payload: null });

    // Redirect user
    props.history.push("/login");
  } catch (err) {
    dispatch({ type: INPUT_ERROR, payload: err });
  }
};

/*******************
 * Change password *
 *******************/
export const changePassword = (
  password,
  resetToken,
  props
) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "change password",
        userId: null,
        value: true
      }
    });

    // Check if password is empty or under 10 characters long
    if (!password || password.length < 10) {
      const error = new Error(
        "Please enter a password that is at least 10 characters long"
      );
      error.name = "password";
      throw error;
    }

    // Continue if there are no errors

    const data = await fetch(
      `${process.env.REACT_APP_API_URI}/auth/password-reset`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, resetToken })
      }
    ).then(async res => await res.json());

    if (data.status !== 201) {
      const error = new Error(data.message);
      error.name = "password";
      throw error;
    }
    dispatch({
      type: LOADING,
      payload: {
        type: "change password",
        userId: null,
        value: false
      }
    });
    // Send success alert to user
    dispatch({
      type: SUCCESS,
      payload: { message: data.message, type: "success" }
    });

    // Redirect user back to login page
    props.history.push("/login");
  } catch (err) {
    dispatch({ type: INPUT_ERROR, payload: err });
  }
};

/********************************
 * Set isAuth to true for props *
 ********************************/
export const setAuth = value => dispatch => {
  dispatch({ type: LOGIN, payload: value });
};

/*********************************
 * Set logged in userId to props *
 *********************************/
export const setUserId = userId => dispatch => {
  dispatch({ type: SET_USER_ID, payload: userId });
};

/*************************************
 * Set logged in user token to props *
 *************************************/
export const setToken = token => dispatch => {
  dispatch({ type: SET_TOKEN, payload: token });
};
