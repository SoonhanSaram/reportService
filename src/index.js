import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import { App } from './App';

// provider 
import { CommonContextPovider } from './provider/common';
import { RouterProvider } from 'react-router-dom';
import { Router } from './router/router';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    {/* contextProvider 를 사용하기 위해서 최상단에서 묶기 */}
    <CommonContextPovider>
      {/* createBrowserRouter 를 사용하기 위한 RouterProvider 를 통해 묶기 */}
      <RouterProvider router={Router}>
        <App />
      </RouterProvider>
    </CommonContextPovider>
  </>
);

