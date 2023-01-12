export function convertTimeStringToMinutes(timeString: string) {
  // dive onde tem ":" usando o split
  const [hours, minutes] = timeString.split(":").map((item) => Number(item));

  return hours * 60 + minutes;
}
