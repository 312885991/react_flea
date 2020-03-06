import React from 'react';
import { Card, Form, Button, Icon, Input, message } from 'antd';
import axios from '../../axios'
import { connect } from 'react-redux';
import { logout } from '../../redux/action'
const FormItem = Form.Item;
class Password extends React.Component{

    handleModifyPassword = (values) => {
        const { dispatch } = this.props;
        axios.put({
            url:'/account/updatePassword',
            data:values
        }).then(()=>{
            message.success("密码修改成功，请重新登录");
            dispatch(logout());
            window.location.href = '/user/login';
        }).catch(()=>{
            message.error("原密码不正确")
        })
    }

    render(){
        return(
            <div>
                <Card>
                    <PasswordForm username={this.props.userInfo.username} handleModifyPassword={this.handleModifyPassword}/>
                </Card>
            </div>
        )
    }
}

class PasswordForm extends React.Component{


    handleConfirmPwd = (rules, value, callback) => {
        let newPassword = this.props.form.getFieldValue('newPassword');
        if(newPassword && newPassword !== value){
            callback(new Error('两次密码输入不一致'))
        }else{
            // 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
            callback();
        }
    }

    handleModifyPassword = () => {
        this.props.form.validateFields((error, values)=>{
            if(!error){
                this.props.handleModifyPassword(values);
            }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const username = this.props.username;
        const formItemLayout = {
            labelCol:{
                xs:24,
                sm:8
            },
            wrapperCol:{
                xs:24,
                sm:7
            }
        }
        const formItemButtonLayout = {
            wrapperCol:{
                xs:24,
                sm:{
                    span:7,
                    offset:8
                }
            }
        }
        return(
            <div>
                <Form layout="horizontal" style={{marginTop:30}}>
                        <FormItem label="用户名" {...formItemLayout}>
                            {
                                getFieldDecorator('username',{
                                    initialValue:username
                                })(
                                    <Input prefix={<Icon type="user"/>} disabled/>
                                )
                            }
                        </FormItem>
                        <FormItem label="旧密码" {...formItemLayout}>
                            {
                                getFieldDecorator('oldPassword',{
                                    rules:[
                                        {
                                            required:true,
                                            message:'旧密码不能为空'
                                        }
                                    ]
                                })(
                                    <Input.Password prefix={<Icon type="lock"/>} placeholder="请输入您的旧密码"/>
                                )
                            }
                        </FormItem>
                        <FormItem label="新密码" {...formItemLayout}>
                            {
                                getFieldDecorator('newPassword',{
                                    rules:[
                                        {
                                            required:true,
                                            message:'新密码不能为空'
                                        },
                                        {
                                            min:6,
                                            message:'新密码不能少于六位数'
                                        }
                                    ]
                                })(
                                    <Input.Password prefix={<Icon type="unlock"/>} placeholder="请输入您的新密码"/>
                                )
                            }
                        </FormItem>
                        <FormItem label="确认密码" {...formItemLayout}>
                            {
                                getFieldDecorator('confirmPassword', {
                                    rules:[
                                        {
                                            required:true,
                                            message:'确认密码不能为空'
                                        },
                                        {
                                            validator:(rules,value,callback)=>{
                                                this.handleConfirmPwd(rules,value,callback)
                                            }
                                        }
                                    ]
                                })(
                                    <Input.Password prefix={<Icon type="unlock"/>} placeholder="请确认您的新密码" autoComplete={false}/>
                                )
                            }
                        </FormItem>
                        <FormItem {...formItemButtonLayout}>
                            <Button type="primary" icon="edit" style={{width:'100%'}} htmlType="submit" onClick={this.handleModifyPassword}>确认修改</Button>
                        </FormItem>
                    </Form>
            </div>
        )
    }
}

PasswordForm = Form.create()(PasswordForm)


const mapStateToProps =(state) => {
    return {
        userInfo:state.userInfo
    }
}

export default connect(mapStateToProps)(Password)
