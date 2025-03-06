const formatDate = function (date) {
  let taskStartTime
  if (date.getMonth() < 9) {
    taskStartTime = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-'
  } else {
    taskStartTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-'
  }
  if (date.getDate() < 10) {
    taskStartTime += '0' + date.getDate()
  } else {
    taskStartTime += date.getDate()
  }
  taskStartTime += ' ' + date.getHours() + ':' + date.getMinutes()
  return taskStartTime
}

// 需要导出
module.exports = {
  formatDate,
}
