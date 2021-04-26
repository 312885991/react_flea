import React from 'react';
import { Card, Form, Modal, message, Table, Spin, Avatar, Empty } from 'antd';
import Utils from '../../utils/utils'
import axios from '../../axios'
import './index.less'

export default class Discuss extends React.Component {

    state = {
        spinning: false,
        isVisible: false,
        dataSource: []
    }

    page = 0;
    pageSize = 5;


    componentWillMount() {
        this.requesDiscussPage(this.page, this.pageSize);
    }

    requesDiscussPage = (page, pageSize) => {
        let that = this;
        this.setState({
            spinning: true
        })
        axios.get({
            url: '/discuss/page',
            params: {
                page: page,
                pageSize: pageSize
            }
        }).then((res) => {
            this.setState({
                dataSource: res.data.list,
                spinning: false,
                pagination: Utils.pagination(res.data, (current) => {
                    that.page = current - 1;
                    that.requesDiscussPage(that.page, that.pageSize);
                }, (current, pageSize) => {
                    that.page = current - 1;
                    that.pageSize = pageSize;
                    that.requesDiscussPage(that.page, that.pageSize);
                })
            })
        }).catch(() => {
            message.error("获取评论列表失败")
            this.setState({
                spinning: false
            })
        })
    }

    handleConfirmDelete = (id) => {
        Modal.confirm({
            title: '提示',
            content: '确认删除该评论么？',
            onOk: () => {
                this.handleDelete(id);
            }
        })
    }

    handleDelete = (id) => {
        axios.delete({
            url: '/discuss/delete',
            params: {
                id: id
            }
        }).then(() => {
            message.success("删除评论成功")
            this.requesDiscussPage(this.page, this.pageSize);
        }).catch(() => {
            message.error("删除评论失败")
        })
    }

    handlePreview = (imageUrl) => {
        this.setState({
            isVisible: true,
            imageUrl
        })
    }

    render() {
        const { spinning, dataSource, pagination, isVisible, imageUrl } = this.state;
        const columns = [
            {
                title: '头像',
                dataIndex: 'avatarUrl',
                key: 'avatarUrl',
                align: 'center',
                render: (avatarUrl) => {
                    return <Avatar size="large" src={avatarUrl} />
                }
            },
            {
                title: '昵称',
                dataIndex: 'nickName',
                key: 'nickName',
                align: 'center'
            },
            {
                title: '评论图片',
                dataIndex: 'imageUrl',
                key: 'imageUrl',
                align: 'center',
                render: (imageUrl) => {
                    if (imageUrl) {
                        return <div className="imgWrapper" title="预览图片" onClick={() => this.handlePreview(imageUrl)}>
                            <img src={imageUrl} style={{ width: 150, height: 60 }} />
                        </div>
                    }
                    return '暂无图片'
                }
            },
            {
                title: '评论内容',
                dataIndex: 'comment',
                key: 'comment',
                align: 'center'
            },
            {
                title: '发表日期',
                dataIndex: 'date',
                key: 'date',
                align: 'center'
            },
            {
                title: '操作区',
                key: 'action',
                align: 'center',
                render: (item) => {
                    return <a onClick={() => this.handleConfirmDelete(item.id)}>删除</a>
                }
            }
        ]
        return (
            <div>
                <Spin spinning={spinning}>
                    <Card title="评论列表">
                        <Table
                            bordered
                            dataSource={dataSource}
                            columns={columns}
                            pagination={pagination}
                        />
                    </Card>
                </Spin>
                <Modal
                    title="图片预览"
                    footer={null}
                    visible={isVisible}
                    width={600}
                    height={400}
                    onCancel={() => {
                        this.setState({
                            isVisible: false
                        })
                    }}
                >
                    <img src={imageUrl} style={{ width: '100%', height: 400 }} />
                </Modal>
            </div>
        )
    }
}