Page({
  data: {
    type: null,
    name:'',
    identity:''
  },

  toSend(){
    wx.navigateTo({
      url: '/pages/send/send',
    })
  },

  toLook(){
    wx.navigateTo({
      url: '/pages/look/look',
    })
  },

  toReceive(){
    wx.navigateTo({
      url: '/pages/receive/receive',
    })
  },

  onLoad (query) {
    // 这里的 query 将是 url 中，问号(?) 后面的键值对组成的一个对象
    // query = {type: 'worker'}
    var app = getApp(), username,type
    username = app.globalData.username
    type = app.globalData.type  
    this.setData({
      type: type,
      name:query.name
    });
    if(type==='worker'){
      this.setData({
        identity : '义工'
      })
    }else{
      this.setData({
        identity : '普通用户'
      })
    }
    

  },

});