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
  // console.log("sending game results", results);
  return postData("/api/send-game-results", results);
};

exports.getRowPercentiles = (results) => {
  // console.log("getting percentiles");
  return postData("/api/get-row-precentiles", results);
};
