import React from "react";
import Home from "../pages/Home/home";
import Login from "../pages/Login/login";
import PublicRoute from "../components/PublicRoute";
import Footer from "../components/layout/Footer/footer";
import Header from "../components/layout/Header/header";


import { Layout } from "antd";
import { withRouter } from "react-router";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Register from "../pages/Register/register";
import ResetPassword from "../pages/ResetPassword/resetPassword";

const RouterURL = withRouter(({ location }) => {
  const PrivateContainer = () => (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout style={{ display: "flex" }}>
          <Header />
          <Switch>
            <Route exact path="/home">
              <Home />
            </Route>
          </Switch>
          <Layout>
            <Footer />
          </Layout>
        </Layout>
      </Layout>
    </div>
  );


  const PublicContainer = () => (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout style={{ display: "flex" }}>
          <Header />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
          
            <Route exact path="/reset-password/:id">
              <ResetPassword />
            </Route>
          </Switch>
          <Layout>
            <Footer />
          </Layout>
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
          <Route exact path="/">
            <PublicContainer />
          </Route>
        
          <Route exact path="/login">
            <LoginContainer />
          </Route>
          <Route exact path="/register">
            <LoginContainer />
          </Route>
         
          <Route exact path="/home">
            <PrivateContainer />
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
