import React, {useState, useEffect,useReducer} from 'react';
import {useDispatch,useSelector} from 'react-redux'
import {getInfo} from '../redux/action/user'
import {List, InputItem, Button, Toast, Icon, NavBar} from 'antd-mobile';
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import logo from '../images/logo.png'


const Login: React.FC<{}> = () => {
    const [initWidth, changeWidth] = useState<any>()
    const [username, changeUsername] = useState<string>()
    const [password, changPwd] = useState<string>()
    const dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        getInitWidth()
    })

    const getInitWidth = () => {
        changeWidth(document.body.clientWidth)
    }

    const login = () => {
        axios.post('user/login', {
            username,
            password,
        }).then(function (response) {
            dispatch(getInfo(response.data.data))
            history.push("/home");
            Toast.success('登陆成功', 1);
        }).catch(function (error) {
            Toast.fail(error.response.data.msg, 1);
        });
    }


    return (
        <div style={{width: initWidth}}>
            <NavBar
                mode="light"
            >日报辅助系统</NavBar>
            <img src={logo} style={{height: 100, width: initWidth}} alt="logo"/>
            <List>
                <InputItem
                    clear
                    placeholder="请输入你的学号"
                    onChange={(e) => changeUsername(e)}
                >学号</InputItem>
                <InputItem
                    type='password'
                    clear
                    placeholder="请输入你的密码"
                    onChange={(e) => changPwd(e)}
                >密码</InputItem>
            </List>
            <Button
                onClick={login}
                type="primary"
                style={{margin: 20, borderRadius: 20}}>
                登录
            </Button>
        </div>
    )
}

export default Login