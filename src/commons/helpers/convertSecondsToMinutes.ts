export const convertSecondsToMinutes = (seconds: number) => {
  const secondsPerMinute = 60;

  return Math.floor(seconds / secondsPerMinute);
};
