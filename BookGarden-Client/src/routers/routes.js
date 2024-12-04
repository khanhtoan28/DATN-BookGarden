import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from "antd";

import Home from "../pages/Home/home";
import Login from "../pages/Login/login";
import Register from "../pages/Register/register";
import ResetPassword from "../pages/ResetPassword/resetPassword";
import Profile from "../pages/Profile/profile";
import CartHistory from "../pages/Purchase/ManagementCart/cartHistory";
import ProductDetail from "../pages/Product/ProductDetail/productDetail";
import ProductList from "../pages/Product/ProductList/productList";
import Cart from "../pages/Purchase/Cart/cart";

import PublicRoute from "../components/PublicRoute";
import PrivateRoute from "../components/PrivateRoute";
import NotFound from "../components/NotFound/notFound";
import Footer from "../components/layout/Footer/footer";
import Header from "../components/layout/Header/header";

const RouterURL = () => {
  // Public Routes Container
  const PublicContainer = () => (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Switch>
          <Route exact path="/home" component={Home} />
          <Route exact path="/product-detail/:id" component={ProductDetail} />
          <Route exact path="/cart" component={Cart} />
          <Route exact path="/product-list" component={ProductList} />
          <Route exact path="/reset-password/:id" component={ResetPassword} />
          <Route exact path="/:id" component={ProductList} />
        </Switch>
        <Footer />
      </Layout>
    </Layout>
  );

  // Private Routes Container
  const PrivateContainer = () => (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Switch>
          <Route exact path="/home" component={Home} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/cart-history" component={CartHistory} />
          <PrivateRoute exact path="/product-list" component={ProductList} />
        </Switch>
        <Footer />
      </Layout>
    </Layout>
  );

  // Login/Register Container
  const LoginContainer = () => (
    <Layout style={{ minHeight: "100vh" }}>
      <Switch>
        <PublicRoute exact path="/login" component={Login} />
        <PublicRoute exact path="/register" component={Register} />
      </Switch>
    </Layout>
  );

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={PublicContainer} />
        <Route exact path="/product-detail/:id" component={PublicContainer} />
        <Route exact path="/cart" component={PublicContainer} />
        <Route exact path="/product-list" component={PublicContainer} />
        <Route exact path="/reset-password/:id" component={PublicContainer} />
        <Route exact path="/:id" component={PublicContainer} />
        <Route exact path="/login" component={LoginContainer} />
        <Route exact path="/register" component={LoginContainer} />
        <Route exact path="/home" component={PrivateContainer} />
        <Route exact path="/profile" component={PrivateContainer} />
        <Route exact path="/cart-history" component={PrivateContainer} />

        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default RouterURL;
