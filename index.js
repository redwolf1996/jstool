// 日期格式化
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 时间格式化
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

// url参数格式化为json对象
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

// 深度克隆
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}


//  判断输入框数字为正整数或者保留两位小数
export function numFormat(num, math, max, min, normal) {
  //  math保留几位小数
  num = num.replace(/[^\d.]/g, '') //  清除"数字"和"."以外的字符
  // num = num.replace(/^[1-9]{1,}\.\d{2}$/g, '')
  if (num === '') {
    return normal ? normal : ''
  }
  if (max && num > max) {
    return normal ? normal : ''
  }
  if (min && num < min) {
    return normal ? normal : ''
  }
  return Number(num).toFixed(math)
}

// 日期格式化
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

// 精确计算(加法)
export function accAdd(arg1, arg2) {
  var r1, r2, m, c;
  try {
    r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
}

// 精确计算(减法)
export function accSub(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

// 精确计算(乘法)
export function accMul(arg1, arg2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  }
  catch (e) {
  }
  try {
    m += s2.split(".")[1].length;
  }
  catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

// 精确计算(除法)
export function accDiv(arg1, arg2) {
  var t1 = 0, t2 = 0, r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
  }
  try {
    t2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
  }
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

// 获取两个日期之间的所有日期组成的数组
export function getBetweenDateStr(start, end) {
  let result = [];
  let beginDay = start.split("-");
  let endDay = end.split("-");
  let diffDay = new Date();
  let dateList = new Array;
  let i = 0;
  diffDay.setDate(beginDay[2]);
  diffDay.setMonth(beginDay[1] - 1);
  diffDay.setFullYear(beginDay[0]);
  result.push(start);
  while (i == 0) {
    let countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
    diffDay.setTime(countDay);
    dateList[2] = diffDay.getDate();
    dateList[1] = diffDay.getMonth() + 1;
    dateList[0] = diffDay.getFullYear();
    if (String(dateList[1]).length == 1) { dateList[1] = "0" + dateList[1] };
    if (String(dateList[2]).length == 1) { dateList[2] = "0" + dateList[2] };
    result.push(dateList[0] + "-" + dateList[1] + "-" + dateList[2]);
    if (dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]) {
      i = 1;
    }
  };
  return result;
}

// 转换人民币数字中文写法
export function convertCurrency(money) {
  let arr = String(money).split('.')
  if (arr.length == 1 || Number(money) > 99999.99) {
    return false
  }
  let leftArr = []
  let rightArr = []
  let leftStr = arr[0]

  let rightStr = arr[1]
  let cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']

  for (let i = 0; i <= 7 - leftStr.length; i++) {
    leftStr = '0' + leftStr
  }

  for (let j = 0; j < 5; j++) {
    leftArr.push(cnNums[parseInt(leftStr[j])])
  }

  for (let k = 0; k < 2; k++) {
    rightArr.push(cnNums[parseInt(rightStr[k])])
  }

  let out = leftArr.concat(rightArr)
  return out
}

// 获取链接参数1
export function getQueryString(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
      return decodeURIComponent(r[2]);
  };
  return null;
}

// 获取链接参数2(单页应用接受微信redirect_uri)
export function getQueryArg(attr, splitChar) {
  var query = window.location.search,
    splitChar = splitChar || "&",
    attrArr = [],
    attrObj = {};

  query = query.replace(/^\?/, "");
  attrArr = query.split(splitChar);
  for (var i = attrArr.length - 1; i >= 0; i--) {
    attrObj[attrArr[i].split("=")[0]] = attrArr[i].split("=")[1];
  }

  return attrObj[attr] || "";
}

// 获取链接参数3
export function getQueryVariable(variable)
{
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
          var pair = vars[i].split("=");
          if(pair[0] == variable){return pair[1];}
  }
  return false
}

// 上传图片校验
export function beforeImgUpload(file, object) {
  let that = object
  const isJPG = file.type == 'image/jpeg' || 'image/jpg'
  const isPNG = file.type == 'image/png'
  const isBMP = file.type == 'image/bmp'
  const isGIF = file.type == 'image/gif'
  const isLt2M = (file.size / 1024 / 1024) > 10
  if (!isPNG && !isJPG && !isBMP && !isGIF) {
    that.$notify({ type: 'danger', message: '仅支持jpg、png、jpeg、bmp、gif格式!' })
    return false
  }
  if (isLt2M) {
    that.$notify({ type: 'danger', message: '上传失败，每张不得超出10M！' })
    return false
  }
  return true
}

// 上传视频校验
export function beforeVideoUpload(file, object) {
  let that = object
  const isVideo = file.type == 'video/mp4' || 'video/mov'
  const isLt2M = (file.size / 1024 / 1024) > 30

  if (!isVideo) {
    that.$notify({ type: 'danger', message: '文件格式不对，请上传正确的mp4或mov格式文件' })
    return false
  }

  if (isLt2M) {
    that.$notify({ type: 'danger', message: '上传失败，视频不得超出30M！' })
    return false
  }
  return true
}
