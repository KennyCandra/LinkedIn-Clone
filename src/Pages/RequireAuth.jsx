import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

function RequireAuth({ user }) {
  const navigate = useNavigate();

  if (!user) {
    return navigate("/", { replace: true });
  }

  return <Outlet />;
}

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const connectedApp = connect(mapStateToProps)(RequireAuth);

export default connectedApp;
