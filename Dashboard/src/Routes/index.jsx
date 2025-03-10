import { createBrowserRouter, redirect } from "react-router-dom";
import store from "../Store";
import Layout from "../Components/Layout";
import Home from "../Pages/Home";
import GetAllCategories from "../Pages/Categories/GetAll";
import Categories from "../Pages/Categories";
import CreateCategory from "../Pages/Categories/Create";
import UpdateCategory from "../Pages/Categories/Update";

const checkAuth = () => {
  const state = store.getState();
  const token = state?.auth?.token;

  if (!token) {
    return redirect("/login");
  }
  return null;
};

const checkLogin = () => {
  const state = store.getState();
  const token = state?.auth?.token;

  if (token) {
    return redirect("/");
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: "/login",
    loader: checkLogin,
    element: <Layout />,
  },
  {
    path: "/",
    loader: checkAuth,
    element: <Layout />,
    children: [
      {
        index:true,
        element: <Home />,
      },
      {
        path: "/categories",
        element: <Categories />,
        children: [
          {
            index:true,
            element: <GetAllCategories />,
          },
          {
            path: "create",
            element: <CreateCategory />,
          },
          {
            path: "update",
            element: <UpdateCategory />,
          },
        ],
      },
    ],
  },
]);

export default router;
