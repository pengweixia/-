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
    Remark : '',
    modalHidden: true,
    arr: []
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

  update(){
    var app = getApp(),Sno,usedStar,that = this
    Sno = app.globalData.username
    const db = wx.cloud.database()
    db.collection('rate').where({Sno:Sno}).get({
      success(res) {    
        if(res.data.length){
           usedStar = res.data[0].usedStar+1
           that.updateUsedStar(usedStar)
        }         
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
  },

  receiveAddStar(sno){
    var haveStar,that = this, Sno = sno
    const db = wx.cloud.database()
    db.collection('rate').where({Sno:Sno}).get({
      success(res) {    
        if(res.data.length){
          haveStar = res.data[0].haveStar+3
          that.updateStar(haveStar,Sno)
        }                 
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
  },

  addStar(){
    var app = getApp(),Sno,haveStar,that = this
    Sno = app.globalData.username
    const db = wx.cloud.database()
    db.collection('rate').where({Sno:Sno}).get({
      success(res) {    
        if(res.data.length){
          haveStar = res.data[0].haveStar+3
          that.updateStar(haveStar,Sno)
        }                 
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
    
  },

  updateStar(haveStar,Sno){    
    const db = wx.cloud.database()
    db.collection('rate').where({Sno:Sno}).update({
      data: {
        haveStar: haveStar
      },
      success: function (res) {
        console.log('修改成功')
      }
    })
  },

  updateUsedStar(usedStar){
    var app = getApp(),Sno
    Sno = app.globalData.username
    const db = wx.cloud.database()
    db.collection('rate').where({Sno:Sno}).update({
      data: {
        usedStar: usedStar
      },
      success: function (res) {
        console.log('修改成功')
      }
    })
  },

  add(){
    var app = getApp(),Sno,that = this
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
        status:0,
        rateStatus:0
      },
      success(res){
        wx.showModal({
          title:'提示',
          content:'发单成功，可到我的-发单详情查看',
          showCancel:false
        })
        that.addStar()
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
    var that = this, app = getApp(),ratecount;    
    ratecount = app.globalData.rateCount
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
            if(ratecount){
              wx.showModal({
                title:'提示',
                content:'是否使用快速发单券？',
                showCancel:true,
                success(res){
                  if(res.confirm){
                    ratecount -= 1
                    app.globalData.rateCount = ratecount
                    that.setData({
                      modalHidden: false
                    })
                  }else{
                    that.add()
                  }
                  
                }
              })
            }            
          }          
        },
        fail(res) {
          console.log("获取数据失败", res)
        }
      })
      
    } 
  },


//指定接单人
  zhiBtn(e){
    var that = this 
    that.update()
    var app = getApp(),Sno
    Sno = app.globalData.username
    const db = wx.cloud.database()
    db.collection('send').add({
      data: {
        Ono : that.data.Ono,
        ReceiveAddress : that.data.ReceiveAddress,
        Sno : Sno,
        Sphone : that.data.Sphone,
        SendAddress : that.data.SendAddress,
        Remark : that.data.Remark,
        status:1,
        rateStatus:0
      },
      success(res){
        wx.showModal({
          title:'提示',
          content:'发单成功，可到我的-发单详情查看',
          showCancel:false
        })
        that.addStar()
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
    
    //接单人添加一个任务
    db.collection('receive').add({
      data: {
        Ono : that.data.Ono,
        ReceiveAddress: that.data.ReceiveAddress,
        Sno : e.target.dataset.sno,   
        sendSno : Sno,        
        status:0,
        rateStatus:0
      },
      success(res){
        console.log(2222222222,res)
        let sno = e.target.dataset.sno
        that.receiveAddStar(sno)  
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

    that.setData({
      Ono : '',
      ReceiveAddress : '',
      Sphone : '',
      SendAddress : '',
      Remark : '',
      modalHidden: true
    })  
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
    this.getWorker()
  },

  //获取义工表信息
  getWorker(){
    var arr1 = [],arr2 = [], that = this
    const db = wx.cloud.database()
    db.collection('worker').get({
      success(res) {    
          arr1 = res.data
          for(let i =0;i<arr1.length;i++){
            let m = arr1[i].Sno
            arr2.push(m)
          }
          that.getRate(arr2)
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
  },

  getRate(arr2){
    console.log(arr2)
    var that = this, arr = [],arr3 = [], newArr = []
    const db = wx.cloud.database()
    db.collection('rate').orderBy("haveStar","desc").get({
      success(res) {
          arr = res.data
          for(let i=0;i<arr.length;i++){
            let item = arr[i].Sno
            arr3.push(item)
          }
          console.log(arr3)
          for(let i=0;i<arr.length;i++){
            let flag = arr2.includes(arr3[i])
            console.log(flag)
            if(flag){
              newArr.push(arr[i])
            }
          }          
          that.setData({
            arr: newArr
          })
          console.log(that.data.arr)
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
  },

  modalBindcancel:function(){
    this.setData({
      modalHidden:true,
    })
  },

  modalBindaconfirm:function(){
    this.setData({
      modalHidden:true,
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

  }
})
