import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import Routes from 'routes';
import './index.css';
import 'tw-elements-react/dist/css/tw-elements-react.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-material.css'; // Optional theme CSS
import 'styles/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const RootApp = () => {
  return (
    <>
      <Routes />
      <ToastContainer />
    </>
  );
};
root.render(<RootApp />);

reportWebVitals();
