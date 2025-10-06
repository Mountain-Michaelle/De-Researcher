// utils/serializeBigNumbers.ts
import { BigNumber } from "@ethersproject/bignumber";


export const serializeBigNumbers = (value: any): any => {
  if (value == null) return value;

  // Handle BigInt
  if (typeof value === "bigint") return value.toString();

  // Handle ethers.js BigNumber
  if (BigNumber.isBigNumber(value)) return value.toString();

  // Handle arrays
  if (Array.isArray(value)) return value.map(serializeBigNumbers);

  // Handle objects
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, serializeBigNumbers(val)])
    );
  }

  return value;
};
