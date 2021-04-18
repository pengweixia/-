Page({
  data: {
    type: null,
    num:1
  },

  onLoad (query) {
    // 这里的 query 将是 url 中，问号(?) 后面的键值对组成的一个对象
    // query = {type: 'worker'}
    var app = getApp(), username,type
    username = app.globalData.username
    type = app.globalData.type  
    this.setData({
      type: type
    })
    wx.cloud.callFunction({
      name:'userStatus',
      data:{
        type:type,
        username:username
      },
      success(res){
        console.log("请求云函数成功",res)
        
        },
      fail(res) {
         console.log("请求云函数失败", res)
         }
    })

  }
});