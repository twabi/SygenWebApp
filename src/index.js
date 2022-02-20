import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import "mdbreact/dist/css/mdb.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "antd/dist/antd.css";
import 'semantic-ui-css/semantic.min.css'
import "@material-tailwind/react/tailwind.css";
import {BrowserRouter} from "react-router-dom";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <BrowserRouter>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
