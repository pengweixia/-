Page({
  data: {
    type: null,
    name:'',
    identity:'',
    rateCount: '',
    level: ''
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
    this.getInformation()
  },

  getInformation(){
    var app = getApp(),Sno,haveStar,usedStar,level = 0,rateCount = 0,that = this
    Sno = app.globalData.username
    const db = wx.cloud.database()
    db.collection('rate').where({
      Sno: Sno,
    }).get({
      success(res) {
        if(res.data.length){
          haveStar = res.data[0].haveStar
          usedStar = res.data[0].usedStar
          level = parseInt(Math.log(haveStar)/Math.log(2))
          for(let i = 0 ;i<=level;i++){
            rateCount += i
          }
          rateCount -= usedStar
        }  
        app.globalData.rateCount = rateCount
        app.globalData.level = level     
        that.setData({
          rateCount: app.globalData.rateCount,
          level: app.globalData.level
        })  
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
  },

  onShow: function(){
    this.getInformation()
  }

});