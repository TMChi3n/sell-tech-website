import HomePage from "../page/homePage.jsx";
import ManagementProduct from "../components/product/productPage.jsx";
import ChangePassword from "../components/user/childrenUser/change-password.jsx";
import Login from "../components/user/childrenUser/login.jsx";

const routePrivate = [
  {
    path: "/",
    component: HomePage,
  }
];

const routePublic = [
  {
    path: "/reset-password",
    component: ChangePassword,
  },
  {
    path: "/login",
    component: Login,
  },
];

export { routePrivate, routePublic };
