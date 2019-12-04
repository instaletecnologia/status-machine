export const formatSeconds = (seconds) => {
  // day, h, m and s
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * (24 * 60 * 60);
  const hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * (60 * 60);
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return `${(days > 0 ? `${days}d ` : '') + hours}h ${minutes}m`;
};

export const isInt = n => n % 1 === 0;
