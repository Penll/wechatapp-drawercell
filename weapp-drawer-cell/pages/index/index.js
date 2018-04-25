//获取应用实例
const app = getApp()

Page({
  data: {
    messageList: [
      {
        pic: 'http://wx2.sinaimg.cn/mw600/e0e4ecc3gy1fqo3c4x13nj20i20jdq5s.jpg',
        title: '消息标题1',
        describeInfo: '内容内容内容内容内容内容内容内容',
        formatUpdate: '今天 9:30',
        hasNewPoint: false,
        hasCloseNotice: true,
      },
      {
        pic: 'http://wx2.sinaimg.cn/mw600/e0e4ecc3gy1fqo3c4x13nj20i20jdq5s.jpg',
        title: '消息标题2',
        describeInfo: '内容内容内容内容内容内容内容内容',
        formatUpdate: '昨天 12:30',
        hasNewPoint: true,
        hasCloseNotice: false,
      },
      {
        pic: 'http://wx2.sinaimg.cn/mw600/e0e4ecc3gy1fqo3c4x13nj20i20jdq5s.jpg',
        title: '消息标题3',
        describeInfo: '他发表了一个新动态',
        formatUpdate: '2017-10-20 12:30',
        hasNewPoint: false,
        hasCloseNotice: true,
      },
      {
        pic: 'http://wx2.sinaimg.cn/mw600/e0e4ecc3gy1fqo3c4x13nj20i20jdq5s.jpg',
        title: '消息标题4',
        describeInfo: 'xxx评论了你的动态',
        formatUpdate: '昨天 12:30',
        hasNewPoint: false,
        hasCloseNotice: false,
      },
    ],
  },

  onLoad: function () {

  },
  bindCellTapHandler: function (e) {
    wx.showToast({
      title: '跳转详情页',
      duration: 1500,
    });
  },

  bindOperateTapHandler: function (e) {
    let operateName = e.detail.tapItem;
    let index = e.detail.index;
    let group = this.data.messageList[index];

    let groupID = group.groupID;

    let babyID = parseInt(group.objectID);

    switch (operateName) {
      case "关闭提醒":
        this.setData({
          ["messageList[" + index + "].hasCloseNotice"]: true
        })
        //TODO：关闭提醒

        wx.showToast({
          title: '关闭提醒',
          duration: 1500,
        });
        break;
      case "打开提醒":
        this.setData({
          ["messageList[" + index + "].hasCloseNotice"]: false
        })

        //TODO：打开提醒
        wx.showToast({
          title: '打开提醒',
          duration: 1500,
        });
        break;
      case "已读":
        this.setData({
          ["messageList[" + index + "].hasNewPoint"]: false
        })
        //TODO：已读操作
        wx.showToast({
          title: '已读成功',
          duration: 1500,
        });
        break;
    }
  }
})
