import { createBrowserRouter, redirect } from "react-router-dom";
import Login from "../Pages/Login";
import store from "../Store";
import Layout from "../Layout";
import Home from "../Pages/Home";
import GetAllCategory from "../Pages/Categories/GetAll";
import Categories from "../Pages/Categories";
import CreateCategory from "../Pages/Categories/Create";
import UpdateCategory from "../Pages/Categories/Update";
import Brands from "../Pages/Brands";
import GetAllBrands from "../Pages/Brands/GetAll";
import CreateBrand from "../Pages/Brands/Create";
import UpdateBrand from "../Pages/Brands/Update";
import Users from "../Pages/User";
import GetAllUsers from "../Pages/User/GetAll";
import UpdateUser from "../Pages/User/Update";
import Address from "../Pages/Address";
import GetAllAddress from "../Pages/Address/GetAll";
import CreateAddress from "../Pages/Address/Create";
import UpdateAddress from "../Pages/Address/Update";
import Variant from "../Pages/Variant";
import GetAllVariant from "../Pages/Variant/GetAll";
import CreateVariant from "../Pages/Variant/Create";
import UpdateVariant from "../Pages/Variant/Update";
import GetAllProduct from "../Pages/Product/GetAll";
import CreateProduct from "../Pages/Product/Create";
import UpdateProduct from "../Pages/Product/Update";
import ProductVariant from "../Pages/ProductVariant";
import GetAllProductVariant from "../Pages/ProductVariant/GetAll";
import CreateProductVariant from "../Pages/ProductVariant/Create";
import UpdateProductVariant from "../Pages/ProductVariant/Update";
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
        path: "/category",
        element: <Categories />,
        children: [
          { 
            index:true, 
            element: <GetAllCategory /> 
          },
          {
            path: "create",
            element: <CreateCategory />,
          },
          {
            path: "update/:id",
            element: <UpdateCategory />,
          },
        ],
      },
      {
        path: "/brand",
        element: <Brands />,
        children: [
          { 
            index:true, 
            element: <GetAllBrands /> 
          },
          {
            path: "create",
            element: <CreateBrand />,
          },
          {
            path: "update/:id",
            element: <UpdateBrand />,
          },
        ],
      },
      {
        path: "/user",
        element: <Users />,
        children: [
          { 
            index:true, 
            element: <GetAllUsers /> 
          },
          {
            path: "update/:id",
            element: <UpdateUser />,
          },
        ],
      },
      {
      path: "/address",
      element: <Address />,
      children: [
        { 
          index:true, 
          element: <GetAllAddress /> 
        },
        {
          path: "create",
          element: <CreateAddress />,
        },
        {
          path: "update/:id",
          element: <UpdateAddress />,
        },
      ],
    },
    {
      path: "/product",
      element: <Variant />,
      children: [
        { 
          index:true, 
          element: <GetAllProduct /> 
        },
        {
          path: "create",
          element: <CreateProduct />,
        },
        {
          path: "update/:id",
          element: <UpdateProduct />,
        },
      ],
    },
    {
      path: "/variant",
      element: <Variant />,
      children: [
        { 
          index:true, 
          element: <GetAllVariant /> 
        },
        {
          path: "create",
          element: <CreateVariant />,
        },
        {
          path: "update/:id",
          element: <UpdateVariant />,
        },
      ],
    },
    {
      path: "/product-variant",
      element: <ProductVariant />,
      children: [
        { 
          index:true, 
          element: <GetAllProductVariant /> 
        },
        {
          path: "create",
          element: <CreateProductVariant />,
        },
        {
          path: "update/:id",
          element: <UpdateProductVariant />,
        },
      ],
    }
    ],
  },
]);
export default router;
