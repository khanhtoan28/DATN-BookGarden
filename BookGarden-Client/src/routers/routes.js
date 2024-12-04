// Cập nhật RouterURL
import React from "react";
import Home from "../pages/Home/home";
import Login from "../pages/Login/login";
import PublicRoute from "../components/PublicRoute";
import PrivateRoute from "../components/PrivateRoute";
import NotFound from "../components/NotFound/notFound";
import Footer from "../components/layout/Footer/footer";
import Header from "../components/layout/Header/header";
import ProductDetail from "../pages/Product/ProductDetail/productDetail";
import Profile from "../pages/Profile/profile";
import Cart from "../pages/Purchase/Cart/cart";
import CartHistory from "../pages/Purchase/ManagementCart/cartHistory";
import { Layout } from "antd";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Register from "../pages/Register/register";
import ProductList from "../pages/Product/ProductList/productList";
import ResetPassword from "../pages/ResetPassword/resetPassword";

const RouterURL = ({ location }) => {
  const PrivateContainer = () => (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout style={{ display: "flex" }}>
          <Header />
          <Switch>
            <Route exact path="/home">
              <Home />
            </Route>
            <PrivateRoute exact path="/event-detail/:id">
              <ProductDetail />
            </PrivateRoute>
            <PrivateRoute exact path="/profile">
              <Profile />
            </PrivateRoute>

            <PrivateRoute exact path="/cart-history">
              <CartHistory />
            </PrivateRoute>
            <PrivateRoute exact path="/product-list">
              <ProductList />
            </PrivateRoute>
            <PrivateRoute exact path="/:id">
              <ProductList />
            </PrivateRoute>
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
            <Route exact path="/product-detail/:id">
              <ProductDetail />
            </Route>
            <Route exact path="/cart">
              <Cart />
            </Route>

            <Route exact path="/product-list">
              <ProductList />
            </Route>
            <Route exact path="/reset-password/:id">
              <ResetPassword />
            </Route>

            <Route exact path="/:id">
              <ProductList />
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
          <Route exact path="/product-detail/:id">
            <PublicContainer />
          </Route>
          <Route exact path="/cart">
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
          <Route exact path="/profile">
            <PrivateContainer />
          </Route>

          <Route exact path="/cart-history">
            <PrivateContainer />
          </Route>
          <Route exact path="/product-list">
            <PublicContainer />
          </Route>

          <Route exact path="/reset-password/:id">
            <PublicContainer />
          </Route>

          <Route exact path="/:id">
            <PublicContainer />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default RouterURL;
