Page({
  onLoad (query) {
    // 这里的 query 将是 url 中，问号(?) 后面的键值对组成的一个对象
    // query = {type: 'worker'}
    this.setData({
      type: query.type
    });
  }
});