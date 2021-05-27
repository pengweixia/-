// pages/complain/complain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    value: ''
  },

  onClick() {
    var that = this
    const db = wx.cloud.database()
    db.collection('user').where({
      Sno: that.data.value,
    }).get({
      success(res) {
        if(res.data.length){
          let msg = res.data[0].Phone
          wx.showModal({
            title:'提示',
            content:'该用户的联系方式为：'+msg,
            showCancel:false,
            success (res) {
            }
          })
        }else{
          wx.showModal({
            title:'提示',
            content:'不存在该账户，请确认账号输入正确',
            showCancel:false,
            success (res) {
            }
          })
        }
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
  },

  onSearch() {
    this.onClick()
  },

  onChange(e) {
    this.setData({
      value: e.detail,
    });
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
    var that = this
    that.initList()
  },

  initList(){
    var that = this
    const db = wx.cloud.database()
    db.collection('complainList').where({status: 0}).get({
      success(res) {    
        if(res.data.length){
          that.setData({
            array: res.data           
          })      
        }         
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
  },

//投诉人过失
  fadan(e){
    var that = this,complainer = e.target.dataset.complainer,count,id1 = e.target.dataset.id,id
    const db = wx.cloud.database()
    db.collection('user').where({Sno: complainer}).get({
      success(res) {    
        if(res.data.length){
            count = res.data[0].count
            id = res.data[0]._id
            that.updateCount(count,id)
            that.initList()
        }         
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })    
    that.changeStatus(id1)
  },

//被投诉人过失
  jiedan(e){
    var that = this,beComplained = e.target.dataset.beComplained,count,id1 = e.target.dataset.id,id
    const db = wx.cloud.database()
    db.collection('user').where({Sno: beComplained}).get({
      success(res) {    
        if(res.data.length){
            count = res.data[0].count
            id = res.data[0]._id
            that.updateCount(count,id)
            that.initList()
        }         
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })    
    that.changeStatus(id1)
  },

  updateCount(count,id){
    console.log(count,id)
    var newCount = parseInt(count)+1,that = this
    const db = wx.cloud.database()
    db.collection('user').doc(id).update({
      data: {
        count: newCount
      },
      success: function (res) {
        console.log("修改成功")
      }
    })
  },

  changeStatus(id1){
    var id = id1,receiveId,that = this
    const db = wx.cloud.database()
    db.collection('complainList').doc(id).update({
      data: {
        status: 1
      },
      success: function (res) {
        console.log("修改成功")
      }
    })  
    db.collection('complainList').where({_id: id}).get({
      success(res) {    
        if(res.data.length){
            receiveId = res.data[0].receiveId
            that.changeReceiveStatus(receiveId)
        }         
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
  },

  changeReceiveStatus(receiveId){
    var id = receiveId
    const db = wx.cloud.database()
    db.collection('receive').doc(id).update({
      data: {
        status: 10
      },
      success: function (res) {
        console.log("修改成功")
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

  }
})