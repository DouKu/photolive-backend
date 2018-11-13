// 获取某年某个月的天数
function getMondays (year, month) {
  let mday = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) mday[1] = 29;
  return mday[month - 1];
}

/**
 * 获取某一天是星期几
 * @param {int} y 年
 * @param {int} m 月
 * @param {int} d 第几天
 */
function weekNumber (y, m, d) {
  let wk = null;
  if (m <= 12 && m >= 1) {
    for (let i = 1; i < m; ++i) {
      d += getMondays(y, i);
    }
  }
  /* 根据日期计算星期的公式 */
  wk = (y - 1 + (y - 1) / 4 - (y - 1) / 100 + (y - 1) / 400 + d) % 7;
  // 0对应星期天，1对应星期一
  return parseInt(wk);
}

// 一个小时多少秒
function hourSecond () {
  return 3600;
}

// 一天多少秒
function daySecond () {
  return 86400;
}

function getDaysSecond (Days) {
  return 86400 * Days;
}

export {
  getMondays,
  weekNumber,
  hourSecond,
  daySecond,
  getDaysSecond
};
