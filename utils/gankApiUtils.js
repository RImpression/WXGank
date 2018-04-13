import HttpUtils from './httpUtils.js'
import imgFromHtmlUtil from './imgFromHtmlUtil.js';
import dateUtils from './dateUtils.js'

const PAGE_NUM = 10;
export default class gankApiUtils {
  /**
   * 获取历史干货数据
   * @param pageNo 当前加载页数
   */
  static getGankDayData = (pageNo) => {
    return new Promise((resolve, reject) => {
      let URL = `https://gank.io/api/history/content/${PAGE_NUM}/${pageNo}`;
      return HttpUtils.fetchGet(URL)
        .then((res) => {
          let dataArray = [];
          res.map((data, i) => {
            let obj = {
              _id: data._id,
              content: imgFromHtmlUtil.getImageSrc(data.content),
              title: data.title,
              publishedAt: dateUtils.getShowDate(data.publishedAt),
            }
            dataArray.push(obj);
          })
          resolve(dataArray);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }

  /**
   * 获取干货分类数据
   * @param sort 分类（all | Android | iOS | 休息视频 | 福利 | 拓展资源 | 前端 | 瞎推荐 | App）
   * @param pageNo 当前加载页数
   */
  static getGankSortData = (sort,pageNo) => {
    return new Promise((resolve,reject) => {
      let URL = `https://gank.io/api/data/${sort}/30/${pageNo}`;
      return HttpUtils.fetchGet(URL)
        .then((res) => {
          let dataArray = [];
          res.map((data, i) => {
            let obj = {
              _id: data._id,
              desc: data.desc,
              who: data.who,
              type: data.type,
              url: data.url,
              publishedAt: dateUtils.getShowDate(data.publishedAt),
            }
            dataArray.push(obj);
          })
          resolve(dataArray);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }

  /**
   * 获取福利妹子图片
   */
  static getGankGirlData = (pageNo) => {
    return this.getGankSortData('福利',pageNo);
  }

  /**
   * 获取某日数据集合
   * @param dateString 日期 2017/08/09
   */
  static getGankDailyData = (dateStr) => {
    return new Promise((resolve,reject) => {
      let URL = `https://gank.io/api/day/${dateStr}`;
      return HttpUtils.fetchGet(URL)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        })
    })
  }



}