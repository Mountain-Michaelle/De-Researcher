

export function formatEt(value, decimals = 4) {
  try {
    const ethValue = ethers.formatEther(value);
    return parseFloat(ethValue).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
  } catch {
    return "0";
  }
}

import { ethers, BigNumberish } from "ethers";

export function formatEth(value: BigNumberish, decimals: number = 4): string {
  try {
    const ethValue = ethers.formatEther(value);
    const parsed = parseFloat(ethValue);

    return parsed.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
  } catch {
    return "0";
  }
}
