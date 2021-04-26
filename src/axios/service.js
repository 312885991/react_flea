import axios from 'axios'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'

//创建axios实例
const service = axios.create({
  baseURL: "https://quicklyweb.cn",
  // baseURL: "http://localhost:8090",
  timeout: 150000, // 请求超时时间
  withCredentials: true // 选项表明了是否是跨域请求
})

// 发送请求
service.interceptors.request.use(config => {
  // 去除圆圈
  NProgress.configure({ showSpinner: false });
  NProgress.start();
  NProgress.set(0.4);
  return config;
}, err => {
  return Promise.reject(err)
})

// 拦截响应
service.interceptors.response.use(config => {
  return config;
}, err => {
  return Promise.reject(err)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code == 200) {
      NProgress.done();
      return Promise.resolve(res);
    } else {
      NProgress.done();
      return Promise.reject(res)
    }
  },
  error => {
    NProgress.done();
    const res = error.response.data;
    // console.log(res);
    return Promise.reject(res)
  }
)
export default service