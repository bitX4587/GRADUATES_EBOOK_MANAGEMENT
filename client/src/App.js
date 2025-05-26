import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./homepage/Homepage";
import Logout from "./logout/logoutUser";
import Layout from "./semantics/layout";
import Register from "./register/register";
import RegisterAdmin from "./register/registerAdmin";
import LoginUser from "./login/loginUser";
import LoginAdmin from "./login/loginAdmin";
import Update from "./update/update";
import UpdateAdmin from "./update/updateAdmin";
import Dashboard from "./dashboard/dashboard";
import Home from "./dashboard/home";
import Newsfeed from "./dashboard/newsfeed";
import DashboardAdmin from "./dashboard/dashboardAdmin";
import ProfileUser from "./profileUser/profileUser";
import ProfileAdmin from "./profileAdmin/profileAdmin";
import ResetPassword from "./resetpassword/resetpassword";
import DownloadButton from "./download/DownloadButton";
import ChatRoom from "./chatroom/chatroom";
import Course from "./courseroadmap/course";
import ResetPasswordAdmin from "./resetpassword/resetpasswordAdmin";
import Settings from "./setting/setting";
import PrivateRoute from "./routes/privateRoute"; // Import PrivateRoute
import PublicRoute from "./routes/publicRoute"; // Import PublicRoute
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const route = createBrowserRouter([
    {
      element: <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />,
      children: [
        {
          path: "/dashboard",
          element: <PrivateRoute element={<Dashboard />} />,
        },
        {
          path: "/home",
          element: <PrivateRoute element={<Home />} />,
        },
        {
          path: "/dashboardAdmin",
          element: <PrivateRoute element={<DashboardAdmin />} />,
        },
        {
          path: "/profileAdmin",
          element: <PrivateRoute element={<ProfileAdmin />} />,
        },
        {
          path: "/newsfeed",
          element: <PrivateRoute element={<Newsfeed />} />,
        },
        {
          path: "/profile",
          element: <PrivateRoute element={<ProfileUser />} />,
        },
        {
          path: "/download",
          element: <PrivateRoute element={<DownloadButton />} />,
        },
        {
          path: "/course",
          element: <PrivateRoute element={<Course />} />,
        },
        {
          path: "/setting",
          element: <PrivateRoute element={<Settings />} />,
        },
      ],
    },
    {
      path: "/",
      element: <PublicRoute element={<Homepage />} restricted={false} />,
    },
    {
      path: "/register",
      element: <PublicRoute element={<Register />} restricted={false} />,
    },
    {
      path: "/registerAdmin",
      element: <PublicRoute element={<RegisterAdmin />} restricted={false} />,
    },
    {
      path: "/login",
      element: <PublicRoute element={<LoginUser />} restricted={true} />,
    },
    {
      path: "/loginAdmin",
      element: <PublicRoute element={<LoginAdmin />} restricted={true} />,
    },
    {
      path: "/chatroom/:id",
      element: <PrivateRoute element={<ChatRoom />} />,
    },
    {
      path: "/update",
      element: <PrivateRoute element={<Update />} />,
    },
    {
      path: "/updateAdmin",
      element: <PrivateRoute element={<UpdateAdmin />} />,
    },
    {
      path: "/resetpassword",
      element: <PublicRoute element={<ResetPassword />} restricted={true} />,
    },
    {
      path: "/resetpasswordAdmin",
      element: (
        <PublicRoute element={<ResetPasswordAdmin />} restricted={true} />
      ),
    },
    {
      path: "/logout",
      element: <PrivateRoute element={<Logout />} />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
