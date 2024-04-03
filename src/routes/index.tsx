import React from 'react';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import { getKey, removeKey } from 'utils';
import Home from 'pages/Home';
import Login from 'pages/Login';
import Register from 'pages/Register';
import { HomeNav, ROUTES } from './config';
import { ACCESS_TOKEN } from 'config/localStorage';
import { verifyAccessToken } from 'services/auth';
import VerifyOtp from 'components/VerifyOtp';

const loader = async () => {
  const token = getKey(ACCESS_TOKEN);
  if (token) {
    try {
      const res = await verifyAccessToken();
      console.log({ res });
      return redirect('/');
    } catch (error) {
      removeKey(ACCESS_TOKEN);
      return {};
    }
  }
  return {};
};
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: HomeNav,
    loader: async () => {
      const token = getKey(ACCESS_TOKEN);
      if (token) {
        try {
          const data = await verifyAccessToken();
          return data.result.user;
        } catch (error) {
          removeKey(ACCESS_TOKEN);
          return redirect(ROUTES.LOGIN);
        }
      }
      return redirect(ROUTES.LOGIN);
    },
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
    loader,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
    loader,
  },
  {
    path: ROUTES.VERIFY_OTP,
    element: <VerifyOtp />,
    loader: async () => {
      const token = getKey(ACCESS_TOKEN);
      if (token) {
        try {
          const res = await verifyAccessToken();
          const user = res.result.user;
          if (user.isEmailVerified) {
            return redirect('/');
          }
          return user;
        } catch (error) {
          removeKey(ACCESS_TOKEN);
        }
      }
      return redirect(ROUTES.LOGIN);
    },
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
