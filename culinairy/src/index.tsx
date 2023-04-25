import React, { Suspense } from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from "./store";
const App = React.lazy(() => import("./App"));


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
        <div className="text-4xl text-gray-500">
          <i className="fas fa-gear fa-spin text-[2em] text-[#5259ad]"></i>
        </div>
      </div>}>
        <App />
      </Suspense>
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
