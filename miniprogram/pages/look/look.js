// pages/look/look.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    currentTab: 0,
    clientHeight: 0,
    activeName: '1',
    //存放接单跟发单信息
    arraya: [],
    arrayb: [],
    modalHidden: true,
    complainContent: '',
    beComplained:'',
    Ono:'',
    id:''
  },

  complainContent(e){
    this.setData({
      complainContent:e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight 
        });
      }
    })
    let app =  getApp()
    that.setData({
      type : app.globalData.type
    }) 
    console.log(66666,that.data.type)   
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
    var that = this
    var app = getApp(),username=''
    username = app.globalData.username

    //全部接单
    that.initJieDanList(username)

    //全部发单
    that.initFaDanList(username)
    
  },

  initJieDanList(username){
    var that = this
    const db = wx.cloud.database()
    db.collection('receive').where({
      Sno: username
    }).get({
      success(res) {    
        if(res.data.length){
          that.setData({
            arraya: res.data           
          })      
        }         
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
  },

  initFaDanList(username){
    var that = this
    const db = wx.cloud.database()
    db.collection('send').where({
      Sno: username
    }).get({
      success(res) {    
        if(res.data.length){
          that.setData({
            arrayb: res.data           
          })      
        }         
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
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

  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  } ,
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },
  onOpen(event) {
    Toast(`展开: ${event.detail}`);
  },
  onClose(event) {
    Toast(`关闭: ${event.detail}`);
  },

  //完成订单
  finish(e){
    var id = e.target.dataset.id
    const db = wx.cloud.database()
    db.collection('receive').doc(id).update({
      data: {
        status: 1
      },
      success: function (res) {
        console.log("修改成功", res)
      }
    })
  },

  //确认收货
  finish1(e){
    if(e.target.dataset.status == 0){
      wx.showModal({
        title:'提示',
        content:'该单未被接哦~请耐心等待~',
        showCancel:false,
        success(res){}
      })
    }else{
      var app = getApp(),username=''
      username = app.globalData.username
      var that = this
      var id = e.target.dataset.id
      const db = wx.cloud.database()
      db.collection('send').doc(id).update({
        data: {
          status: 2
        },
        success: function (res) {
          console.log("修改成功", res)
          that.initFaDanList(username)
        }
      })
    }    
  },

  //撤单
  chedan(e){
    var id = e.target.dataset.id,that=this
    wx.showModal({
      title:'提示',
      content:'您确认撤掉此订单？',
      showCancel:true,
      success (res) {
        if (res.confirm) {
          const db = wx.cloud.database()
          // 获取名为“message”集合的引用
          const message = db.collection('send')
          // 删除操作（Promise 风格）
          message.doc(id).remove()
          //刷新发单列表
          var app = getApp(),username=''
          username = app.globalData.username
          const db2 = wx.cloud.database()
          db2.collection('send').where({
            Sno: username
          }).get({
            success(res) {    
              if(res.data.length){
                that.setData({
                  arrayb: res.data           
                })
                console.log(3333333333,that.data.arrayb)      
              }         
            },
            fail(res) {
              console.log("获取数据失败", res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //投诉
  complain(e){
    if(e.target.dataset.status<3){
      let app =  getApp(),Sno
      Sno = app.globalData.username
      var beComplained
      if(Sno == e.target.dataset.sno){
        beComplained = e.target.dataset.sendsno
      }else{
        beComplained = e.target.dataset.sno
      }
      var Ono = e.target.dataset.ono
      var id = e.target.dataset.id
      this.setData({
        modalHidden:false,
        beComplained : beComplained,   
        Ono: Ono,
        id:id
      })
    }
    
  },

  modalBindcancel:function(){
    this.setData({
    modalHidden:!this.data.modalHidden,
   })
  },

  modalBindaconfirm:function(){
    var that = this
    let app =  getApp(),Sno
    Sno = app.globalData.username
    const db = wx.cloud.database()
    db.collection('complainList').add({
    data: {
      beComplained : that.data.beComplained,   
      complainer : Sno,
      Ono: that.data.Ono,
      comlpainReason: that.data.complainContent,         
      status:0
    },
    success(){
      that.setData({
        modalHidden:!that.data.modalHidden,
        complainContent: ''
      })
      wx.showModal({
        title:'提示',
        content:'投诉成功',
        showCancel:false,
        success (res) {
          if (res.confirm) {  
            const db3 = wx.cloud.database()
            var id = that.data.id
            db3.collection('receive').doc(id).update({
              data: {
                status: 3
              },
              success: function (res) {
                that.initFaDanList()
                that.initJieDanList()
                console.log("修改成功", res)
              }
            })   
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })                
    },
    fail(res){
      console.log(33333333333333,res)
      wx.showModal({
          title:'提示',
          content:'网络不在状态！',
          showCancel:false
      })
    }
    })      
  },
  
})