import axios from "axios";
import router from "../../router";
import qs from 'qs'
import store from '../../store'    //axios 封装如果要用到vuex需要再次引入才能使用
import { Notification, Loading } from "element-ui";

axios.defaults.baseURL = 'http://' + window.g.baseURL;  
console.log(window.g)
// 环境的切换
if (process.env.NODE_ENV == 'development') {    
} else if (process.env.NODE_ENV == 'debug') {    
    // axios.defaults.baseURL = 'http://172.16.0.120:30598';
} else if (process.env.NODE_ENV == 'production') {    
    // axios.defaults.baseURL = 'http://172.16.0.120:30598';
}
// 请求超时时间
axios.defaults.timeout = 60000;
axios.defaults.headers['Content-Type'] = 'application/json';
// post请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.headers['Access-Control-Allow-Header']='Access-Control-Allow-Origin'
// axios.defaults.headers['Access-Control-Allow-Origin']='*'
// var instance = axios.create({        //封装postform请求用于文件上传
//     headers: {'content-type':'multipart/form-data; charset=UTF-8'}
// });


// // 请求拦截器
axios.interceptors.request.use(    
    config => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token = localStorage.getItem('token');
        if(token!=''){
            config.headers['Authorization'] = 'Bearer ' + token
        }
//         // const sessionId = sessionStorage.getItem('sessionId');
//         // if(sessionId!=''){
//         //     config.headers.sessionId = sessionId;
//         // }
//         const userId = sessionStorage.getItem('userId');
//         if(userId!=''){
//             config.headers.userId = userId;
//         }
        return config;    
    },    
    error => {     
        return Promise.error(error);    
    })

// 响应拦截器
axios.interceptors.response.use( 
    response => {
    	// console.log(response)
// 		let startTime=response.config.metadata.startTime
// 		let now = Date.now();
// 		let seconds = Math.floor((now - startTime)/1000);
// 		let milliseconds = Math.floor((now - startTime)%1000);
// 		// console.log(`${seconds}.${milliseconds} seconds`)
//   		// response.data.duration = `${seconds}.${milliseconds}`
// 		// 		if(response.headers.token){
// 		// 			sessionStorage.setItem('token',response.headers.token) //存储token,每次请求token都会改变
// 		// 		}
        if (response.status === 200) {            
            return Promise.resolve(response);   
            // console.log(response)
        } else {            
            return Promise.reject(response);        
        }    
    },
    // 服务器状态码不是200的情况    
    error => {  
        // if(error.response.headers.token){
        //   sessionStorage.setItem('token',error.response.headers.token) //存储token,每次请求token都会改变   无论成功失败都要存储token
        // }
        if (error.response&&error.response.status) {            
            switch (error.response.status) {                
                case 401:                    
                    Notification.success({
                        title: '错误',
                        message: error?.response?.data?.detail ?? error.response.data,
                        duration:3000
                    })    
                    router.push('/')    
                    break;   
                // case 903:                    
                //     Notification.error('请重新登陆')  
                //     router.push('/')    
                //     break;
                // case 904:                    
                //     Notification.error('无权限，请重新登陆')  
                //     router.push('/')    
                //     break;
                // case 905:                    
                //     Notification.error('无此操作人员，无操作权限')  
                //     router.push('/')    
                //     break;
                // case 906:                    
                //     Notification.error('长时间未登录,请重新登陆')  
                //     router.push('/')    
                //     break;
                // 其他错误，直接抛出错误提示                
                default:
                    Notification.success({
                        title: '错误',
                        message:  error?.response?.data?.detail ?? error.response.data,
                        duration:3000
                    })                    
            }            
            return Promise.reject(error.response);        
        }else{
                Notification.success({
                    title: '错误',
                    message: error.response,
                    duration:3000
                }) 
						// router.push('/login')    
        	  return Promise.reject(error.response);
        }
    }
);

export default {

/* 封装get方法   url  data  returns {Promise} */
get (url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params: params}).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err)
        })
    })
},

/* 封装delete方法   url  data  returns {Promise} */
delete (url, params = {}, data = {}) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {params: params, data: data}).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err)
        })
    })
},

/* 封装put请求  url  data  returns {Promise}*/
put(url,data = {}, params = {}){
    return new Promise((resolve,reject) => {
     axios.put(url, data, {params: params}).then(response => {
            resolve(response.data);
        },err => {
            reject(err)
        })
    })
},
/* 封装put请求  url  data  returns {Promise}*/
putForm(url,data = {}, params = {}){
    return new Promise((resolve,reject) => {
        axios.put(url,qs.stringify(data), {params: params, headers: {'content-type':'application/x-www-form-urlencoded;charset=UTF-8'}}).then(response => {
            resolve(response.data);
        },err => {
            reject(err)
        })
    })
},
/* 封装put请求  url  data  returns {Promise}*/
putFormData(url,data = {}, params = {}){
    return new Promise((resolve,reject) => {
        axios.put(url,data, {params: params, headers: {'content-type':'multipart/form-data; charset=UTF-8'}}).then(response => {
            resolve(response.data);
        },err => {
            reject(err)
        })
    })
},

/* 封装post请求  url  data  returns {Promise}*/
post(url,data = {}, params = {}){
    return new Promise((resolve,reject) => {
     axios.post(url,data, {params: params}).then(response => {
            resolve(response.data);
        },err => {
            reject(err)
        })
    })
},
/* 封装postForm请求  url  data  returns {Promise}*/
postForm(url,data = {}, params = {}){
    return new Promise((resolve,reject) => {
     axios.post(url,qs.stringify(data), {params: params, headers: {'content-type':'application/x-www-form-urlencoded;charset=UTF-8'}}).then(response => {
            resolve(response.data);
        },err => {
            reject(err)
        })
    })
},

/* 封装postform请求  url  data  returns {Promise}  改变请求头content-type*/
postFormData(url,data = {}){
    return new Promise((resolve,reject) => {
      axios.post(url,data, {headers: {'content-type':'multipart/form-data; charset=UTF-8'}})
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
    })
},

postFile(url,data = {}){
    return new Promise((resolve,reject) => {
        axios.post(url,data,{responseType: 'blob'}).then(response => {
            resolve(response.data);
        },err => {
            reject(err)
        })
    })
},
/* get方法下载文件   url  params  returns {Promise} */
getFile(url, params = {}) {
  return new Promise((resolve, reject) => {
      axios.get(url, {params: params, responseType: 'blob'}).then(response => {
          resolve(response);
      }).catch(err => {
          reject(err)
      })
  })
}
}
