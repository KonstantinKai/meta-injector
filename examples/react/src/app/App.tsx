// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './App.module.css';

import { Route, Routes, Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Page1 = lazy(() => import('./pages/Feature1Page'));
const Page2 = lazy(() => import('./pages/Feature2Page'));
const Page3 = lazy(() => import('./pages/Feature3Page'));

export function App() {
  return (
    <>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-1">Page 1</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
          <li>
            <Link to="/page-3">Page 3</Link>
          </li>
        </ul>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                This is the generated root route
              </div>
            }
          />
          <Route
            path="/page-1"
            element={<Page1 />}
          />
          <Route
            path="/page-2"
            element={<Page2 />}
          />
          <Route
            path="/page-3"
            element={<Page3 />}
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
