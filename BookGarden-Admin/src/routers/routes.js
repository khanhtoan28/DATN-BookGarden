import React, { Suspense, lazy } from "react";
import { Layout } from "antd";
import { withRouter } from "react-router";
import Footer from "../components/layout/footer/footer";
import Header from "../components/layout/header/header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import NotFound from "../components/notFound/notFound";
import Sidebar from "../components/layout/sidebar/sidebar";
import LoadingScreen from "../components/loading/loadingScreen";
import PrivateRoute from "../components/PrivateRoute";
import PulisherList from "../pages/PulisherList/pulisher";

const { Content } = Layout;

const ProductList = lazy(() => {
  return Promise.all([
    import("../pages/ProductList/productList"),
    new Promise((resolve) => setTimeout(resolve, 0)),
  ]).then(([moduleExports]) => moduleExports);
});

const CategoryList = lazy(() => {
  return Promise.all([
    import("../pages/CategoryList/categoryList"),
    new Promise((resolve) => setTimeout(resolve, 0)),
  ]).then(([moduleExports]) => moduleExports);
});
const AuthorList = lazy(() => {
  return Promise.all([
    import("../pages/AuthorList/authorList"),
    new Promise((resolve) => setTimeout(resolve, 0)),
  ]).then(([moduleExports]) => moduleExports);
});

const RouterURL = withRouter(({ location }) => {
  const DefaultContainer = () => (
    <PrivateRoute>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <Header />
          <Content
            style={{
              marginLeft: 230,
              width: "calc(100% - 230px)",
              marginTop: 50,
            }}
          >
            <PrivateRoute exact path="/product-list">
              <Suspense fallback={<LoadingScreen />}>
                <ProductList />
              </Suspense>
            </PrivateRoute>

            <PrivateRoute exact path="/category-list">
              <Suspense fallback={<LoadingScreen />}>
                <CategoryList />
              </Suspense>
            </PrivateRoute>
            <PrivateRoute exact path="/author-list">
              <Suspense fallback={<LoadingScreen />}>
                <AuthorList />
              </Suspense>
            </PrivateRoute>
            <PrivateRoute exact path="/pulisher-list">
              <Suspense fallback={<LoadingScreen />}>
                <PulisherList />
              </Suspense>
            </PrivateRoute>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </PrivateRoute>
  );

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/product-list">
            <DefaultContainer />
          </Route>
          <Route exact path="/category-list">
            <DefaultContainer />
          </Route>
          <Route exact path="/author-list">
            <DefaultContainer />
          </Route>
          <Route exact path="/pulisher-list">
            <DefaultContainer />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </div>
  );
});

export default RouterURL;
