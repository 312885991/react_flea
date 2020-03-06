import React from 'react';
import './index.less'
import { connect } from 'react-redux';
import { logout } from '../../../redux/action'
import { Icon, Dropdown, Menu, Modal } from 'antd';

class Header extends React.Component {

    hanldeLogout = () => {
        const { dispatch } = this.props;
        Modal.confirm({
            title:'提示',
            content:'确认要退出么？',
            okText:'确认',
            cancelText:'返回',
            onOk:()=>{
                dispatch(logout());
                window.location.href='/user/login'
            }
        })
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <span onClick={this.hanldeLogout}>
                        <Icon type="logout" />退出
                    </span>
                </Menu.Item>
            </Menu>
        )
        return (
            <div className="header">
                <Icon type="bell" />
                <Dropdown overlay={menu} trigger={['click', 'hover']}>
                    <a onClick={e=> e.preventDefault()}>
                        {this.props.userInfo.name||'别回头丶'} <Icon type="down" />
                    </a>
                </Dropdown>,
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo:state.userInfo
    }
}

export default connect(mapStateToProps)(Header)