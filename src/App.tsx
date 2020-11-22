import React from 'react';
import {Switch, Route, Redirect, BrowserRouter} from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/home'
import axios from 'axios'
axios.defaults.baseURL = "http://47.98.128.88:8900/api/"

function App() {
    return (
        <BrowserRouter>
        <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/home' component={Home}/>
                <Redirect from="/" to="login"/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
