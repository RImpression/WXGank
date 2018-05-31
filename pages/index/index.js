//获取应用实例
const app = getApp()

import gankApi from '../../utils/gankApiUtils.js';
import dateUtil from '../../utils/dateUtils.js';

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    gankArray: [],
    page: 1,
    isHideLoadMore: false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getData();
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    gankApi.getGankDayData(1).then((res) => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      this.setData({
        gankArray: res,
        page: 1
      })
    }).catch((err) => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      wx.showToast({
        title: '下拉刷新失败',
        duration: 2000
      })
    })
  },


  getData() {
    gankApi.getGankDayData(1).then((res)=>{
      // console.log(res);
      this.setData({
        gankArray: res
      })
    }).catch((err)=>{
      console.log('request error: ' + err);
      wx.showToast({
        title: '数据请求失败',
        duration: 2000
      })
    })
  },

  //加载更多onReachBottom
  onReachBottom: function () {
    //显示加载更多loading
    this.setData({
      isHideLoadMore: false
    })
    gankApi.getGankDayData(this.data.page+1).then((res)=>{
      let newArray = this.data.gankArray.concat(res);
      this.setData({
        gankArray: newArray,
        page:this.data.page + 1,
        isHideLoadMore: true
      })
    }).catch((err)=>{
      this.setData({
        isHideLoadMore: true
      })
      wx.showToast({
        title: '数据加载失败',
        duration: 2000
      })
    })
  },

  /**
   * 卡片点击
   */
  onItemClick: function (event) {
    if (event.currentTarget.dataset.publishTime != null) {
      let dateStr = dateUtil.getDateUrl(event.currentTarget.dataset.publishTime);
      wx.navigateTo({
        url: '/pages/daily/daily?dateStr=' + dateStr,
      })
    }
  },

  onShareAppMessage: function () {
    return {
      title: 'Gank-Image',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          duration: 2000
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '转发失败：' + err,
          duration: 2000
        })
      }
    }
  }
})
