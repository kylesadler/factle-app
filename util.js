exports.getLocalMMDDYYYY = () => {
  return dateToMMDDYYYY(new Date());
};

const dateToMMDDYYYY = (currentTime) => {
  // "03/09/2022", for example
  // currentTime is Date object
  const dd = String(currentTime.getDate()).padStart(2, "0");
  const mm = String(currentTime.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = currentTime.getFullYear();

  return `${mm}/${dd}/${yyyy}`;
};
exports.dateToMMDDYYYY = dateToMMDDYYYY;

const getCentralTime = () => {
  const currentTime = new Date();
  return new Date(
    currentTime.getTime() +
      currentTime.getTimezoneOffset() * 60000 +
      3600000 * -6
  );
};
exports.getCentralTime = getCentralTime;

exports.getCentralTimeMMDDYYYY = () => {
  const centralTime = getCentralTime();
  return dateToMMDDYYYY(centralTime);
};
