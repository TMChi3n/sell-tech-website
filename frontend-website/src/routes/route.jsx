import HomePage from "../page/homePage.jsx";
import ManagementProduct from "../components/product/productPage.jsx";

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

export { routePrivate };
