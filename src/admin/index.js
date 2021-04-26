import React from 'react';
import { Layout, Breadcrumb, Modal } from 'antd';
import NavLeft from './components/NavLeft'
import MineHeader from './components/Header'
import MineFooter from './components/Footer'
import './index.less'
import { connect } from 'react-redux';
import WebSocket from 'react-websocket';
import { withRouter } from 'react-router-dom'
const { Header, Sider, Content, Footer } = Layout;

class Admin extends React.Component {

    constructor(props) {
        super(props)
        const userInfo = this.props.userInfo;
        if (JSON.stringify(userInfo) === '{}') {
            window.location.href = '/user/login'
        }
    }

    startNotice = () => {
        const notice = document.getElementById("notice");
        notice.play();
    }

    stopNotice = () => {
        const notice = document.getElementById("notice");
        notice.pause();
    }

    handleGoodInfo = (goodId) => {
        this.stopNotice();
        // console.log(this.props.history)
        this.props.history.push({ pathname: '/admin/good/goodInfo/' + goodId });
    }

    handleOpen = () => {
        console.log("连接成功")
    }

    handleOnMessage = (message) => {
        this.startNotice();
        // console.log(message)
        const goodId = message.substring(message.lastIndexOf(":") + 1);
        // console.log(goodId);
        Modal.confirm({
            title: '新增商品提示',
            content: '您有新的商品需要审核，请注意查看！',
            okText: '查看详情',
            cancelText: '关闭',
            onOk: () => { this.handleGoodInfo(goodId) },
            onCancel: () => {
                this.stopNotice();
            }
        })
    }

    handleClose = () => {
        console.log("连接断开")
    }

    render() {
        return (
            <div className="admin-container">
                <Layout>
                    <Sider
                        // breakpoint="md"
                        // collapsedWidth="0" 
                        width={215}
                        className="nav-left"
                    >
                        <NavLeft />
                    </Sider>
                    <Layout className="main">
                        <Header style={{ padding: 0 }}>
                            <MineHeader />
                        </Header>
                        <Content className="content">
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>校园闲置平台</Breadcrumb.Item>
                                <Breadcrumb.Item>{this.props.menuName || '首页'}</Breadcrumb.Item>
                            </Breadcrumb>
                            {this.props.children}
                        </Content>
                        <Footer>
                            <MineFooter />
                        </Footer>
                    </Layout>
                </Layout>
                <WebSocket url="wss:quicklyweb.cn/webSocket" onMessage={this.handleOnMessage} onOpen={this.handleOpen} onClose={this.handleClose} />
                {/* <WebSocket url="ws:localhost:8090/webSocket" onMessage={this.handleOnMessage} onOpen={this.handleOpen} onClose={this.handleClose} /> */}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        menuName: state.menuName,
        userInfo: state.userInfo
    }
}

export default withRouter(connect(mapStateToProps)(Admin))