const moment = require('moment');
const momenttz = require('moment-timezone');
const TIME_ZONE = 'Asia/Manila';

const toMomentTz = (date) => {
  return momenttz(date).tz(TIME_ZONE);
};

const getDateRange = (date) => {
  return {
    startDate: toMomentTz(date).startOf('day').toDate(),
    endDate: toMomentTz(date).endOf('day').toDate(),
  };
};

const getStartOfDay = (date) => {
  return toMomentTz(date).startOf('day').toDate();
};

const computeAge = (birthdate, referenceDate) => {
  const today = referenceDate ? new Date(referenceDate) : new Date();
  const birthDate = new Date(birthdate);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const computeFullAge = (birthdate, referenceDate) => {
  const today = referenceDate ? new Date(referenceDate) : new Date();
  var yearNow = today.getFullYear();
  var monthNow = today.getMonth();
  var dateNow = today.getDate();

  var yearDob = birthdate.getFullYear();
  var monthDob = birthdate.getMonth();
  var dateDob = birthdate.getDate();

  var yearAge = yearNow - yearDob;

  if (monthNow >= monthDob) var monthAge = monthNow - monthDob;
  else {
    yearAge--;
    var monthAge = 12 + monthNow - monthDob;
  }

  if (dateNow >= dateDob) var dateAge = dateNow - dateDob;
  else {
    monthAge--;
    var temp = new Date(yearNow, monthDob + 1, 1);
    temp.setDate(temp.getDate() - 1);
    var maxDate = temp.getDate();
    var dateAge = maxDate + dateNow - dateDob;

    if (monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }

  return {
    years: yearAge || 0,
    months: monthAge || 0,
    days: dateAge || 0,
  };
};

const isExpired = (date) => {
  return moment().isAfter(moment(date));
};

const formatDateToFormat = (date, format) => {
  return momenttz(date).tz(TIME_ZONE).format(format);
};

const formatDateToMMDDYYYY = (date) => {
  return momenttz(date).tz(TIME_ZONE).format('MM/DD/YYYY');
};

const formatDateToYYYYMMDD = (date) => {
  return momenttz(date).tz(TIME_ZONE).format('YYYY-MM-DD');
};

const getToday = () => {
  return momenttz().tz(TIME_ZONE);
};

const getStartOfYr = () => {
  return moment().tz(TIME_ZONE).startOf('year').toDate();
};

module.exports = {
  toMomentTz,
  computeAge,
  isExpired,
  formatDateToMMDDYYYY,
  getToday,
  getDateRange,
  getStartOfDay,
  getStartOfYr,
  computeFullAge,
  formatDateToYYYYMMDD,
  formatDateToFormat,
};
