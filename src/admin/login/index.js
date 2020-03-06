import React from 'react';
import MineFooter from '../components/Footer'
import { Layout, Form, Icon, Input, Button, message } from 'antd';
import './index.less';
import axios from '../../axios'
import { connect } from 'react-redux';
import { login } from '../../redux/action'
const { Content, Footer } = Layout;
const FormItem = Form.Item;
class Login extends React.Component{

    state = {
        loading:false
    }

    componentWillMount(){
        this.startMusic();
    }

    startMusic = () => {
        const music = document.getElementById("music");
        music.play();
    }

    stopMusic = () => {
        const music = document.getElementById("music");
        music.pause();
    }

    handleLogin = () => {
        const { dispatch } = this.props;
        this.props.form.validateFields((error, values)=>{
            if(!error){
                this.setState({
                    loading:true
                })
                axios.post({
                    url:'/account/login',
                    data:{
                        username:values.username,
                        password:values.password
                    }
                }).then((res)=>{
                    // console.log(res)
                    message.success("登录成功")
                    dispatch(login(res.data))
                    this.setState({loading:false})
                    this.stopMusic();
                    this.props.history.push('/admin/home')
                }).catch(()=>{
                    message.error("用户名或密码错误")
                    this.setState({
                        loading:false
                    })
                })
            }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const { loading } = this.state;
        return(
            <Layout className="login-container">
                <Content className="login-content">
                    <div className="login-content-form">
                        <h1>欢迎使用校园闲置品后台管理系统</h1>
                        <div className="login-content-title">
                            <span>账号密码登录</span>
                        </div>
                        <Form layout="horizontal">
                            <FormItem>
                                {
                                    getFieldDecorator('username',{
                                        rules:[
                                            {
                                                required:true,
                                                message:'用户名不能为空'
                                                
                                            }
                                        ]
                                    })(
                                        <Input prefix={<Icon type="user"/>} placeholder="请输入用户名"/>
                                    )
                                }
                            </FormItem>
                            <FormItem>
                                {
                                    getFieldDecorator('password',{
                                        rules:[
                                            {
                                                required:true,
                                                message:'密码不能为空'
                                            }
                                        ]
                                    })(
                                        <Input type="password" prefix={<Icon type="lock" />} placeholder="请输入密码" />
                                    )
                                }
                            </FormItem>
                            <FormItem>
                                <Button type="primary" loading={loading} onClick={this.handleLogin} htmlType="submit">登录</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Content>
                <Footer className="login-footer">
                    <MineFooter />
                </Footer>
            </Layout>
        )
    }
}

export default connect()(Form.create()(Login))