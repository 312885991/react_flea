import React from 'react';
import { Form, Select, Input, DatePicker, Row, Col, Card, message, Spin, Button, List, Avatar, Modal } from 'antd';
import moment from 'moment';
import axios from '../../../axios'
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
export default class GoodInfo extends React.Component {

    state = {
        spinning: false,
        item: {},
        discussList: []
    }

    componentWillMount() {
        const id = this.props.match.params.id;
        this.requestGoodInfo(id);
        this.requestCategory();
        this.requestDiscussList(id);
    }

    requestGoodInfo = (id) => {
        this.setState({
            spinning: true
        })
        axios.get({
            url: '/good/info',
            params: {
                id: id
            }
        }).then((res) => {
            // console.log(res)
            this.setState({
                item: res.data,
                spinning: false
            })
        }).catch(() => {
            message.error("加载数据失败")
            this.setState({
                spinning: false
            })
        })
    }

    requestCategory = () => {
        axios.get({
            url: '/category/list'
        }).then((res) => {
            this.setState({
                category: res.data
            })
        }).catch(() => {
            message.error("获取商品类别失败")
        })
    }

    requestDiscussList = (goodId) => {
        axios.get({
            url: '/discuss/list',
            params: {
                goodId: goodId
            }
        }).then((res) => {
            this.setState({
                discussList: res.data
            })
        }).catch(() => {
            message.error("获取评论列表失败")
        })
    }


    handleCancel = () => {
        this.props.history.push({ pathname: '/admin/good' })
    }

    handleUpdate = () => {
        this.goodInfoForm.props.form.validateFields((error, values) => {
            if (!error) {
                const item = this.state.item;
                // console.log(values)
                axios.put({
                    url: '/good/update',
                    data: {
                        id: item.id,
                        name: values.name,
                        currentPrice: values.currentPrice,
                        sort: values.sort,
                        description: values.description
                    }
                }).then(() => {
                    message.success("更新成功")
                    this.handleCancel();
                }).catch(() => {
                    message.error("更新失败")
                })
            }
        })
    }

    handleConfirmDelete = (id) => {
        Modal.confirm({
            title: '提示',
            content: '确认删除该评论么？',
            onOk: () => {
                this.handleDeleteDiscuss(id)
            }
        })
    }

    handleDeleteDiscuss = (id) => {
        axios.delete({
            url: '/discuss/delete',
            params: {
                id: id
            }
        }).then(() => {
            message.success("删除成功")
            const goodId = this.state.item.id;
            this.requestDiscussList(goodId)
        }).catch(() => {
            message.error("删除失败")
        })
    }

    render() {
        const { spinning, item, category, discussList } = this.state;
        return (
            <div>
                <Spin spinning={spinning}>
                    <Card title="商品详情">
                        <GoodInfoForm item={item} category={category} wrappedComponentRef={(inst) => this.goodInfoForm = inst} />
                    </Card>
                </Spin>
                <Card title="评论列表">
                    <List
                        itemLayout="horizontal"
                        dataSource={discussList}
                        renderItem={item => (
                            <List.Item
                                key={item.id}
                                actions={[<a key="delete" onClick={() => this.handleConfirmDelete(item.id)}>删除</a>]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatarUrl} />}
                                    title={item.nickName}
                                    description={item.comment}
                                />
                                {/* {item.comment} */}
                            </List.Item>
                        )}
                    />
                </Card>
                <Card style={{ position: 'fixed', bottom: 0, left: 215, right: 0 }}>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button style={{ marginRight: 10 }} icon="arrow-left" onClick={this.handleCancel}>返回</Button>
                            <Button type="primary" icon="edit" onClick={this.handleUpdate}>更新</Button>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

class GoodInfoForm extends React.Component {

    render() {
        const { getFieldDecorator } = this.props.form;
        const item = this.props.item;
        const category = this.props.category || [];
        const allOption = category.map((item) => {
            return <Option key={item.id} value={item.id}>{item.name}</Option>
        })
        return (
            <div >

                <Form layout="vertical">
                    <Row gutter={40}>
                        <Col span={4}>
                            <FormItem label="商品名称">
                                {
                                    getFieldDecorator('name', {
                                        initialValue: item.name,
                                        rules: [
                                            {
                                                required: true,
                                                message: '商品名称不能为空'
                                            }
                                        ]
                                    })(
                                        <Input placeholder="请输入商品名称" />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem label="商品类别">
                                {
                                    getFieldDecorator('sort', {
                                        initialValue: item.sort,
                                        rules: [
                                            {
                                                required: true
                                            }
                                        ]
                                    })(
                                        <Select>
                                            {allOption}
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem label="卖家昵称">
                                <Input value={item.nickName} disabled />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="OPENID">
                                <Input value={item.openId} disabled />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="发布日期">
                                <DatePicker
                                    value={moment(item.date)}
                                    disabled
                                    showTime
                                    format='YYYY-MM-DD HH:mm:ss'
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40}>

                        <Col span={4}>
                            <FormItem label="原价">
                                <Input prefix="￥" value={item.oldPrice} disabled />
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem label="现价">
                                {
                                    getFieldDecorator('currentPrice', {
                                        initialValue: item.currentPrice,
                                        rules: [
                                            {
                                                required: true,
                                                message: '商品价格不能为空'
                                            }
                                        ]
                                    })(
                                        <Input prefix="￥" placeholder="请输入商品现价" />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={3}>
                            <FormItem label="浏览数">
                                <Input value={item.browseNumber} disabled />
                            </FormItem>
                        </Col>
                        <Col span={3}>
                            <FormItem label="评论数">
                                <Input value={item.commentNumber} disabled />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="所属学校">
                                <Input value={item.school} disabled />
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem label="交易状态">
                                <Select value={item.trade} disabled>
                                    <Option value={0}>未交易</Option>
                                    <Option value={1}>已交易</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={30}>
                        <Col span={4}>
                            <FormItem label="审核状态">
                                <Select value={item.examine} disabled>
                                    <Option value={0}>待审核</Option>
                                    <Option value={1}>通过</Option>
                                    <Option value={2}>未通过</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem label="下架情况">
                                <Select value={item.status} disabled>
                                    <Option value={0}>未下架</Option>
                                    <Option value={1}>已下架</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem label="卖家手机号">
                                <Input value={item.phone} disabled />
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem label="卖家QQ">
                                <Input value={item.qq} disabled />
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem label="卖家微信">
                                <Input value={item.wechat} disabled />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label="商品描述">
                                {
                                    getFieldDecorator('description', {
                                        initialValue: item.description
                                    })(
                                        <TextArea autosize={{
                                            minRows: 2,
                                            maxRows: 5
                                        }} />
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
GoodInfoForm = Form.create()(GoodInfoForm)