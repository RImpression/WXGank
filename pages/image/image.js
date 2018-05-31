Page({

  data: {
    imageUrl:'',
  },

  onImageClick: function(event) {
    wx.navigateBack();
  },

  onLoad: function (options) {
    // console.log(options);
    this.setData({imageUrl:options.imageUrl});
  },


  onUnload: function () {
  
  },

  /**
  * 保存图片到相册
  */
  imageDownload() {
    var that = this;
    var pathSrc = that.data.imageUrl.replace('http','https');
    wx.getImageInfo({
      src: pathSrc,
      success: function(res) {
        var path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: function(res) {
            wx.showToast({
              title: '保存成功',
              duration: 2000
            })
          },
          fail: function(err) {
            wx.showToast({
              title: '保存失败',
            })
          }
        })
      },
      fail: function(err) {
        wx.showToast({
          title: '该图片不支持保存，换个妹纸试试吧',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'Gank-Image',
      path: '/pages/image/image?imageUrl=' + this.data.imageUrl,
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