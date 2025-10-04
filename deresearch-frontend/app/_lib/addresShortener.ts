/**
 * Shortens an Ethereum address for display purposes.
 * Example: 0x1234...abcd
 *
 * @param address - The full Ethereum address
 * @param chars - Number of characters to show at start and end (default: 4)
 * @returns Shortened address string or empty string if invalid
 */
export const shortenAddress = (address: string | undefined, chars: number = 4): string => {
  if (!address || typeof address !== "string") return "";

  // Ensure it's a valid-looking address
  if (!address.startsWith("0x") || address.length < chars * 2 + 2) {
    return address;
  }

  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};
