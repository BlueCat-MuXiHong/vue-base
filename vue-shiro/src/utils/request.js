import axios from "axios";
import {Message} from "element-ui";


const http = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 10000,
  withCredentials: true
})
// 判空
let isEmpty = function (obj) {
  return obj == null || obj === "undefined" || obj === "null" || String(obj).trim() === '';
};

http.interceptors.request.use(
  req => {
    //通过请求路径中是否含有RefreshToken来判断当前是一般请求还是token刷新请求；从而在请求头中带上不同的token
    if (-req.url.indexOf("RefreshToken") === 1) {
      req.headers['Authorization'] = sessionStorage.getItem("Authorization");
    } else {
      req.headers['RefreshToken'] = sessionStorage.getItem("refreshToken");
    }
    return req;
  },
  err => {
    return Promise.reject(err)
  }
)

//标志当前是否正在刷洗token
let isNotRefreshing = true;
//请求队列
let requests = [];
http.interceptors.response.use(
  async res => {
    //我们可以定义一个标准响应体，比如：{code=10415,msg='token已过期',data:null}，当收到token过期的响应就要进行token刷新了
    if (res.data.code === 401) {
      //首先拿到响应的配置参数，这和请求的配置参数是一样的，包括了url、data等信息，待会需要使用这个config来进行重发
      const config = res.config;
      //如果当前不处于刷新阶段就进行刷新操作
      if (isNotRefreshing) {
        isNotRefreshing = false;
        //返回刷新token的回调的返回值，本来考虑到由于请求是异步的，所以return会先执行，导致返回一个undefined，那么就需要使用async+await，但实际上没有加也成功了
        return http.get("/loginByRefreshToken")
          .then(res => {
            //如果token无效或token仍然过期，就只能重新登录了
            if (res.data.code === 401 || res.data.code === 403) {
              sessionStorage.removeItem("Authorization");
              sessionStorage.removeItem("refreshToken");
              location.href = '/login';
            } else if (res.data.code === 200) {
              //刷新成功之后，将新的token存起来
              sessionStorage.setItem("Authorization", res.data.data.access_token)
              sessionStorage.setItem("refreshToken", res.data.data.refresh_token)
              //执行requests队列中的请求，（requests中存的不是请求参数，而是请求的Promise函数，这里直接拿来执行就好）
              requests.forEach(run => run())
              //将请求队列置空
              requests = []
              //重新执行当前未执行成功的请求并返回
              return http(config);
            }
          })
          .catch(() => {
            sessionStorage.removeItem("Authorization");
            sessionStorage.removeItem("refreshToken");
            location.href = '/login';
          })
          .finally(() => {
            isNotRefreshing = true;
          })
      } else {
        //如果当前已经是处于刷新token的状态，就将请求置于请求队列中，这个队列会在刷新token的回调中执行，由于new关键子存在声明提升，所以不用顾虑会有请求没有处理完的情况，这段添加请求的程序一定会在刷新token的回调执行之前执行的
        return new Promise(resolve => {
          //这里加入的是一个promise的解析函数，将响应的config配置对应解析的请求函数存到requests中，等到刷新token回调后再执行
          requests.push(() => {
            resolve(http(config));
          })
        })
      }
    } else {
      if (res.data.code === 200) {
        return res.data;
      } else {
        if (res.data.code === 10409) {
          sessionStorage.removeItem("Authorization");
          sessionStorage.removeItem("refreshToken");
          location.href = "/login"
        }
        Message.error(res.data.message);
        return res.data;
      }
    }

  },
  err => {
    if (err && err.response && err.response.status) {
      switch (err.response.status) {
        case 404:
          Message.error("页面未找到");
          break;
        case 401:
          Message.error('请登录')
          break;
        case 500:
          Message.error("操作过于频繁，请稍后再试")
          break;
        case 505:
          Message.error("网络错误")
      }
    }
  }
)


// // 添加请求拦截器
// http.interceptors.request.use(function (config) {
//     // 在发送请求之前做些什么
//     return config;
// }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
// });
//
// // 添加响应拦截器
// http.interceptors.response.use(function (response) {
//     // 2xx 范围内的状态码都会触发该函数。
//     // 对响应数据做点什么
//     return response;
// }, function (error) {
//     // 超出 2xx 范围的状态码都会触发该函数。
//     // 对响应错误做点什么
//     return Promise.reject(error);
// });
//
// //判空


export default http
