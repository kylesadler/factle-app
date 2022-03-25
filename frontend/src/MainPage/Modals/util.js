exports.getTimeToMidnight = () => {
  const today = new Date(Date.now());
  return { hours: 23 - today.getHours(), mintues: 59 - today.getMinutes() };
};

exports.copyToClipboard = (string) => {
  if (navigator.clipboard) navigator.clipboard.writeText(string);
};

exports.formatPercent = (num) => {
  // num is decimal
  // e.g. 0.3 => 30%
  return `${Math.round(num * 100)}%`;
};

exports.formatPercent1Decimal = (num) => {
  // num is decimal
  // e.g. 0.3 => 30.0%
  const total = Math.round((!isNaN(num) && num != null ? num : 0) * 1000);
  return `${Math.floor(total / 10)}.${total % 10}%`;
};
