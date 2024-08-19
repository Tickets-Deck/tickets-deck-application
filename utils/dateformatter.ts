export const formattedDateForApi = (selectedDate: Date) =>
  new Date(
    Date.UTC(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedDate.getHours(),
      selectedDate.getMinutes(),
      selectedDate.getSeconds()
    )
  );
