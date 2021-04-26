import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import App from './App';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import Admin from './admin/loadable'
import Home from './admin/home'
import Picture from './admin/picture'
import Announce from './admin/announce'
import Good from './admin/good'
import GoodInfo from './admin/good/goodInfo'
import Discuss from './admin/discuss'
import User from './admin/user'
import InforMation from './admin/manager/information'
import Account from './admin/manager/account'
import Password from './admin/password'
import Login from './admin/login/loadable'
import NotFound from './admin/components/404'

export default class Router extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <ConfigProvider locale={zhCN}>
                    <App>
                        <Switch>
                            <Route path="/admin" render={() =>
                                <Admin>
                                    <Switch>
                                        <Route path="/admin/home" component={Home} />
                                        <Route path="/admin/picture" component={Picture} />
                                        <Route path="/admin/announce" component={Announce} />
                                        <Route path="/admin/good" exact component={Good} />
                                        <Route path="/admin/good/goodInfo/:id" component={GoodInfo} />
                                        <Route path="/admin/discuss" component={Discuss} />
                                        <Route path="/admin/user" component={User} />
                                        <Route path="/admin/manager/information" component={InforMation} />
                                        <Route path="/admin/manager/account" component={Account} />
                                        <Route path="/admin/modifyPassword" component={Password} />
                                        <Route path="/admin/*" component={NotFound} />
                                    </Switch>
                                </Admin>
                            } />
                            <Route path="/user/login" component={Login} />
                            <Redirect from="/" to="/user/login" />
                        </Switch>
                    </App>
                </ConfigProvider>
            </BrowserRouter>
        )
    }
}