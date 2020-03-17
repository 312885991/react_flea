import React from 'react';
import { Table, Card, Button, Spin, message, Modal, Switch, Form, Input, Icon } from 'antd';
import axios from '../../../axios'
const FormItem = Form.Item;
export default class Account extends React.Component {


    state = {
        spinning: false,
        isVisible: false,
        dataSource: []
    }

    componentWillMount() {
        this.requestAccountList();
    }

    requestAccountList = () => {
        this.setState({
            spinning: true
        })
        axios.get({
            url: '/account/list'
        }).then((res) => {
            this.setState({
                dataSource: res.data,
                spinning: false
            })
        }).catch(() => {
            message.error("获取数据失败")
        })
    }

    handleConfirmDelete = (item) => {
        Modal.confirm({
            title: '提示',
            content: '确定删除该账号么？',
            onOk: () => {
                this.handleDelete(item.id)
            }

        })
    }

    handleDelete = (id) => {
        axios.delete({
            url: '/account/delete',
            params: {
                id: id
            }
        }).then(() => {
            message.success("删除成功")
            this.requestAccountList();
        }).catch(() => {
            message.error("删除失败")
        })
    }

    handleModifyStatus = (item) => {
        const id = item.id;
        const status = item.status == 1 ? 0 : 1;
        this.updateAccountStatus(id, status);
    }

    updateAccountStatus = (id, status) => {
        this.setState({
            loading: true
        })
        axios.put({
            url: '/account/updateStatus',
            data: {
                id: id,
                status: status
            }
        }).then(() => {
            message.success("状态更新成功")
            this.requestAccountList();
        }).catch(() => {
            message.error("状态更新失败")
            this.requestAccountList();
        })

    }

    handleAddAccount = () => {
        this.setState({
            isVisible: true
        })
    }

    handleSubmit = () => {
        this.accountForm.props.form.validateFields((error, values) => {
            if (!error) {
                axios.post({
                    url: '/account/save',
                    data: values
                }).then(() => {
                    message.success("新增账号成功")
                    this.setState({
                        isVisible: false
                    })
                    this.accountForm.props.form.resetFields();
                    this.requestAccountList();
                }).catch(() => {
                    message.error("新增账号失败")
                    this.setState({
                        isVisible: false
                    })
                    this.accountForm.props.form.resetFields();
                })
            }
        })
    }

    render() {
        const { dataSource, spinning, isVisible } = this.state;
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                align: 'center'
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
                align: 'center'
            },
            {
                title: '真实姓名',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: 'QQ邮箱',
                dataIndex: 'email',
                key: 'email',
                align: 'center'
            },
            {
                title: '账号状态',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (status, item) => {
                    return <Switch defaultChecked={status == 0 ? true : false} checkedChildren="启用" unCheckedChildren="禁用" onClick={() => this.handleModifyStatus(item)} />
                }
            },
            {
                title: '操作区',
                key: 'action',
                align: 'center',
                render: (item) => {
                    return <a onClick={() => this.handleConfirmDelete(item)}>删除</a>
                }
            }
        ]
        return (
            <div>
                <Spin spinning={spinning}>

                    <Card
                        title="账号列表"
                        headStyle={{ textAlign: 'center' }}
                        extra={
                            <Button type="primary" icon="plus" onClick={this.handleAddAccount}>新增账号</Button>
                        }
                    >
                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            bordered
                            pagination={false}
                        />
                    </Card>
                </Spin>
                <Modal
                    title="新增账号"
                    visible={isVisible}
                    onOk={this.handleSubmit}
                    onCancel={() => {
                        this.accountForm.props.form.resetFields();
                        this.setState({
                            isVisible: false
                        })
                    }}
                >
                    <AccountForm wrappedComponentRef={(inst) => this.accountForm = inst} />
                </Modal>
            </div>
        )
    }
}

class AccountForm extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form layout="vertical">
                    <FormItem label="姓名">
                        {
                            getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '姓名不能为空'
                                    }
                                ]
                            })(
                                <Input prefix={<Icon type="idcard" />} placeholder="请填写真实姓名，一经填写不能修改" autoComplete={false} />
                            )
                        }
                    </FormItem>
                    <FormItem label="QQ邮箱">
                        {
                            getFieldDecorator('email', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'QQ邮箱不能为空'
                                    },
                                    {
                                        pattern: new RegExp(/^[1-9]\d{7,10}@qq\.com$/, 'g'),
                                        message: '请填写正确的QQ邮箱'
                                    }
                                ]
                            })(
                                <Input prefix={<Icon type="mail"/>} placeholder="请输入QQ邮箱（请正确填写，否则影响邮件的发送）" />
                            )
                        }
                    </FormItem>
                    <FormItem label="用户名">
                        {
                            getFieldDecorator('username', {
                                rules: [
                                    {
                                        required: true,
                                        message: '用户名不能为空'
                                    },
                                    {
                                        pattern: new RegExp(/^[^\u4e00-\u9fa5]{0,}$/, 'g'),
                                        message: '用户名不能包含中文'
                                    }
                                ]
                            })(
                                <Input prefix={<Icon type="user" />} placeholder="请输入用户名，不包含中文" autoComplete={false} />
                            )
                        }
                    </FormItem>
                    <FormItem label="密码">
                        {
                            getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: '密码不能为空'
                                    },
                                    {
                                        min: 6,
                                        message: '密码不能少于六位数'
                                    }
                                ]
                            })(
                                <Input.Password prefix={<Icon type="lock" />} placeholder="请输入密码，不少于6位数且不为纯数字" autoComplete={false} />
                            )
                        }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

AccountForm = Form.create()(AccountForm)