export interface BlockchainError extends Error {
  code?: number | string;
  data?: {
    cause?: {
      isBrokenCircuitError?: boolean;
    };
  };
  message: string;
}

export const handleBlockchainError = (err: unknown): string => {
  let message = "An unexpected blockchain error occurred. Please try again.";

  const error = err as BlockchainError;
  const errorMessage = error?.message?.toLowerCase?.() || "";

  // --- Wallet / MetaMask errors ---
  if (typeof window !== "undefined" && !window?.ethereum) {
    message = "No Ethereum wallet detected. Please install MetaMask or connect a wallet.";
  } else if (error?.code === 4001) {
    message = "You rejected the transaction request.";
  } else if (error?.code === 4100) {
    message = "Your wallet is not authorized for this action.";
  } else if (error?.code === 4200) {
    message = "Your wallet does not support this request.";
  } else if (error?.code === 4900) {
    message = "Your wallet is currently disconnected.";
  } else if (error?.code === 4901) {
    message = "Please switch to the correct blockchain network.";
  } else if (error?.code === 4902) {
    message = "The requested network is not added to your wallet.";

  // --- RPC / Node / Provider errors ---
  } else if (error?.data?.cause?.isBrokenCircuitError) {
    message = "The blockchain network is overloaded. Please wait and try again.";
  } else if (error?.code === -32603) {
    message = "Internal RPC error. Try again in a few seconds.";
  } else if (error?.code === -32602) {
    message = "Invalid parameters sent to the blockchain.";
  } else if (error?.code === -32601) {
    message = "This blockchain method is not supported.";
  } else if (error?.code === -32000) {
    message = "Invalid input provided to the provider.";
  } else if (error?.code === -32002) {
    message = "RPC node temporarily unavailable. Please retry.";

  // --- Execution / Transaction errors ---
  } else if (errorMessage.includes("circuit breaker")) {
    message = "Network temporarily paused due to high load. Please retry soon.";
  } else if (errorMessage.includes("nonce too low")) {
    message = "You have pending transactions. Please wait for confirmation.";
  } else if (errorMessage.includes("replacement transaction underpriced")) {
    message = "Pending transaction detected. Wait or increase gas fees.";
  } else if (errorMessage.includes("already known")) {
    message = "Transaction already submitted and pending confirmation.";
  } else if (errorMessage.includes("out of gas")) {
    message = "Transaction ran out of gas. Try increasing gas limit.";
  } else if (errorMessage.includes("execution reverted")) {
    message = "Transaction reverted — contract conditions were not met.";
  } else if (errorMessage.includes("insufficient funds")) {
    message = "Insufficient funds for gas or transaction value.";
  } else if (errorMessage.includes("invalid address")) {
    message = "Invalid wallet or contract address.";
  } else if (errorMessage.includes("invalid opcode")) {
    message = "Smart contract execution failed unexpectedly.";
  } else if (errorMessage.includes("missing revert data")) {
    message = "Transaction failed silently — check contract logic.";
  } else if (errorMessage.includes("underpriced")) {
    message = "Gas price too low — increase and try again.";
  } else if (errorMessage.includes("replacement fee too low")) {
    message = "Replacement transaction fee too low. Use higher gas.";
  } else if (errorMessage.includes("user rejected")) {
    message = "Transaction or signature request was rejected.";
  } else if (errorMessage.includes("failed to fetch")) {
    message = "Network connection failed — check your internet or RPC provider.";
  } else if (errorMessage.includes("call exception")) {
    message = "Transaction failed — check smart contract conditions.";
  } else if (errorMessage.includes("missing provider")) {
    message = "No Ethereum provider found. Please connect your wallet.";
  } else {
    message = "Something went wrong. Please check your network and try again.";
  }

  return message;
};
