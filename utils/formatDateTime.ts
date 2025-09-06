export function convertToTime(timestamp: number) {
  const date = new Date(timestamp * 1000);

  const formattedTime = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return formattedTime;
}
