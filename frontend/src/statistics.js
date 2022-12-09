exports.getStatistics = () => {
  let localStorage;
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
  let localStorage;
  try {
    localStorage = window.localStorage;
  } catch (e) {
    // Access denied :-(
  }

  if (!localStorage) return;

  return localStorage.setItem("factle-app-statistics", JSON.stringify(object));
};
