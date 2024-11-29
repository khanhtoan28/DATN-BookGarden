import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from "antd";

import Home from "../pages/Home/home";
import Login from "../pages/Login/login";
import Register from "../pages/Register/register";
import ResetPassword from "../pages/ResetPassword/resetPassword";
import Profile from "../pages/Profile/profile";
import CartHistory from "../pages/Purchase/ManagementCart/cartHistory";

import PublicRoute from "../components/PublicRoute";
import PrivateRoute from "../components/PrivateRoute";
import Footer from "../components/layout/Footer/footer";
import Header from "../components/layout/Header/header";

const RouterURL = () => {
  const PrivateContainer = () => (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout style={{ display: "flex" }}>
        <Switch>
          <PrivateRoute exact path="/cart-history">
            <CartHistory />
          </PrivateRoute>
          <PrivateRoute exact path="/profile">
            <Profile />
          </PrivateRoute>
          <Route exact path="/home">
            <Home />
          </Route>
        </Switch>
      </Layout>
      <Footer />
    </Layout>
  );

  const PublicContainer = () => (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout style={{ display: "flex" }}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/reset-password/:id">
            <ResetPassword />
          </Route>
        </Switch>
      </Layout>
      <Footer />
    </Layout>
  );

  const LoginContainer = () => (
    <Layout style={{ minHeight: "100vh" }}>
      <Switch>
        <PublicRoute exact path="/login">
          <Login />
        </PublicRoute>
        <PublicRoute exact path="/register">
          <Register />
        </PublicRoute>
      </Switch>
    </Layout>
  );

  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <Route exact path="/" component={PublicContainer} />
        <Route exact path="/reset-password/:id" component={PublicContainer} />

        {/* Login and Registration */}
        <Route exact path="/login" component={LoginContainer} />
        <Route exact path="/register" component={LoginContainer} />

        {/* Private Routes */}
        <Route path="/cart-history" component={PrivateContainer} />
        <Route path="/profile" component={PrivateContainer} />
        <Route path="/home" component={PrivateContainer} />
      </Switch>
    </Router>
  );
};

export default RouterURL;
