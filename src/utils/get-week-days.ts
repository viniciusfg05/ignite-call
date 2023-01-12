export function getWeekDays(): any {
  const formatted = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });

  return Array.from(Array(7).keys())
    .map((day) => formatted.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekday) => {
      return weekday
        .substring(0, 1)
        .toLocaleUpperCase()
        .concat(weekday.substring(1));
    });
}
