const util = require('../../utils/util.js');
import gankApi from '../../utils/gankApiUtils.js';

Page({
  data: {
    tabs: ['Android', 'iOS', '前端', '瞎推荐', '拓展资源','休息娱乐'],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0,
    pages:[1,1,1,1,1,1],
    gankDatas:[[],[],[],[],[],[]],
    activeData:[],
  },
  onLoad: function (options) {
    try {
      let { tabs } = this.data;
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({ stv: this.data.stv })
      this.tabsCount = tabs.length;
    } catch (e) {
    }
    this.getData();
  },
  handlerStart(e) {
    let { clientX, clientY } = e.touches[0];
    this.startX = clientX;
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.data.stv.tStart = true;
    this.tapStartTime = e.timeStamp;
    this.setData({ stv: this.data.stv })
  },
  handlerMove(e) {
    let { clientX, clientY } = e.touches[0];
    let { stv } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    stv.offset += offsetX;
    if (stv.offset <= 0) {
      stv.offset = 0;
    } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
      stv.offset = stv.windowWidth * (this.tabsCount - 1);
    }
    this.setData({ stv: stv });
  },
  handlerCancel(e) {
  },
  handlerEnd(e) {
    let { clientX, clientY } = e.changedTouches[0];
    let endTime = e.timeStamp;
    let { tabs, stv, activeTab } = this.data;
    let { offset, windowWidth } = stv;
    //快速滑动
    if (endTime - this.tapStartTime <= 300) {
      //向左
      if (Math.abs(this.tapStartY - clientY) < 50) {
        if (this.tapStartX - clientX > 5) {
          if (activeTab < this.tabsCount - 1) {
            this.setData({ activeTab: ++activeTab })
          }
        } else {
          if (activeTab > 0) {
            this.setData({ activeTab: --activeTab })
          }
        }
        stv.offset = stv.windowWidth * activeTab;
      } else {
        //快速滑动 但是Y距离大于50 所以用户是左右滚动
        let page = Math.round(offset / windowWidth);
        if (activeTab != page) {
          this.setData({ activeTab: page })
        }
        stv.offset = stv.windowWidth * page;
      }
    } else {
      let page = Math.round(offset / windowWidth);
      if (activeTab != page) {
        this.setData({ activeTab: page })
      }
      stv.offset = stv.windowWidth * page;
    }
    stv.tStart = false;
    this.setData({ stv: this.data.stv })

    this.getData();
  },
  _updateSelectedPage(page) {
    let { tabs, stv, activeTab } = this.data;
    activeTab = page;
    this.setData({ activeTab: activeTab });
    stv.offset = stv.windowWidth * activeTab;
    this.setData({ stv: this.data.stv });

    this.getData();
  },
  handlerTabTap(e) {
    this._updateSelectedPage(e.currentTarget.dataset.index);
  },

  //请求数据
  getData() {
    let index = this.data.activeTab;
    let sort = this.data.tabs[index] == '休息娱乐' ? '休息视频' : this.data.tabs[index];
    gankApi.getGankSortData(sort, 1).then((res) => {
      let newArr = this.data.gankDatas;
      newArr[index] = res;
      this.setData({ gankDatas : newArr})
    }).catch((err) => {
      console.log(err);
    })
  },

  itemClick: function(event) {
    let item = event.currentTarget.dataset.item;
    let url = item.url;
    wx.setClipboardData({
      data: url,
      success: function(res){
        wx.showModal({
          title: '提示',
          content: '链接已复制到粘贴板，请用外部浏览器打开',
          showCancel: false,
        })
      }
    })
  }
})