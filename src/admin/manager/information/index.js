import React from 'react';
import { Form, Input, Spin, Card, message, Descriptions, Button, Drawer, Icon } from 'antd';
import axios from '../../../axios'
const FormItem = Form.Item;
export default class InforMation extends React.Component {


    state = {
        spinning: false,
        isVisible: false,
        item: {}
    }

    componentWillMount() {
        this.requestManagerInfo();
    }

    requestManagerInfo = () => {
        this.setState({
            spinning: true
        })
        axios.get({
            url: 'contact/get'
        }).then((res) => {
            this.setState({
                item: res.data,
                spinning: false
            })
        }).catch(() => {
            message.error("获取数据失败")
            this.setState({
                spinning: false
            })
        })
    }

    handleEdit = () => {
        const item = this.state.item;
        if (item) {
            this.setState({
                isVisible: true
            })
        }
    }

    modifyManager = (values) => {
        const item = this.state.item;
        axios.put({
            url: '/contact/update',
            data: {
                id: 1,
                identity: values.identity,
                nickName: values.nickName,
                phone: values.phone,
                qq: values.qq,
                wechat: values.wechat
            }
        }).then(() => {
            message.success("更新成功")
            this.requestManagerInfo();
        }).catch(() => {
            message.error("更新失败")
        })
        this.setState({
            isVisible: false
        })
    }

    handleSubmit = () => {
        this.informationForm.props.form.validateFields((error, values) => {
            if (!error) {
                this.modifyManager(values);
            }
        })
    }

    handleClose = () => {
        this.informationForm.props.form.resetFields();
        this.setState({
            isVisible: false
        })
    }

    render() {
        const { spinning, item, isVisible } = this.state;
        return (
            <div>
                <Spin spinning={spinning}>
                    <Card
                        title="小程序管理员信息"
                        headStyle={{ textAlign: 'center' }}
                        extra={
                            <Button type="primary" icon="edit" onClick={this.handleEdit}>编辑</Button>
                        }
                    >
                        <Descriptions
                            bordered
                            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                        >
                            <Descriptions.Item label="昵称">{item.nickName || ''}</Descriptions.Item>
                            <Descriptions.Item label="身份">{item.identity || ''}</Descriptions.Item>
                            <Descriptions.Item label="手机号">{item.phone || ''}</Descriptions.Item>
                            <Descriptions.Item label="QQ号">{item.qq || ''}</Descriptions.Item>
                            <Descriptions.Item label="微信号">{item.wechat || ''}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Spin>
                <Drawer
                    title="编辑管理员信息"
                    width={640}
                    onClose={this.handleClose}
                    visible={isVisible}
                    //   bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{ textAlign: 'right' }}
                        >
                            <Button
                                onClick={this.handleClose}
                                style={{ marginRight: 10 }}
                            >
                                取消
              </Button>
                            <Button type="primary" onClick={this.handleSubmit}>
                                确定
              </Button>
                        </div>
                    }
                >
                    <InforMationForm item={item} wrappedComponentRef={(inst) => this.informationForm = inst} />
                    <Button
                        onClick={this.handleClose}
                        style={{ marginRight: 10 }}
                        icon="close"
                    >
                        取消
              </Button>
                    <Button type="primary" icon="edit" onClick={this.handleSubmit}>
                        确定
            </Button>
                </Drawer>
            </div>
        )
    }
}

class InforMationForm extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        const { item } = this.props;
        return (
            <div>
                <Form layout="vertical">
                    <FormItem label="昵称">
                        {
                            getFieldDecorator('nickName', {
                                initialValue: item.nickName,
                                rules: [
                                    {
                                        required: true,
                                        message: '昵称不能为空'
                                    }
                                ]
                            })(
                                <Input prefix={<Icon type="user-add" />} placeholder="请输入管理员昵称" />
                            )
                        }
                    </FormItem>
                    <FormItem label="身份">
                        {
                            getFieldDecorator('identity', {
                                initialValue: item.identity,
                                rules: [
                                    {
                                        required: true,
                                        message: '身份不能为空'
                                    }
                                ]
                            })(
                                <Input prefix={<Icon type="idcard" />} placeholder="请输入管理员身份" />
                            )
                        }
                    </FormItem>
                    <FormItem label="手机号">
                        {
                            getFieldDecorator('phone', {
                                initialValue: item.phone,
                                rules: [
                                    {
                                        required: true,
                                        message: '手机号不能为空'
                                    },
                                    {
                                        pattern: new RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/, 'g'),
                                        message: '请输入正确的手机号'
                                    }
                                ]
                            })(
                                <Input prefix={<Icon type="phone" />} placeholder="请输入您的手机号" />
                            )
                        }
                    </FormItem>
                    <FormItem label="微信">
                        {
                            getFieldDecorator('wechat', {
                                initialValue: item.wechat,
                                rules: [
                                    {
                                        required: true,
                                        message: '微信不能为空'
                                    }
                                ]
                            })(
                                <Input prefix={<Icon type="wechat" />} placeholder="请输入您的微信" />
                            )
                        }
                    </FormItem>
                    <FormItem label="QQ">
                        {
                            getFieldDecorator('qq', {
                                initialValue: item.qq,
                                rules: [
                                    {
                                        required: true,
                                        message: 'QQ号不能为空'
                                    }
                                ]
                            })(
                                <Input prefix={<Icon type="qq" />} placeholder="请输入您的QQ" />
                            )
                        }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

InforMationForm = Form.create()(InforMationForm)