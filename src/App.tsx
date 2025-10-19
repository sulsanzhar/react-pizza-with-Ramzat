import Loadable from 'react-loadable';
import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppDispatch } from './redux/store';

import Home from './pages/Home';
import './scss/app.scss';
import MainLayout from './layouts/MainLayout';

// ✅ импортируем экшен для загрузки корзины
import { fetchCartFromFirebase } from './redux/cart/slice';

const Cart = Loadable({
  loader: () => import(/* webpackChunkName: "Cart" */ './pages/Cart'),
  loading: () => <div>Идёт загрузка корзины...</div>,
});

const FullPizza = React.lazy(() => import(/* webpackChunkName: "FullPizza" */ './pages/FullPizza'));
const NotFound = React.lazy(() => import(/* webpackChunkName: "NotFound" */ './pages/NotFound'));

function App() {
  const dispatch = useAppDispatch();
  
  // 🔥 при старте загружаем корзину из Firebase
  useEffect(() => {
    dispatch(fetchCartFromFirebase());
  }, [dispatch]);
  
  return (
    <Routes>
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