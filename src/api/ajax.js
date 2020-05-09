/*ajax请求函数模块
先下载依赖包 npm install --save axios
再引入axios  import axios from 'axios'
* 返回值为promise对象(异步返回的数据是：response(优化后返回的数据为response.data))
* */
import axios from 'axios'
export default function ajax(url,data={},type='get') {
  return new Promise(function (resolve,reject) {
    //执行异步ajax请求
    let promise//声明一个promise对象
    if (type === 'GET'){//如果为get请求，就将参数拼接到url后面
      //准备url query参数数据
      let dataStr=''//数据拼接字符串
      Object.keys(data).forEach(key => {//object.keys()方法,如果参数为对象，返回的就是所有的属性组成的数据
        dataStr += key+'='+data[key]+'&'
      })
      if (dataStr !== ''){
        //substr截取（开始位置，结束位置）
        //lastIndexOf方法可返回一个指定的字符串值最后出现的位置，在一个字符串中的指定位置从后向前搜索。
        dataStr=dataStr.substr(0,dataStr.lastIndexOf('&'))
        url = url+"?"+dataStr
      }
      //发送get请求
      promise = axios.get(url)
    }else {
      promise=axios.post(url, data)
    }
    promise.then(response=>{
      //成功了调用resolve()
      resolve(response.data)
    }).catch(error=>{
      //失败了调用reject()
      reject(error)
    })
  })
}
