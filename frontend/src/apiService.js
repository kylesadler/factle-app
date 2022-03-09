// Example POST method implementation:
const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

exports.getAppData = () => {
  return new Promise((resolve, reject) => {
    fetch("/api/get-app-data")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        resolve(data);
      })
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
};

exports.sendGameResults = (results, date) => {
  return postData("/api/send-game-results", { board: results, date });
};
