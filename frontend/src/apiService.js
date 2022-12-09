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

exports.sendGameResults = (results) => {
  return postData("/api/send-game-results", results);
};

exports.getRowPercentiles = (results) => {
  return postData("/api/get-row-precentiles", results);
};
