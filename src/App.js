import React , { lazy, Suspense }from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import PrivateRoute from "./components/OracleCompon/PrivateRoute.js"
import { ToastContainer } from 'react-toastify';

const LoginOracle = lazy(() => import('./components/OracleCompon/LoginOracle.js'));
const HomeOracle = lazy(() => import('./components/OracleCompon/HomeOracle.js'));
const LoginHome = lazy(() => import('./components/OracleCompon/LoginHome.js'));
const Studycreate =lazy(() => import('./components/OracleCompon/Studycreate.js'));

function App() {
  return (
    <BrowserRouter>
     <TopBar />
     <ToastContainer autoClose={2500} position={'top-right'} />
     <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path='homeoracle' element={<PrivateRoute login={true}><HomeOracle path='/homeoracle' /></PrivateRoute>} />
        <Route path='LoginHome' element={<PrivateRoute login={true}><LoginHome path='/LoginHome' /></PrivateRoute>} />
        <Route path='Studycreate' element={<PrivateRoute login={true}><Studycreate path='/Studycreate' /></PrivateRoute>} />
        <Route path='loginoracle' element={<PrivateRoute login={false}><LoginOracle/></PrivateRoute>} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
