import HomePage from "../page/homePage.jsx";
import ManagementProduct from "../components/product/productPage.jsx";
import ChangePassword from "../components/user/childrenUser/change-password.jsx";

const routePrivate = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/admin",
    component: ManagementProduct,
  },
];

const routePublic = [
  {
    path: "/reset-password",
    component: ChangePassword,
  },
];

export { routePrivate, routePublic };
