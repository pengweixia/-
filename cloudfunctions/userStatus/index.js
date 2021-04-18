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

  return await db.collection(event.type).aggregate()
  .lookup({
    from: 'status',
      localField: 'username',
      foreignField: 'Sno',
      as: 'statusList',
  })
  .match({
    username:event.username
  })
  .end()
}