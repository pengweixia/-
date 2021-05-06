import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    Ono : '',
    ReceiveAddress : '',
    Sphone : '',
    SendAddress : '',
    Remark : ''
  },
  signUp: function(event) {
    Dialog.alert({
      title: '期待你的加入！',
      message: 'QQ群1121022808',
    });
  },
  OnoChange(event){
    this.setData({
      Ono: event.detail
    });
  },
  ReceiveAddressChange(event){
    this.setData({
      ReceiveAddress: event.detail
    });
  },
  SphoneChange(event){
    this.setData({
      Sphone: event.detail
    });
  },
  SendAddressChange(event){
    this.setData({
      SendAddress: event.detail
    });
  },
  RemarkChange(event){
    this.setData({
      Remark: event.detail
    });
  },

  add(){
    var app = getApp(),Sno
    Sno = app.globalData.username
    const db = wx.cloud.database()
    db.collection('send').add({
      data: {
        Ono : this.data.Ono,
        ReceiveAddress : this.data.ReceiveAddress,
        Sno : Sno,
        Sphone : this.data.Sphone,
        SendAddress : this.data.SendAddress,
        Remark : this.data.Remark,
        status:0
      },
      success(res){
        console.log(res)
        wx.showModal({
          title:'提示',
          content:'发单成功，可到我的-发单详情查看',
          showCancel:false
        })
      },
      fail(res){
        console.log(res)
        wx.showModal({
            title:'提示',
            content:'网络不在状态！',
            showCancel:false
        })
      }
    })
    this.setData({
      Ono : '',
      ReceiveAddress : '',
      Sphone : '',
      SendAddress : '',
      Remark : ''
    })      
  },
  //点击确认发单按钮
  sendBtn:function(e){
    var that = this ;    
    if(that.data.Ono == ''){
      wx.showModal({
        title:'提示',
        content:'订单号不能为空',
        showCancel:false,
        success(res){}
      })
    }else if(that.data.SendAddress == ''){
      wx.showModal({
        title:'提示',
        content:'取件地址不能为空',
        showCancel:false,
        success(res){}
      })
    }else if(that.data.Sphone == ''){
      wx.showModal({
        title:'提示',
        content:'手机号码不能为空',
        showCancel:false,
        success(res){}
      })
    }else if(that.data.ReceiveAddress == ''){
      wx.showModal({
        title:'提示',
        content:'收件地址不能为空',
        showCancel:false,
        success(res){}
      })
    }else if(that.data.Sphone.length != 11){
      wx.showModal({
        title:'提示',
        content:'手机号码长度需为11位！',
        showCancel:false,
        success(res){}
      })
    }else{
      const db = wx.cloud.database()
      db.collection('send').where({
        Sno: this.data.Sno,
        Ono:this.data.Ono
      }).get({
        success(res) {
          if(res.data.length){
            wx.showModal({
              title:'提示',
              content:'订单号重复',
              showCancel:false
            })
          }else{
            console.log(222)
            that.add()
            
          }          
        },
        fail(res) {
          console.log("获取数据失败", res)
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

  }
})
