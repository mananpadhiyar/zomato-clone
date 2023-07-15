import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const navigate = useNavigate();

  let onSuccess = (credentialResponse) => {
    let token = credentialResponse.credential;

    try {
      let data = jwt_decode(token);

      // store the data in localstorage
      localStorage.setItem("advance_zomato_auto_token", token);

      window.location.reload();
    } catch (error) {
      console.log(error);

      localStorage.removeItem("advance_zomato_auto_token");
    }
    // console.log(decoded.email)

    console.log(credentialResponse);
  };

  let onError = () => {
    console.log("Login Failed");
  };

  let logout = () => {
    let islogOut = window.confirm("are you sure to logout?");

    if (islogOut) {
      localStorage.removeItem("advance_zomato_auto_token");
      window.location.reload();
    }
  };

  return (
    <GoogleOAuthProvider clientId="683936420121-6hbr9q6l6drqedtmebjuhcn95tsd5au1.apps.googleusercontent.com">
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                login/signup
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <GoogleLogin onSuccess={onSuccess} onError={onError} />;
            </div>
          </div>
        </div>
      </div>

      <div className="  m-2 col-10 d-flex align-items-center justify-content-between py-2">
        {props.logo === false ? (
          <p></p>
        ) : (
          <p onClick={() => navigate(`/`)} className="m-0 brand">
            e!
          </p>
        )}

        <div>
          {props.user ? (
            <>
              <button className="account-btn account-btn-log-in  btn-outline-light border">
                welcome , {props.user.name}
              </button>
              <button
                onClick={logout}
                className=" mx-3 account-btn account-btn-log-out btn-outline-light border"
              >
                logout
              </button>
            </>
          ) : (
            <button
              className=" account-btn  btn-outline-light border"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              login/signup
            </button>
          )}

          {/* <button className="btn text-white">Login</button> */}
          {/* <button className="btn btn-outline-light border" data-bs-toggle="modal" data-bs-target="#exampleModal" >
                <i className="fa fa-search" aria-hidden="true"></i>
                login
              </button> */}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Header;
