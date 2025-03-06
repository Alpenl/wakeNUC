## 请求方式

1. 在 `utils/api.js` 中，请求首先通过 `sign_data` 函数进行签名：

```javascript:utils/api.js
function sign_data(url, params, key) {
  params.ts = Date.now();
  params.key = key;
  const list = [];
  for (let i in params) {
    list.push(i + '=' + encodeURIComponent(params[i]));
  }
  list.sort();
  params.sign = md5.hexMD5('/' + encodeURI(url) + list.join('&') + 'app_secret');
  return params;
}
```

签名过程包括:
- 添加时间戳 ts 和 key 参数
- 将所有参数按键值对格式化并排序
- 使用 MD5 对 URL、参数和密钥进行哈希

2. 对于 POST 请求，签名参数会被附加到 URL 中:

```javascript:utils/api.js
url: aprUrl + 
  option.url +
  (option.method == 'POST' 
    ? '?key=' + data.key + '&ts=' + data.ts + '&sign=' + data.sign 
    : '')
```

3. 对于 GET 请求，签名参数会被包含在请求数据中:

```javascript:utils/api.js
data: option.method == 'POST' ? option.data : data
```

主要安全特点:

1. 使用时间戳防止重放攻击
2. 对参数进行排序以确保签名一致性
3. 使用 MD5 哈希算法加密
4. 包含密钥(key)进行身份验证
5. URL 编码防止特殊字符问题

这种签名机制可以:
- 验证请求的完整性
- 防止请求被篡改
- 提供基本的身份认证
- 防止重放攻击
