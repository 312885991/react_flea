import React from 'react'
import { Result, Button } from 'antd'

export default class NotFound extends React.Component{

    handleClick = () =>{
        window.location.href = '/basic/home';
    }

    render(){
        return(
            <Result
                status="404"
                title="404"
                subTitle="对不起，该页面不存在或已被删除！"
                extra={<Button type="primary" onClick={this.handleClick}>返回首页</Button>}
            />
        )
    }
}