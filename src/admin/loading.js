import React from 'react';
import { Spin } from 'antd';

export default class Loading extends React.Component{
    render(){
        return(
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'60vh'}}>
                <Spin size="large"/>
            </div>
        )
    }
}