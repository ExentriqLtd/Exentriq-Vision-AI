export const getDateWithUTCOffset = () => {
  const now = new Date();
  const offsetInMilliseconds = now.getTimezoneOffset() * 60 * 1000;
  const utcDate = new Date(now.getTime() + offsetInMilliseconds);
  return utcDate;
};
export const formatDisplayDate = (dateToDisplay: string | Date) => {
  // Converti la stringa o l'oggetto Date in un oggetto Date
  const datetime = new Date(dateToDisplay);

  if (isNaN(datetime.getTime())) {
    return { formattedDate: "Invalid date", formattedTime: "" };
  }

  // Controlla se la data è in formato UTC (ISO 8601 con "Z")  
  const isUTCFormat = typeof dateToDisplay === "string" && dateToDisplay.endsWith("Z");

  // Se la data NON è in UTC, aggiungi un'ora
  if (!isUTCFormat) {
    datetime.setHours(datetime.getHours() + 1);
  }

  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Opzioni per il formato della data
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: userTimezone,
  };

  // Opzioni per il formato dell'ora
  const timeFormatOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: userTimezone,
  };

  // Converti la data nei formati desiderati
  const formattedDate = new Intl.DateTimeFormat("en-US", dateFormatOptions).format(datetime);
  const formattedTime = new Intl.DateTimeFormat("en-US", timeFormatOptions).format(datetime);

  return { formattedDate, formattedTime };
};


export const formatDate = (dataString: string) => {
  const data = new Date();

  const d = String(data.getDate()).padStart(2, '0');
  const m = String(data.getMonth() + 1).padStart(2, '0'); // I mesi partono da 0
  const y = data.getFullYear();

  const dataFormatted = `${d}-${m}-${y}`;
  return dataFormatted
}

