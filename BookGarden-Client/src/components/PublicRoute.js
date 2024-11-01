import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ children }) => {
  //

  return (
    <Route
      render={({ location }) => (
        <Redirect
          to={{
            pathname: "/home",
            state: { from: location },
          }}
        />
      )}
    />
  );
};

export default PublicRoute;
