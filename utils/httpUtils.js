// const PAGE_NUM = 10;
// export default class httpsUtil {
//   static getGankDayData = (opt, pageNo) => {
//   let URL = `http://gank.io/api/history/content/${PAGE_NUM}/${pageNo}`;
//   wx.request({
//     url: URL,
//     result: [],
//     success: function (res) {
//       console.log(111, res.result);
//     }
//   })
// }
// }

/**
 * fetch GET&POST 网络层简单封装
 */
export default class httpUtils {
  /**
   * fetch GET 请求
   * @param url
   * @returns {Promise}
   */
  static fetchGet = (url) => {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        results:[],
        success: function(res) {
          resolve(res.data.results);
        },
        fail: function(err) {
          reject(err);
        }
      })
    })
  };

  /**
   * fetch POST 请求
   * @param url   API
   * @param formData  FormData表单数据
   * @param headers   头部
   * @returns {Promise}
   */
  static fetchPost = (url, formData, headers) => {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: formData,
      })
        .then((response) => response.json())
        .then((responseData) => {
          resolve(responseData);
        })
        .catch((error) => {
          reject(error.toString());
        })
    })
  }
}