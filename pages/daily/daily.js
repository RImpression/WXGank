// pages/daily/daily.js
import gankApi from '../../utils/gankApiUtils.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateStr:'',
    data:[],
    imgUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({dateStr:options.dateStr});
    this.getData(options.dateStr);
    wx.setNavigationBarTitle({
      title: options.dateStr,
    });
  },

  getData(dateStr) {
    gankApi.getGankDailyData(dateStr).then((res)=>{
      let newArr = this.creatNewArray(res);
      this.setData({
        data: newArr
      })
    }).catch((err)=>{
      wx.showToast({
        title: '数据请求失败',
        duration: 2000
      })
    })
  },

/**
 * 重组数据结构
 */
  creatNewArray(res) {
    let newArr = [];
    for(let key in res) {
      if ('福利' == key) {
        let imgObj = res[key];
        this.setData({imgUrl:imgObj[0].url});
      } else {
        newArr.push({
          type : key,
          content : res[key]
        })
      }
    }
    return newArr;
  },

  onItem: function(event) {
    console.log(event.currentTarget.dataset);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData(this.data.dateStr);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'Gank-' + this.data.dateStr,
      path: '/pages/daily/daily?dataStr' + this.data.dateStr,
      success: function(res) {
        wx.showToast({
          title: '转发成功',
          duration: 2000
        })
      },
      fail: function(err) {
        wx.showToast({
          title: '转发失败：' + err,
          duration: 2000
        })
      }
    }
  }
})