import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./register/register";
import RegisterAdmin from "./registerAdmin/registerAdmin";
import Update from "./updateUser/update";
import UpdateAdmin from "./updateAdmin/updateAdmin";
import Verify from "./verifyMail/verifyMail";
import LoginUser from "./loginUser/loginUser";
import LoginAdmin from "./loginAdmin/loginAdmin";
import Dashboard from "./dashboard/dashboard";
import DashboardAdmin from "./dashboard/dashboardAdmin";
import Logout from "./logoutUser/logoutUser";
import Homepage from "./homepage/Homepage";
import ProfileUser from "./profileUser/profileUser";
import ProfileAdmin from "./profileAdmin/profileAdmin";
import Forgetpassword from "./forgetpassword/forgetpassword";
import ForgetPasswordAdmin from "./forgetpassword/forgetpasswordAdmin";
import ResetPassword from "./resetpassword/resetpassword";
import DownloadButton from "./download/DownloadButton";
import ChatRoom from "./chatroom/chatroom";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/registerAdmin",
      element: <RegisterAdmin />,
    },
    {
      path: "/verify/:id",
      element: <Verify />,
    },
    {
      path: "/login",
      element: <LoginUser />,
    },
    {
      path: "/loginAdmin",
      element: <LoginAdmin />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/dashboardAdmin",
      element: <DashboardAdmin />,
    },
    {
      path: "/update/:id",
      element: <Update />,
    },
    {
      path: "/updateAdmin/:id",
      element: <UpdateAdmin />,
    },
    {
      path: "/profile",
      element: <ProfileUser />,
    },
    {
      path: "/profileAdmin",
      element: <ProfileAdmin />,
    },
    {
      path: "/chatroom/:id",
      element: <ChatRoom />,
    },
    {
      path: "/download",
      element: <DownloadButton />,
    },
    {
      path: "/forgetpassword",
      element: <Forgetpassword />,
    },
    {
      path: "/forgetpasswordadmin",
      element: <ForgetPasswordAdmin />,
    },
    {
      path: "/resetpassword",
      element: <ResetPassword />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    {
      path: "*", // Catch all route
      element: "", // 404 component
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
