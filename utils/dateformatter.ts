import moment, { Moment } from 'moment';
  
export const formattedDateForApi = (selectedDate: Date | Moment) => selectedDate;


/**
 * Formats a database date (assuming it's stored in local time) for display.
 * @param dbDate - Date from DB (e.g., "2024-10-05 23:00:00.000")
 * @param format - Moment.js format (default: "LT" → "11:00 PM")
 */
export function formatStoredDate(
  dbDate: string | Date,
  format: string = "LT"
): string {
  // Parse without timezone conversion (treats time as-is)
//   return moment.parseZone(dbDate).format(format);
// return moment.utc(dbDate).local().format(format)
return moment(dbDate).format(format);
}