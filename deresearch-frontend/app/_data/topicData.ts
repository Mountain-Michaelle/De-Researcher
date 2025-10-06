
export interface topicData {
  readonly title: string;
  readonly id: number;
}

export interface SubTopic {
  title: string;
  author: string;
  date: string;
  ttc: string; // total token committed
  tp: string;  // total participants
  milestone: string;
}

export interface Topic {
  title: string;
  subData?: SubTopic[]; // optional, since some topics have none
}
export const topicHeader: readonly topicData[] = [
    {
        title: 'Latest Projects',
        id: 1
    },
    {
        title: 'Participating',
        id: 2
    },
    {
        title: 'My Projects',
        id: 3
    },
]


export const topicData: Topic[] = [
  {
    title: "Billing System",
    subData: [
      {
        title: "Blockchain-based Voting System",
        author: "Mountain Michael",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
      {
        title: "Blockchain-based Voting System",
        author: "Jude Hilda",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
      {
        title: "Blockchain-based Voting System",
        author: "Mount Mike",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
      {
        title: "Blockchain-based Voting System",
        author: "Mountain Michael",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
    ],
  },
  {
    title: "Functional Decentralized System",
  },
  {
    title: "Resize of the Mould",
  },
];

export const topicData2: Topic[] = [
  {
    title: "Almighty Block",
    subData: [
      {
        title: "Blockchain-based Voting System",
        author: "Mountain Michael",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
      {
        title: "Blockchain-based Voting System",
        author: "Jude Hilda",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
      {
        title: "Devop in need",
        author: "Mount Mike",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
      {
        title: "Block Research World",
        author: "Mountain Michael",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
    ],
  },
  {
    title: "Participating",
    subData: [
      {
        title: "Blockchain-based Voting System",
        author: "Mountain Michael",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
      {
        title: "Blockchain-based Voting System",
        author: "Mountain Michael",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
      {
        title: "Blockchain-based Voting System",
        author: "Mountain Michael",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
      {
        title: "Blockchain-based Voting System",
        author: "Mountain Michael",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
    ],
  },
  {
    title: "My Projects",
    subData: [
      {
        title: "Blockchain-based Voting System",
        author: "Mountain Michael",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
      {
        title: "Blockchain-based Voting System",
        author: "Mountain Michael",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
      {
        title: "Blockchain-based Voting System",
        author: "Mountain Michael",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
      {
        title: "Blockchain-based Voting System",
        author: "Mountain Michael",
        date: "July, 2024",
        ttc: "200,000 RWA",
        tp: "2392",
        milestone: "23 of 300",
      },
    ],
  },
];
