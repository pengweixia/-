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
    rateContent: '',
    beComplained:'',
    beRated:'',
    Ono:'',
    id:'',
    rateId: '',
    rateHidden: true,
    value: 3,
    haveStar:'0',
    isExist: true,
    status: '',
    isRate: false,
    isComplain: false,
    sendId:''
  },

  complainContent(e){
    this.setData({
      complainContent:e.detail.value
    });
  },

  rateContent(e){
    this.setData({
      rateContent:e.detail.value
    });
  },

  rateChange(e) {
    this.setData({
      value: e.detail,
    });
    console.log(555555555,e.detail)
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
    //全部接单
    that.initJieDanList()

    //全部发单
    that.initFaDanList()
    
  },

  initJieDanList(){
    var that = this
    var app = getApp(),username=''
    username = app.globalData.username
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

  initFaDanList(){
    var that = this
    var app = getApp(),username=''
    username = app.globalData.username
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
    var app = getApp(),username=''
    username = app.globalData.username
    var that = this
    var id = e.target.dataset.id
    const db = wx.cloud.database()
    db.collection('receive').doc(id).update({
      data: {
        status: 1
      },
      success: function (res) {
        console.log("修改成功", res)
        that.initJieDanList(username)
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
          that.initFaDanList()
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
          that.initJieDanList()
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
      var that = this    
      var Ono = e.target.dataset.ono 
      let app =  getApp(),Sno
      Sno = app.globalData.username
      var beComplained,id,status,sendId
      if(Sno == e.target.dataset.sno){
        if(e.target.dataset.sendsno){
          id = e.target.dataset.id
          beComplained = e.target.dataset.sendsno
          status = e.target.dataset.status
          const db1 = wx.cloud.database()
          db1.collection('send').where({
            Sno: e.target.dataset.sendsno,
            Ono: e.target.dataset.ono
          }).get({
            success(res) {    
              if(res.data.length){
                sendId = res.data[0]._id
                that.setData({
                  modalHidden:false,
                  beComplained : beComplained,   
                  Ono: Ono,
                  id:id,
                  status: status,
                  sendId: sendId
                })
              }         
            },
            fail(res) {
              console.log("获取数据失败", res)
            }
          })
        }else{
          sendId = e.target.dataset.id
          const db = wx.cloud.database()
          db.collection('receive').where({
            sendSno: Sno,
            Ono: e.target.dataset.ono
          }).get({
            success(res) { 
              if(res.data.length){
                beComplained = res.data[0].Sno 
                id = res.data[0]._id
                status = res.data[0].status
                that.setData({
                  modalHidden:false,
                  beComplained : beComplained,   
                  Ono: Ono,
                  id:id,
                  status: status,
                  sendId: sendId
                })
              }         
            },
            fail(res) {
              console.log("获取数据失败", res)
            }
          })
        }        
      }else{
        beComplained = e.target.dataset.sno
        that.setData({
          modalHidden:false,
          beComplained : beComplained,   
          Ono: e.target.dataset.ono,
          status: e.target.dataset.status,
        })
      }      
      if(e.target.dataset.status>=3){
        that.setData({
          modalHidden:true,
        })
        if(e.target.dataset.status == 10){
          wx.showModal({
            title:'提示',
            content:'该投诉已被处理，不可撤销',
            showCancel:false,
            success (res) {}
          })
        }else{
          wx.showModal({
            title:'提示',
            content:'确定撤销投诉？',
            showCancel:false,
            success (res) {
              if (res.confirm) {  
                const db3 = wx.cloud.database()
                var id = that.data.id,sendId = that.data.sendId
                console.log("id:"+id)
                db3.collection('receive').doc(id).update({
                  data: {
                    status: 1
                  },
                  success: function (res) {
                    that.initFaDanList()
                    that.initJieDanList()
                    that.setData({
                      isComplain: !that.data.isComplain,
                      modalHidden: true,
                      status: '1'
                    })
                    console.log("修改成功", that.data.status)
                  }
                }) 
                db3.collection('send').doc(sendId).update({
                  data: {
                    status: 3
                  },
                  success: function (res) {
                    that.initFaDanList()
                    that.initJieDanList()
                    that.setData({
                      isComplain: !that.data.isComplain,
                      modalHidden: true,
                      status: '1'
                    })
                    console.log("修改成功", that.data.status)
                  }
                }) 
                db3.collection('complainList').where({receiveId:id}).remove()  
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }          
          })
        }           
      }
      
  },

  //评价
  showModal(e){
    var that = this
    let app =  getApp(),Sno
    Sno = app.globalData.username
    var beRated = '',rateId = '', sendId = ''
    if(Sno == e.target.dataset.sno){
      if(e.target.dataset.sendsno){
        const db1 = wx.cloud.database()
        db1.collection('send').where({
          Sno: e.target.dataset.sendsno,
          Ono: e.target.dataset.ono
        }).get({
          success(res) {    
            if(res.data.length){
              sendId = res.data[0]._id
            }         
          },
          fail(res) {
            console.log("获取数据失败", res)
          }
        })
        beRated = e.target.dataset.sendsno
        rateId = e.target.dataset.id
        that.setData({
          rateHidden: false,
          beRated: beRated,
          rateId: rateId
        })
      }else{
        sendId =  e.target.dataset.id
        const db = wx.cloud.database()
        db.collection('receive').where({
          sendSno: Sno,
          Ono: e.target.dataset.ono,
        }).get({
          success(res) {    
            if(res.data.length){
              beRated = res.data[0].Sno
              rateId = res.data[0]._id   
            }
            that.setData({
              rateHidden: false,
              beRated: beRated,
              rateId: rateId,
              sendId: sendId
            })
            console.log(111111,res.data[0].Sno)        
          },
          fail(res) {
            console.log("获取数据失败", res)
          }
        })
      }        
    }else{
      beRated = e.target.dataset.sno
      that.setData({
        rateHidden: false,
        beRated: beRated,
        sendId: sendId
      })
    }
    console.log(3333333,that.data.beRated,that.data.rateId)
  },

  modalBindcancel:function(){
    this.setData({
      modalHidden:!this.data.modalHidden,
    })
  },

  rateBindcancel:function(){
    this.setData({
      rateHidden:!this.data.rateHidden,
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
      status:0,
      receiveId: that.data.id
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
          that.setData({
            complainContent: ''
          })
          if (res.confirm) {  
            const db3 = wx.cloud.database()
            var id = that.data.id,sendId = that.data.sendId
            console.log("id:"+id)
            db3.collection('receive').doc(id).update({
              data: {
                status: 3
              },
              success: function (res) {
                that.initFaDanList()
                that.initJieDanList()
                that.setData({
                  isComplain: !that.data.isComplain,
                  status: '3'
                })
                console.log("修改成功", that.data.status)
              }
            })
            db3.collection('send').doc(sendId).update({
              data: {
                status: 4
              },
              success: function (res) {
                that.initFaDanList()
                that.initJieDanList()
                that.setData({
                  isComplain: !that.data.isComplain,
                  status: '3'
                })
                console.log("修改成功", that.data.status)
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

  //评价点击确认
  rateBindconfirm(){
    var that = this,id
    that.findBeRated()
    wx.showModal({
      title:'提示',
      content:'评价成功',
      showCancel:false,
      success (res) {
        if (res.confirm) {          
          var haveStar = parseInt(that.data.haveStar)+that.data.value,rateContent = that.data.rateContent
          id = that.data.id
          console.log('haveStar:'+haveStar)
          that.setData({
            isRate: true
          })
          const db3 = wx.cloud.database()
          if(that.data.isExist){
            db3.collection('rate').doc(id).update({
              data: {
                haveStar: haveStar,
                rateContent: rateContent
              },
              success: function (res) {
                that.setData({
                  rateHidden: true
                })
                const db5 = wx.cloud.database()
                var rateId = that.data.rateId, sendId = that.data.sendId
                db5.collection('receive').doc(rateId).update({
                  data: {
                    rateStatus: 5
                  },
                  success: function (res) {
                    that.initFaDanList()
                    that.initJieDanList()
                    console.log("修改成功", res)
                  }
                })  
                db5.collection('send').doc(sendId).update({
                  data: {
                    rateStatus: 5
                  },
                  success: function (res) {
                    that.initFaDanList()
                    that.initJieDanList()
                    console.log("修改成功", res)
                  }
                })          
              },
              fail(res) {
                console.log("请求失败", res)
              }
            }) 
          }else{
            db3.collection('rate').add({
              data: {
                Sno : that.data.beRated,   
                haveStar : haveStar,
                usedStar: 0,
                rateContent: that.data.rateContent, 
              },
              success(){
                that.setData({
                  rateHidden:true,
                  isRate:true
                })
                wx.showModal({
                  title:'提示',
                  content:'评价成功',
                  showCancel:false,
                  success (res) {
                    that.setData({
                      rateHidden: true,
                    })
                    const db5 = wx.cloud.database()
                    var rateId = that.data.rateId,sendId = that.data.sendId
                    db5.collection('receive').doc(rateId).update({
                      data: {
                        rateStatus: 5
                      },
                      success: function (res) {
                        that.initFaDanList()
                        that.initJieDanList()
                        console.log("修改成功", res)
                      }
                    })
                    db5.collection('send').doc(sendId).update({
                      data: {
                        rateStatus: 5
                      },
                      success: function (res) {
                        that.initFaDanList()
                        that.initJieDanList()
                        console.log("修改成功", res)
                      }
                    })     
                  }
                })     
              },
              fail(res) {
                console.log("请求失败", res)
              }
            })            
          } 
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }) 
  },

  findBeRated(){
    var that = this
    const db = wx.cloud.database()
    db.collection('rate').where({
      Sno:that.data.beRated
    }).get({
      success(res) {        
        if(res.data.length){
          that.setData({
            haveStar: res.data[0].haveStar,
            id: res.data[0]._id
          })
        }else{
          that.setData({
            isExist: false
          })
        }
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })    
  },
  
})