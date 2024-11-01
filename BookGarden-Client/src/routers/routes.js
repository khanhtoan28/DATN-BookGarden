import React from "react";

import Login from "../pages/Login/login";
import PublicRoute from "../components/PublicRoute";

import { Layout } from "antd";
import { withRouter } from "react-router";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Register from "../pages/Register/register";

import ResetPassword from "../pages/ResetPassword/resetPassword";

const RouterURL = withRouter(({ location }) => {
  //
  const PublicContainer = () => (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout style={{ display: "flex" }}>
          <Route exact path="/reset-password/:id">
            <ResetPassword />
          </Route>
        </Layout>
      </Layout>
    </div>
  );

  const LoginContainer = () => (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout style={{ display: "flex" }}>
          <PublicRoute exact path="/">
            <Login />
          </PublicRoute>
          <PublicRoute exact path="/login">
            <Login />
          </PublicRoute>
          <PublicRoute exact path="/register">
            <Register />
          </PublicRoute>
        </Layout>
      </Layout>
    </div>
  );

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/login">
            <LoginContainer />
          </Route>
          <Route exact path="/register">
            <LoginContainer />
          </Route>

          <Route exact path="/reset-password/:id">
            <PublicContainer />
          </Route>
        </Switch>
      </Router>
    </div>
  );
});

export default RouterURL;
