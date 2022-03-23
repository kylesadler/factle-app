exports.getMMDDYYYY = () => {
  const centralTime = new Date();
  // new Date().getTime() + new Date().getTimezoneOffset() * 60000 + 3600000 * -6

  var dd = String(centralTime.getDate()).padStart(2, "0");
  var mm = String(centralTime.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = centralTime.getFullYear();

  return `${mm}/${dd}/${yyyy}`;

  // "03/09/2022", for example
};
