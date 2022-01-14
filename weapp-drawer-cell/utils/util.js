const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isEmpty(obj) {
  if (
    typeof obj == "undefined" ||
    (!obj && typeof obj != "undefined" && obj != 0) ||
    obj == null
  ) {
    return true;
  }
  for (let i in obj) {
    return false;
  }
  if (typeof obj === "number") {
    return false;
  }
  return true;
}

function isNotEmpty(obj) {
  return !isEmpty(obj);
}


module.exports = {
  isEmpty: isEmpty,
  isNotEmpty: isNotEmpty,
  formatTime: formatTime
}
