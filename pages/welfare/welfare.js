let col1H = 0;
let col2H = 0;

import gankApi from '../../utils/gankApiUtils.js';

Page({

  data:{
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    page: 1,
    isHideLoadMore: false,
  },

  onLoad: function () {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        //加载首组图片
        this.loadImages();
      }
    })
  },

  onImageLoad: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img._id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    //判断当前图片添加到左列还是右列
    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    //当前这组图片已加载完毕，则清空图片临时加载区域的内容
    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },

  loadImages: function() {
    gankApi.getGankSortData('福利',1).then((res)=>{
      console.log(1111,res);
      this.setData({
        loadingCount:res.length,
        images: res,
        page: 1
      })
    }).catch((err)=>{
      console.log(err);
      wx.showToast({
        title: '数据加载失败',
        duration: 2000
      })
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    gankApi.getGankSortData('福利', 1).then((res) => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      this.setData({
        loadingCount:res.length,
        images: res,
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

  //加载更多onReachBottom
  onReachBottom: function () {
    //显示加载更多loading
    this.setData({
      isHideLoadMore: false
    })
    gankApi.getGankSortData('福利', this.data.page+1).then((res) => {
      let newArray = this.data.images.concat(res);
      this.setData({
        images: newArray,
        page: this.data.page + 1,
        isHideLoadMore: true,
        loadingCount: this.data.loadingCount + res.length
      })
    }).catch((err) => {
      this.setData({
        isHideLoadMore: true
      })
      wx.showToast({
        title: '数据加载失败',
        duration: 2000
      })
    })
  },

  onImageClick: function(event) {
    if (event.currentTarget.dataset.imageurl != null) {
      wx.navigateTo({
        url: '/pages/image/image?imageUrl=' + event.currentTarget.dataset.imageurl,
      })
    }
  }

})