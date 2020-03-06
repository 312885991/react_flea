import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import AdminMenu from '../../AdminMenu'
import { connect } from 'react-redux';
import { changeMenu } from '../../../redux/action'
import './index.less'
const { SubMenu } = Menu;
const MenuItem = Menu.Item;

class NavLeft extends React.Component{

    state = {}

    componentWillMount(){
        const menu = this.renderMenu(AdminMenu);
        const menuPath = window.location.href;
        this.setState({
            menu,
            menuPath
        })
    }

    handleSelect = ({ item, key }) => {
        const { dispatch } = this.props;
        const title = item.props.title;
        dispatch(changeMenu(title))
        this.setState({
            menuPath:key
        })
    }

    renderMenu = (data) => {
        return data.map((item)=>{
            if(item.children){
                return (
                    <SubMenu title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.name}</span>
                        </span>
                    } 
                        key={item.path}
                    >
                        { this.renderMenu(item.children) }
                    </SubMenu>
                )
            }
            return (
                <MenuItem title={item.name} key={item.path}>
                    <Link to={item.path}>
                        {item.icon?<Icon type={item.icon}/>:''}{item.name}
                    </Link>
                </MenuItem>
            )
        })
    }

    render(){
        return(
            <div>
                <div className="logo">
                    <img src="/assets/logo.svg" />
                    <h1>校园闲置平台</h1>
                </div>
                <Menu
                    theme="dark"
                    selectedKeys={this.state.menuPath}
                    onSelect={this.handleSelect}
                >
                    { this.state.menu } 
                </Menu>
            </div>
        )
    }
}

export default connect()(NavLeft);