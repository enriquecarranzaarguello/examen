const formatDepartureTime = (timeString: string) => {
  return timeString.substring(
    0,
    timeString.indexOf(':', timeString.indexOf(':') + 1)
  );
};

export default formatDepartureTime;
