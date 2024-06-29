import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { routePrivate, routePublic } from "./routes/route";
import AuthRoute from "./routes/authRoute";
import { setUser } from "./redux/userSlice";
import AdminPage from "./page/homePage"; // Ensure this import is correct

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("user_info"));
    if (storedUserInfo) {
      dispatch(setUser(storedUserInfo));
    }
  }, [dispatch]);

  return (
    <Routes>
      {routePrivate.map((route, index) => {
        const Page = route.component;
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <AuthRoute>
                <Page />
              </AuthRoute>
            }
          />
        );
      })}
      {routePublic.map((route, index) => {
        const Page = route.component;
        return <Route key={index} path={route.path} element={<Page />} />;
      })}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
