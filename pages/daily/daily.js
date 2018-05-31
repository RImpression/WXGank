import gankApi from '../../utils/gankApiUtils.js';
Page({

  data: {
    dateStr:'',
    data:[],
    imgUrl:''
  },

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
        let showKey = '休息视频' == key ? '休息娱乐' : key
        newArr.push({
          type : showKey,
          content : res[key]
        })
      }
    }
    return newArr;
  },

  onItem: function(event) {
    let url = event.currentTarget.dataset.url;
    wx.setClipboardData({
      data: url,
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '链接已复制到粘贴板，请用外部浏览器打开',
          showCancel: false,
        })
      }
    })
  },

  onUnload: function () {
  
  },

  imgClick() {
    wx.navigateTo({
      url: '/pages/image/image?imageUrl=' + this.data.imgUrl,
    })
  },


  onPullDownRefresh: function () {
    this.getData(this.data.dateStr);
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