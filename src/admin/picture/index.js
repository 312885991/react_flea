import React from 'react';
import { Upload, Icon, Card, Modal, Button, Spin, message, Form, Input } from 'antd';
import axios from '../../axios'
import { keySecret } from '../../config/OSSConfig'
import './index.less'
const FormItem = Form.Item;

export default class Picture extends React.Component {

  state = {
    spinning: false,
    isShowPreview: false,
    isShowEnterPwd:false,
    imageUrl: []
  };

  componentWillMount() {
    this.requestImgList();
  }

  // 加载所有轮播图
  requestImgList = () => {
    this.setState({
      spinning: true
    })
    axios.get({
      url: '/getOSSImageUrl'
    }).then((res) => {
      this.setState({
        spinning: false,
        imageUrl: res.imageUrl
      })
    }).catch(() => {
      message.error("数据加载失败")
      this.setState({
        spinning: false
      })
    })
  }

  // 预览图片
  handlePreview = (url) => {
    this.setState({
      isShowPreview: true,
      url
    })
  }

  // 删除图片前进行确认提示
  handleConfirmDelete = (url) => {
    Modal.confirm({
      title: '提示',
      content: '确认要删除么？',
      okText: '确认删除',
      cancelText: '返回',
      onOk: () => {
        this.setState({
          isShowEnterPwd:true,
          url
        })
      }
    })
  }

  handleDelete = () => {
    this.enterPwdForm.props.form.validateFields((error, values)=>{
      if(!error){
        if(values.password !== '1314520lls0204.'){
            message.error("操作密码有误")
            return;
        }
        const url = this.state.url;
        if(!url){
          message.error("系统出错啦")
          return;
        }
        this.deleteImage(url);
        this.enterPwdForm.props.form.resetFields();
        this.setState({
          isShowEnterPwd:false
        })
      }
    })
  }

  // 删除图片
  deleteImage = (url) => {
    axios.delete({
      url: '/deleteOSSImage',
      params: {
        imageUrl: url,
        keySecret: keySecret
      }
    }).then(() => {
      message.success("删除成功");
      this.requestImgList();
    }).catch(() => {
      message.error("删除失败")
    })
  }

  // 文件上传时处理格式
  handleBeforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG或者PNG格式图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2M');
    }
    return isJpgOrPng && isLt2M;
  }

  // 文件上传状态
  handleChange = (info) => {
    if (info.file.status === 'done') {
      message.success("图片上传成功");
      this.requestImgList();
    } else if (info.file.status === 'error') {
      message.error("图片上传失败");
    }
  }

  render() {
    const { imageUrl, spinning, isShowPreview, isShowEnterPwd, url } = this.state;
    const imgList = imageUrl.map((item) => {
      return <div className="imageWrapper">
        <img src={item} />
        <div className="preview" title="预览图片" onClick={() => this.handlePreview(item)}><Icon type="eye" /></div>
        <div className="delete" title="删除图片" onClick={() => this.handleConfirmDelete(item)}><Icon type="delete" /></div>
      </div>
    })
    return (
      <div>
        <Spin spinning={spinning}>
          <Card style={{ minHeight: '60vh' }}>
            <Upload
              name="file"
              method="POST"
              action="https://quicklyweb.cn/uploadOSSImage"
              onChange={this.handleChange}
              beforeUpload={this.handleBeforeUpload}
            >
              <Button type="primary" icon="upload">上传图片</Button>
            </Upload>
            <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
              {imgList}
            </div>
          </Card>
        </Spin>
        <Modal
          title="图片预览"
          footer={null}
          visible={isShowPreview}
          width={700}
          height={500}
          onCancel={() => {
            this.setState({
              isShowPreview: false
            })
          }}
        >
          {<img src={url} style={{ width: '100%' }} />}
        </Modal>
        <Modal
          title="操作确认"
          visible={isShowEnterPwd}
          width={450}
          onOk={this.handleDelete}
          onCancel={()=>{
            this.enterPwdForm.props.form.resetFields();
            this.setState({
              isShowEnterPwd:false
            })
          }}
        >
          <EnterPwdForm wrappedComponentRef={(inst) => this.enterPwdForm = inst}/>
        </Modal>
      </div>
    );
  }
}

class EnterPwdForm extends React.Component{
  render(){
    const { getFieldDecorator } = this.props.form;
    return(
      <div>
        <Form layout="vertical">
            <FormItem label="密码">
                {
                  getFieldDecorator('password',{
                    rules:[
                      {
                        required:true,
                        message:'密码不能为空'
                      }
                    ]
                  })(
                    <Input type="password" prefix={<Icon type="lock"/>} />
                  )
                }
            </FormItem>
        </Form>
      </div>
    )
  }
}

EnterPwdForm = Form.create()(EnterPwdForm)
