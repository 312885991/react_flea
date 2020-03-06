import React from 'react';
import { Card, Form, Input, Select, Button, Table, Spin, message, Modal, Tag, Badge } from 'antd';
import axios from '../../axios'
import Utils from '../../utils/utils'
import './index.less'
const FormItem = Form.Item;
const Option = Select.Option
class Good extends React.Component{

    state = {
        spinning: false,
        isShowPreview: false,
        isShowExamine:false,
        dataSource:[]
    }

    componentWillMount(){
        this.requestGoodPage(this.page, this.pageSize, {});
        this.requestCategory();
    }

    page = 0
    pageSize = 5

    requestGoodPage = (page, pageSize, values) => {
        let that = this;
        this.setState({
            spinning:true
        })
        console.log(page)
        axios.post({
            url:'/good/page?page='+page+'&pageSize='+pageSize,
            data:values
        }).then((res)=>{
            // console.log(res)
            this.setState({
                dataSource: res.data.list,
                pagination:Utils.pagination(res.data, (current)=>{
                    // console.log(current)
                    that.page = current -1;
                    const values = that.state.values || {};
                    that.requestGoodPage(that.page, that.pageSize, values);
                },(current, pageSize)=>{
                    that.page = current -1;
                    that.pageSize = pageSize;
                    const values = that.state.values || {};
                    that.requestGoodPage(that.page, that.pageSize, values);
                }),
                spinning:false
            })
        }).catch(()=>{
            message.error("数据加载失败")
            this.setState({
                spinning:false
            })
        })
    }

    requestCategory = () => {
        axios.get({
            url:'/category/list'
        }).then((res)=>{
            this.setState({
                category: res.data
            })
        }).catch(()=>{
            message.error("获取商品类别失败")
        })
    }

    handlePreview = (imageUrl) => {
        this.setState({
            imageUrl,
            isShowPreview:true
        })
    }

    handleInfo = (item) => {
        // console.log(item)
        this.props.history.push({pathname:'/admin/good/goodInfo/'+item.id})
    }

    handleOpenExamine = (item) => {
        // console.log(item)
        this.setState({
            item,
            isShowExamine:true
        })
    }

    handleExamine = () => {
        // console.log(this.state.item);
        this.props.form.validateFields((error, values)=>{
            // console.log(values)
            if(!error){
                const item = this.state.item;
                this.updateGoodStatus({
                    id:item.id,
                    examine:values.examine
                })
                this.setState({
                    isShowExamine:false
                })
            }
        })
    }

    updateGoodStatus = (values) => {
        axios.put({
            url:'/good/updateGoodStatus',
            data:values
        }).then((res)=>{
            message.success("更新成功")
            const values = this.state.values || {};
            this.requestGoodPage(this.page, this.pageSize, values)
        }).catch(()=>{
            message.error("更新失败")
        })
    }

    handleConfirmPutOut = (item) => {
        // console.log(item)
        Modal.confirm({
            title:'提示',
            content:'确认要下架该商品吗？',
            okText:'确认',
            cancelText:'取消',
            onOk:()=>{
                this.updateGoodStatus({
                    id:item.id,
                    status:1
                })
            }
        })
    }

    handleConfirmDelete = (item) => {
        // console.log(item)
        Modal.confirm({
            title:'提示',
            content:'确认要删除该商品吗？',
            okText:'确认',
            cancelText:'取消',
            onOk:()=>{this.deleteGoodById(item.id)}
        })
    }

   deleteGoodById = (id) => {
       axios.delete({
           url:'/good/deleteGoodById',
           params:{
               id:id
           }
       }).then((res)=>{
           message.success("删除成功")
           const values = this.state.values || {};
           this.requestGoodPage(this.page, this.pageSize, values);
       }).catch(()=>{
           message.error("删除失败")
       })
   }

   handleQuery = (values) => {
       console.log(values)
       this.page = 0;
       this.pageSize = 5;
       this.setState({
           values
       })
       this.requestGoodPage(this.page, this.pageSize, values);
   }

    render(){
        const columns = [
            {
                title:'商品名称',
                dataIndex:'name',
                key:'name',
                align:'center',
                width:'150px',
                render:(name, item)=>{
                    return <a onClick={()=>this.handleInfo(item)}>{name}</a>
                }
            },
            {
                title:'商品图片',
                dataIndex:'imageUrl',
                key:'imageUrl',
                align:'center',
                render:(imageUrl)=>{
                    return <div title="预览图片" className="imgWrapper"><img onClick={()=>this.handlePreview(imageUrl)} style={{height:40, width:120}} src={imageUrl} /></div>
                }
            },
            {
                title:'所属分类',
                dataIndex:'sort',
                key:'sort',
                align:'center',
                width:'100px',
                render:(sort)=>{
                    if (category) {
                        return category.map((item) => {
                            if (item.id == sort) {
                                return <Tag key={item.id} color="#87d068">{item.name}</Tag>
                            }
                        })
                    }
                    return <Tag color="red">未知分类</Tag>
                }
            },
            {
                title:'原价',
                dataIndex:'oldPrice', 
                key:'oldPrice',
                align:'center',
                width:'100px',
                render:(oldPrice)=>{
                    return <span style={{textDecoration:'line-through', color:'red'}}>{'￥'+oldPrice}</span>;
                }
            },
            {
                title:'现价',
                dataIndex:'currentPrice',
                key:'currentPrice',
                align:'center',
                width:'100px',
                render:(currentPrice)=>{
                    return <span style={{color:'green'}}>{'￥'+currentPrice}</span>
                }
            },
            {
                title:'学校',
                dataIndex:'school',
                key:'school',
                align:'center'
            },
            {
                title:'交易状态',
                dataIndex:'trade',
                key:'trade',
                align:'center',
                width:'100px',
                render:(trade)=>{
                    let config = {
                        '0':<Badge status='success' text='未交易' />,
                        '1':<Badge status='error' text='已交易' />
                    }
                    return config[trade];
                }
            },
            {
                title:'审核状态',
                dataIndex:'examine',
                key:'examine',
                align:'center',
                width:'100px',
                render:(examine)=>{
                    let config = {
                        '0':<Badge status="processing" text='待审核' />,
                        '1':<Badge status='success' text='已通过' />,
                        '2':<Badge status='error' text='未通过' />
                    }
                    return config[examine];
                }
            },
            {
                title:'下架情况',
                dataIndex:'status',
                key:'status',
                align:'center',
                width:'100px',
                render:(status)=>{
                    let config = {
                        '0':<Badge status="success" text='未下架' />,
                        '1':<Badge status='error' text='已下架' />
                    }
                    return config[status];
                }
            },
            {
                title:'操作',
                align:'center',
                width:'120px',
                render:(item)=>{
                    if(item.examine == 0){
                        return <span>
                            <a style={{marginRight:5}} onClick={()=>this.handleOpenExamine(item)}>审核 /</a>  
                            <a onClick={()=>this.handleConfirmDelete(item)}>删除</a>
                        </span>
                    }else if(item.examine == 1 && item.status == 0){
                        return <span>
                            <a style={{marginRight:5}} onClick={()=>this.handleConfirmPutOut(item)}>下架 /</a>
                            <a onClick={()=>this.handleConfirmDelete(item)}>删除</a>
                        </span>
                    }else{
                        return <span>
                            <a onClick={()=>this.handleConfirmDelete(item)}>删除</a>
                        </span>
                    }
                    
                }
            }
        ]
        const { spinning, dataSource, isShowPreview, isShowExamine, imageUrl, category, pagination } = this.state;
        const { getFieldDecorator } = this.props.form;
        return( 
            <div>
                <Card style={{marginBottom:10}}>
                    <FilterForm category={category} handleQuery={this.handleQuery}/>
                </Card>
                <Spin spinning={spinning}>
                    <Card title="商品列表">
                <Table 
                    className="table"
                    bordered
                    columns={columns}
                        dataSource={dataSource}
                        pagination={pagination}
                    />
                    </Card>
                    </Spin>
                    <Modal
                        visible={isShowPreview}
                        title="图片预览"
                        footer={null}
                        width={600}
                        height={400}
                        onCancel={()=>{
                            this.setState({
                                isShowPreview:false
                            })
                        }}
                    >
                        <img src={imageUrl} style={{width:'100%', height:400}}/>
                    </Modal>
                    <Modal
                        title="商品审核"
                        okText="提交"
                        cancelText="取消"
                        visible={isShowExamine}
                        onOk={this.handleExamine}
                        onCancel={()=>{
                            this.setState({
                                isShowExamine:false
                            })
                        }}
                    >
                        <Form layout="vertical">
                            <FormItem label="审核状态">
                                {
                                    getFieldDecorator('examine',{
                                        initialValue:1,
                                        rules:[
                                            {
                                                required:true
                                            }
                                        ]
                                    })(
                                        <Select>
                                            <Option value={1}>通过</Option>
                                            <Option value={2}>不通过</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Form>
                    </Modal>
            </div>
        )
    }
}

class FilterForm extends React.Component{

    handleSubmit = () => {
        this.props.form.validateFields((error, values)=>{
            if(!error){
                // console.log(values);
                this.props.handleQuery(values)
            }
        })
    }

    handleReset = () => {
        this.props.form.resetFields();
    }


    render(){
        const { getFieldDecorator } = this.props.form;
        const category = this.props.category || [];
        const allOptions = category.map((item)=>{
            return (
                <Option key={item.id} value={item.id}>{item.name}</Option>
            )
        })
        return(
            <div>
                <Form layout="inline">
                    <FormItem label="商品名称">
                        {
                            getFieldDecorator('name')(
                                <Input style={{width:120}} placeholder="输入商品名称"/>
                            )
                        }
                    </FormItem>
                    <FormItem label="商品类别">
                        {
                            getFieldDecorator('sort',{
                                initialValue:null
                            })(
                                <Select style={{width:100}}>
                                    <Option value={null}>全部</Option>
                                    {allOptions}
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="学校">
                        {
                            getFieldDecorator('school')(
                                <Input style={{width:120}} placeholder="输入学校名称"/>
                            )
                        }
                    </FormItem>
                    <FormItem label="审核状态">
                        {
                            getFieldDecorator('examine',{
                                initialValue:null
                            })(
                                <Select style={{width:85}} >
                                    <Option value={null}>全部</Option>
                                    <Option value={0}>待审核</Option>
                                    <Option value={1}>通过</Option>
                                    <Option value={2}>未通过</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="交易状态">
                        {
                            getFieldDecorator('trade',{
                                initialValue:null
                            })(
                                <Select style={{width:85}} >
                                    <Option value={null}>全部</Option>
                                    <Option value={0}>未交易</Option>
                                    <Option value={1}>已交易</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="下架情况">
                        {
                            getFieldDecorator('status',{
                                initialValue:null
                            })(
                                <Select style={{width:85}} >
                                    <Option value={null}>全部</Option>
                                    <Option value={0}>未下架</Option>
                                    <Option value={1}>已下架</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" icon="search" onClick={this.handleSubmit}>查询</Button>
                    </FormItem>
                    {/* <FormItem>
                        <Button onClick={this.handleReset}>重置</Button>
                    </FormItem> */}
                </Form>
            </div>
        )
    }
}

FilterForm = Form.create()(FilterForm)

export default Form.create()(Good)