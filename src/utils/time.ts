export const formatTimeAgo = (createdAt: string): string => {
  const date = new Date(createdAt);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;

  if (diff < minute) {
    return "just now";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}${minutes === 1 ? "m" : "m"}`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}${hours === 1 ? "h" : "h"}`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days}${days === 1 ? "d" : "d"}`;
  } else if (diff < month) {
    const weeks = Math.floor(diff / week);
    return `${weeks}${weeks === 1 ? "w" : "w"}`;
  } else {
    const months = Math.floor(diff / month);
    return `${months}${months === 1 ? "m" : "m"}`;
  }
};
