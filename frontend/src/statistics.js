exports.getStatistics = () => {
  var localStorage;
  try {
    localStorage = window.localStorage;
  } catch (e) {
    // Access denied :-(
  }

  if (!localStorage) return {};

  try {
    return JSON.parse(localStorage.getItem("factle-app-statistics") || {});
  } catch {
    return {};
  }
};

exports.setStatistics = (object) => {
  var localStorage;
  try {
    localStorage = window.localStorage;
  } catch (e) {
    // Access denied :-(
  }

  if (!localStorage) return;

  return localStorage.setItem("factle-app-statistics", JSON.stringify(object));
};
