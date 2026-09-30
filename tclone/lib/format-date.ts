export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  const day = date.getDate();
  const month = date.getMonth() + 1; // months are 0-indexed
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}