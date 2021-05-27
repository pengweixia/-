// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser:true
})

//初始化云函数
const db = cloud.database
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return cloud.database().collection("worker").aggregate() //选择我的审批表
          .lookup({
            from:"rate", //把tb_user用户表关联上
            localField: 'Sno', //审批表的关联字段
            foreignField: 'Sno', //用户表的关联字段
            as: 'arr' //匹配的结果作为uapproval相当于起个别名
          }).end({
            success:function(res){
              return res;
            },
            fail(error) {
              return error;
            }
          })

}