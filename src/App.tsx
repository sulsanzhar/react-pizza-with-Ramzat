import Loadable from "react-loadable";
import React, { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAppDispatch } from "./redux/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import "./scss/app.scss";
import MainLayout from "./layouts/MainLayout";

import { fetchCartFromFirebase } from "./redux/cart/slice";

const Cart = Loadable({
  loader: () => import("./pages/Cart"),
  loading: () => <div>Идёт загрузка корзины...</div>,
});
const FullPizza = React.lazy(() => import("./pages/FullPizza"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("👤 Пользователь вошёл:", currentUser.uid);
        dispatch(fetchCartFromFirebase(currentUser.uid));
      } else {
        console.log("👤 Пользователь не аутентифицирован");
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<MainLayout />}>
        <Route path="" element={<Home />} />
        <Route
          path="cart"
          element={
            <Suspense fallback={<div>Идёт загрузка корзины...</div>}>
              <Cart />
            </Suspense>
          }
        />
        <Route
          path="pizza/:id"
          element={
            <Suspense fallback={<div>Идёт загрузка...</div>}>
              <FullPizza />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<div>Идёт загрузка...</div>}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
