/**
 * Sanitises strings to prevent formula injection when opening CSV files in Microsoft Excel or LibreOffice.
 */
export function sanitizeForCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  // If the cell begins with dangerous formula triggers (=, +, -, @, tab, carriage return), prefix with a single apostrophe
  const dangerousPrefixes = ['=', '+', '-', '@', '\t', '\r'];
  let clean = str.replace(/"/g, '""');
  if (dangerousPrefixes.some(prefix => clean.startsWith(prefix))) {
    clean = `'${clean}`;
  }
  return `"${clean}"`;
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate human-readable enquiry reference code in SW-YYYYMMDD-XXXX format
 */
export function generateLocalEnquiryReference(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randSeq = Math.floor(1000 + Math.random() * 9000);
  return `SW-${year}${month}${day}-${randSeq}`;
}
