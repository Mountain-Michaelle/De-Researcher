// types/data.ts

// Define Token type
export interface TokenData {
  readonly image: string;
  readonly name: string;
}

// Define Card type
export interface CardData {
  readonly step: string;
  readonly title: string;
  readonly description: string;
}

// Typed array of tokens
export const tokenData: readonly TokenData[] = [
  { image: '/tokens/tether.svg', name: 'tether' },
  { image: '/tokens/augur-repo.svg', name: 'augur' },
  { image: '/tokens/binance-coin.svg', name: 'binance-coin' },
  { image: '/tokens/binance-busd.svg', name: 'busd' },
  { image: '/tokens/bitcoin.svg', name: 'btc' },
  { image: '/tokens/eidoo.svg', name: 'eido' },
  { image: '/tokens/etherium-classic.svg', name: 'etherium' },
  { image: '/tokens/ios-token.svg', name: 'ios-token' },
  { image: '/tokens/matic-network.svg', name: 'matic-network' },
  { image: '/tokens/multi-collateral.svg', name: 'multi-collateral' },
  { image: '/tokens/potcoin.svg', name: 'potcoin' },
  { image: '/tokens/storg.svg', name: 'storg' },
  { image: '/tokens/tokenpay.svg', name: 'tokenpay' },
] as const;

// Typed array of cards
export const cardData: readonly CardData[] = [
  {
    step: "Step 1",
    title: "Submit Your Research Project",
    description:
      "Create a project proposal with clear requirements. Commit a number of tokens as rewards to attract researchers from our community.",
  },
  {
    step: "Step 2",
    title: "Contribute to Research",
    description:
      "Contributions are made to fulfill the project's requirements, with tokens distributed based on the quality and depth of each contribution.",
  },
  {
    step: "Step 3",
    title: "Verify & Earn",
    description:
      "Other researchers in the community verify the contributions. Verification is rewarded with additional tokens, ensuring quality control and maintaining research standards.",
  },
] as const;
