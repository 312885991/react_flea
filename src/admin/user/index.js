import React from 'react'
import { Card, Button, Form, Select, Input, Table, Avatar, Spin, Row, Col, Icon, DatePicker, Drawer, message } from 'antd';
import axios from '../../axios'
import Utils from '../../utils/utils'
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;
const Option = Select.Option;

export default class User extends React.Component{


    state = {
        spinning:false,
        isVisible:false,
        dataSource:[]
    }

    page = 0;
    pageSize = 5;

    componentDidMount(){
        this.requestUserPage(this.page, this.pageSize, {});
    }

    requestUserPage = (page, pageSize, values) => {
        console.log(values)
        let that = this;
        this.setState({
            spinning:true
        })
        axios.get({
            url:'/user/page',
            params:{
                page:page,
                pageSize:pageSize,
                ...values
            }
        }).then((res)=>{
            this.setState({
                dataSource: res.data.list,
                spinning:false,
                pagination:Utils.pagination(res.data, (current)=>{
                    that.page = current - 1;
                    const values = this.state.values || {}
                    that.requestUserPage(that.page, that.pageSize, values);
                },(current, pageSize)=>{
                    that.page = current - 1;
                    that.pageSize = pageSize;
                    const values = this.state.values || {}
                    that.requestUserPage(that.page, that.pageSize, values);
                })
            })
        }).catch(()=>{
            this.setState({
                spinning:false
            })
        })
    }

    handleQuery = (values) => {
        // console.log(values);
        this.page = 0;
        this.pageSize = 5;
        this.setState({
            values
        })
        this.requestUserPage(this.page, this.pageSize, values)
    }

    handleEdit = () => {
        const item = this.state.item;
        if(!item){
            message.error("请先选择一条记录")
            return;
        }
        this.setState({
            isVisible:true
        })
    }

    handleClose = () => {
        this.userForm.props.form.resetFields();
        this.setState({
            isVisible:false
        })
    }

    handleSubmit = () => {
        this.userForm.props.form.validateFields((error, values)=>{
            if(!error){
                const item = this.state.item;
                this.updateUser(item.openId, values);
            }
        })
    }

    updateUser = (openId, values) => {
        axios.put({
            url:'/user/update',
            data:{
                openId:openId,
                ...values
            }
        }).then(()=>{
            message.success("更新成功")
            this.handleClose();
            this.requestUserPage(this.page, this.pageSize, this.state.values|| {})
        }).catch(()=>{
            message.error("更新失败")
        })
    }

    handleRowChange = (record, index) => {
        this.setState({
            item:record,
            selectedRowKeys:[index]
        })
    }

    render(){
        const { spinning, dataSource, pagination, isVisible, item, selectedRowKeys } = this.state;
        const columns = [
            {
                title:'姓名',
                dataIndex:'name',
                key:'name',
                align:'center'
            },
            {
                title:'性别',
                dataIndex:'sex',
                key:'sex',
                align:'center',
                render:(sex)=>{
                    return sex ==1?'男':'女'
                }
            },
            // {
            //     title:'昵称',
            //     dataIndex:'nickName',
            //     key:'nickName',
            //     align:'center'
            // },
            {
                title:'头像',
                dataIndex:'avatarUrl',
                key:'avatarUrl',
                align:'center',
                render:(avatarUrl)=>{
                    return <Avatar src={avatarUrl} />
                }
            },
            {
                title:'学校',
                dataIndex:'school',
                key:'school',
                align:'center'
            },
            {
                title:'微信',
                dataIndex:'wechat',
                key:'wechat',
                align:'center'
            },
            {
                title:'QQ',
                dataIndex:'qq',
                key:'qq',
                align:'center'
            },
            {
                title:'手机号',
                dataIndex:'phone',
                key:'phone',
                align:'center'
            },
            {
                title:'地址',
                dataIndex:'address',
                key:'address',
                align:'center'
            },
            {
                title:'注册日期',
                dataIndex:'date',
                key:'date',
                align:'center',
                render:(date)=>{
                    return moment(date).format('YYYY-MM-DD');
                }
            }
        ]
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange:(selectedRowKeys, selectedRows)=>{
                this.setState({
                    selectedRowKeys,
                    item:selectedRows
                })
            }
        }
        return(
            <div>
                <Card>
                    <FilterForm handleEdit={this.handleEdit} handleQuery={this.handleQuery}/>
                </Card>
                <Spin spinning={spinning}>
                    <Card
                     title="用户列表"
                     >
                        <Table 
                            bordered
                            dataSource={dataSource}
                            columns={columns}
                            rowSelection={rowSelection}
                            onRow={(record, index)=>{
                                return{
                                    onClick:()=>{
                                        this.handleRowChange(record, index)
                                    }
                                }
                            }}
                            pagination={pagination}
                        />
                    </Card>
                    
                </Spin>
                <Drawer
          title="编辑用户"
          width={680}
          onClose={this.handleClose}
          visible={isVisible}
        >
                <UserForm item={item} wrappedComponentRef={(inst) => this.userForm = inst}/>
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

class FilterForm extends React.Component{

    handleEdit = () => {
        this.props.handleEdit();
    }

    handleQuery = () => {
        this.props.form.validateFields((error, values)=>{
            if(!error){
                this.props.handleQuery(values)
            }
        })
    }

    handleReset = () => {
        this.props.form.resetFields();
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <Form layout="inline">
                    <FormItem label="姓名">
                        {
                            getFieldDecorator('name')(
                                <Input placeholder="请输入要查找的姓名"/>
                            )
                        }
                    </FormItem>
                    <FormItem label="性别">
                        {
                            getFieldDecorator('sex',{
                                initialValue:null
                            })(
                                <Select style={{width:80}}>
                                    <Option value={null}>全部</Option>
                                    <Option value={1}>男</Option>
                                    <Option value={2}>女</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="手机号">
                        {
                            getFieldDecorator('phone')(
                                <Input placeholder="请输入要查找的手机号"/>
                            )
                        }
                    </FormItem>
                    <FormItem label="学校">
                        {
                            getFieldDecorator('school')(
                                <Input placeholder="请输入要查找的学校"/>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" icon="search" onClick={this.handleQuery}>查询</Button>
                    </FormItem>
                    <FormItem>
                        <Button onClick={this.handleReset}>重置</Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" icon="edit" onClick={this.handleEdit}>编辑用户</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

FilterForm = Form.create()(FilterForm)


class UserForm extends React.Component{
    render(){
        const { getFieldDecorator } = this.props.form;
        const item = this.props.item;
        return(
            <div>
                <Form layout="vertical">
                    <Row gutter={40}>
                        <Col span={8}>
                            <FormItem label="姓名">
                                {
                                    getFieldDecorator('name',{
                                        initialValue:item.name,
                                        rules:[
                                            {
                                                required:true,
                                                message:'姓名不能为空'
                                            }
                                        ]
                                    })(
                                        <Input prefix={<Icon type="idcard" />} placeholder="请输入用户姓名"/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="性别">
                                <Select value={item.sex} disabled>
                                    <Option value={1}>男</Option>
                                    <Option value={2}>女</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="注册日期">
                                <DatePicker 
                                    value={moment(item.date)}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    disabled
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40}>
                         <Col span={3}>
                            <FormItem label="头像">
                                <Avatar src={item.avatarUrl} size="large"/>
                            </FormItem>
                        </Col>
                    <Col span={8}>
                            <FormItem label="昵称">
                                <Input prefix={<Icon type="user" />} value={item.nickName} disabled/>
                            </FormItem>
                        </Col>
                    <Col span={10}>
                            <FormItem label="学校">
                                {
                                    getFieldDecorator('school',{
                                        initialValue:item.school,
                                        rules:[
                                            {
                                                required:true,
                                                message:'学校不能为空'
                                            }
                                        ]
                                    })(
                                        <Input prefix={<Icon type="bank" />} placeholder="请输入学校"/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={30}>
                    <Col span={8}>
                            <FormItem label="微信">
                                {
                                    getFieldDecorator('wechat',{
                                        initialValue:item.wechat,
                                        rules:[
                                            {
                                                required:true,
                                                message:'微信不能为空'
                                            }
                                        ]
                                    })(
                                        <Input prefix={<Icon type="wechat" />} placeholder="请输入用户微信"/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="QQ">
                                {
                                    getFieldDecorator('qq',{
                                        initialValue:item.qq,
                                        rules:[
                                            {
                                                required:true,
                                                message:'QQ不能为空'
                                            }
                                        ]
                                    })(
                                        <Input prefix={<Icon type="qq" />} placeholder="请输入用户QQ"/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="手机号">
                                {
                                    getFieldDecorator('phone',{
                                        initialValue:item.phone,
                                        rules:[
                                            {
                                                required:true,
                                                message:'手机号不能为空'
                                            },
                                            {
                                                max:11,
                                                message:'手机号不能超过11位'
                                            }
                                        ]
                                    })(
                                        <Input prefix={<Icon type="phone" />} placeholder="请输入手机号"/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                    <Col span={24}>
                            <FormItem label="联系地址">
                                {
                                    getFieldDecorator('address',{
                                        initialValue:item.address
                                    })(
                                        <TextArea autosize={{minRows:2,maxRows:4}} prefix={<Icon type="home" />} placeholder="请输入用户地址"/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

UserForm = Form.create()(UserForm)