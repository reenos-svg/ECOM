// Function to format date
export const formatDate = (dateString: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const locale = navigator.language; // Get user's locale
    const date = new Date(dateString); // Parse the date string
  
    // Check if the date string is an ISO string with timezone info
    if (
      typeof dateString === "string" &&
      !dateString.includes("Z") &&
      !dateString.includes("+")
    ) {
      // If the date string does not include timezone info, assume it's in UTC
      return new Date(dateString + "Z")
        .toLocaleString(locale, options)
        .replace(",", " at");
    }
  
    return date.toLocaleString(locale, options).replace(",", " at");
  };
  