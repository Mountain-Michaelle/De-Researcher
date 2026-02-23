import { BigNumber } from "@ethersproject/bignumber";

export type SerializableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | bigint
  | BigNumber
  | SerializableObject
  | SerializableValue[];

export interface SerializableObject {
  [key: string]: SerializableValue;
}

export const serializeBigNumbers = <T extends SerializableValue>(value: T): unknown => {
  if (value == null) return value;

  // Handle BigInt
  if (typeof value === "bigint") return value.toString();

  // Handle ethers.js BigNumber
  if (BigNumber.isBigNumber(value)) return value.toString();

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((v) => serializeBigNumbers(v));
  }

  // Handle objects
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, SerializableValue>).map(([key, val]) => [
        key,
        serializeBigNumbers(val),
      ])
    );
  }

  return value;
};
