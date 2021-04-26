import React from 'react';
import { Card, Icon, Button, Spin, message, Modal, Form, Input } from 'antd';
import axios from '../../axios'
const { Meta } = Card;
const FormItem = Form.Item;
const { TextArea } = Input
export default class Announce extends React.Component {

    state = {
        spinning: false,
        isVisible: false,
        announceList: []
    }

    componentWillMount() {
        this.requestAnnounceList();
    }

    requestAnnounceList = () => {
        this.setState({
            spinning: true
        })
        axios.get({
            url: '/announce/list'
        }).then((res) => {
            this.setState({
                announceList: res.data,
                spinning: false
            })
        }).catch(() => {
            message.error("数据加载失败")
            this.setState({
                spinning: false
            })
        })
    }

    handleDelete = (item) => {
        Modal.confirm({
            title: '提示',
            content: '确认删除该公告么？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                this.deleteAnnounce(item.id)
            }
        })
    }

    deleteAnnounce = (id) => {
        axios.delete({
            url: '/announce/delete/' + id
        }).then((res) => {
            // console.log(res)
            message.success("删除成功")
            this.requestAnnounceList()
        }).catch(() => {
            message.error("删除失败")
        })
    }

    handleAdd = () => {
        this.setState({
            type: 'add',
            title: '新增公告',
            isVisible: true
        })
    }

    handleEdit = (item) => {
        this.setState({
            item,
            type: 'edit',
            title: '编辑公告',
            isVisible: true
        })
    }

    handleSubmit = () => {
        this.announceForm.props.form.validateFields((error, values) => {
            if (!error) {
                const type = this.state.type;
                if (type == 'edit') {
                    const item = this.state.item;
                    axios.put({
                        url: '/announce/modify',
                        data: {
                            id: item.id,
                            title: values.title,
                            text: values.text,
                            publisher: values.publisher
                        }
                    }).then(() => {
                        message.success("更新成功")
                        this.setState({
                            isVisible: false
                        })
                        this.requestAnnounceList();
                    }).catch(() => {
                        message.error("更新失败")
                        this.setState({
                            isVisible: false
                        })
                    })
                } else {
                    axios.post({
                        url: '/announce/save',
                        data: {
                            title: values.title,
                            text: values.text,
                            publisher: values.publisher
                        }
                    }).then(() => {
                        message.success("新增成功")
                        this.setState({
                            isVisible: false
                        })
                        this.requestAnnounceList();
                    }).catch(() => {
                        message.error("新增失败")
                        this.setState({
                            isVisible: false
                        })
                    })
                }
                this.announceForm.props.form.resetFields();
            }
        })
    }


    render() {
        const { spinning, announceList, isVisible, title, type, item } = this.state;
        const announces = announceList.map((item) => {
            return <Card
                key={item.id}
                title={item.title}
                headStyle={{ textAlign: 'center' }}
                style={{ marginBottom: 10 }}
                actions={[
                    <Icon type="edit" onClick={() => this.handleEdit(item)} />,
                    <Icon type="delete" onClick={() => this.handleDelete(item)} />,
                    <span style={{ color: '#999' }}>发布人：{item.publisher}</span>,
                    <span style={{ color: '#999' }}>发布时间：{item.date}</span>
                ]}
            >
                <Meta
                    style={{ textIndent: '2em', letterSpacing: 1, lineHeight: 2 }}
                    description={item.text}
                />
            </Card>
        })
        return (
            <div>

                <Spin spinning={spinning}>
                    <div style={{ minHeight: '60vh' }}>
                        <Button icon="plus" type="primary" style={{ marginBottom: 10 }} onClick={this.handleAdd}>新增公告</Button>
                        {announces}
                    </div>
                </Spin>
                <Modal
                    visible={isVisible}
                    title={title}
                    okText="确定"
                    cancelText="取消"
                    onCancel={() => {
                        this.announceForm.props.form.resetFields();
                        this.setState({
                            isVisible: false
                        })
                    }}
                    onOk={this.handleSubmit}
                >
                    {<AnnounceForm wrappedComponentRef={(inst) => this.announceForm = inst} type={type} item={item} />}
                </Modal>
            </div>
        )
    }
}

class AnnounceForm extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        const { type, item } = this.props;
        const TextAreaSize = {
            minRows: 4,
            maxRows: 8
        }
        return (
            <div>
                <Form layout="vertical">
                    <FormItem label="标题">
                        {
                            getFieldDecorator('title', {
                                initialValue: type == 'edit' ? item.title : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '公告标题不能为空'
                                    }
                                ]
                            })(
                                <Input placeholder="请输入公告标题" />
                            )
                        }
                    </FormItem>
                    <FormItem label="发布人">
                        {
                            getFieldDecorator('publisher', {
                                initialValue: type == 'edit' ? item.publisher : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '发布人不能为空'
                                    }
                                ]
                            })(
                                <Input placeholder="请输入发布人的姓名" />
                            )
                        }
                    </FormItem>
                    <FormItem label="公告内容">
                        {
                            getFieldDecorator('text', {
                                initialValue: type == 'edit' ? item.text : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '公告内容不能为空'
                                    }
                                ]
                            })(
                                <TextArea autosize={TextAreaSize} placeholder="请输入公告内容..." />
                            )
                        }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

AnnounceForm = Form.create()(AnnounceForm);