// pages/receive/receive.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    flag: 0
  },

  initList(){
    var that = this
    const db = wx.cloud.database()
    db.collection('send').where({
      status:0
    }).get({
      success(res) {
        if(res.data.length){
          that.setData({
            flag: 1,
            array: res.data              
          })
        }           
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
  },

  statusChange(id){
    const db = wx.cloud.database()
    db.collection('send').doc(id).update({
      data: {
        status: 1
      },
      success: function (res) {
        console.log("修改成功", res)
      }
    })
  },

  receive(e){
    var that = this
    let app =  getApp(),Sno
    Sno = app.globalData.username
    if(e.target.dataset.status!=0){
      wx.showModal({
        title:'提示',
        content:'接单失败原因：该单已被接！',
        showCancel:false,
        success(res){
          that.initList()
        }
      })
    }
    if(Sno === e.target.dataset.sno){
      wx.showModal({
        title:'提示',
        content:'接单失败原因：不可以接自己的发单！',
        showCancel:false,
        success(res){}
      })
    }else{
      var id = e.target.dataset.id
      const db = wx.cloud.database()
      db.collection('receive').add({
      data: {
        Ono : e.target.dataset.ono,
        ReceiveAddress: e.target.dataset.receiveaddress,
        sendSno : e.target.dataset.sno,   
        Sno : Sno,        
        status:0
      },
      success(res){
        console.log(2222222222,res)
        wx.showModal({
          title:'提示',
          content:'接单成功，可到查看订单-接单详情查看',
          showCancel:false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.initList() 
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        that.statusChange(id)        
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
    }  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    this.initList()
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
  }  
})