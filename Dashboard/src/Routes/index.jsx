import { createBrowserRouter, redirect } from "react-router-dom";
import store from "../Store";
import Layout from "../Components/Layout";
import Home from "../Pages/Home";
import GetAllCategories from "../Pages/Categories/GetAll";
import Categories from "../Pages/Categories";
import CreateCategory from "../Pages/Categories/Create";
import UpdateCategory from "../Pages/Categories/Update";
import Login from "../Pages/Login";
import Brands from "../Pages/Brands";
import GetAllBrands from "../Pages/Brands/GetAll";
import CreateBrand from "../Pages/Brands/Create";
import UpdateBrand from "../Pages/Brands/Update";
import Users from "../Pages/Users";
import GetAllUsers from "../Pages/Users/GetAll";
import UpdateUser from "../Pages/Users/Update";

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
    element: <Login />,
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
      {
        path: "/brands",
        element: <Brands />,
        children: [
          {
            index:true,
            element: <GetAllBrands />,
          },
          {
            path: "create",
            element: <CreateBrand />,
          },
          {
            path: "update",
            element: <UpdateBrand />,
          },
        ],
      },
      {
        path: "/users",
        element: <Users />,
        children: [
          {
            index:true,
            element: <GetAllUsers />,
          },
          {
            path: "update",
            element: <UpdateUser />,
          },
        ],
      },
    ],
  },
]);

export default router;
