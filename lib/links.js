// Treat email addresses as addresses, never as mailto query parameters.
export function emailLink(address) {
  return `mailto:${encodeURIComponent(address).replaceAll("%40", "@")}`;
}
