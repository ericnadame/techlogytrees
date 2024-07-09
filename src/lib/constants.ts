"use client";

import { filecoinCalibration, hardhat } from "viem/chains";

export const thetaTestnet = {
  id: 365,
  name: "Theta ",
  network: "Theta Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Theta Testnet",
    symbol: "TFUEL",
  },
  rpcUrls: {
    default: {
      http: ["https://eth-rpc-api-testnet.thetatoken.org/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Theta Explorer",
      url: "https://testnet-explorer.thetatoken.org/",
    },
  },
  testnet: true,
};
export const contributionAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "nodeId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
    ],
    name: "ContributionAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "source",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "target",
        type: "string",
      },
    ],
    name: "EdgeAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "nodeId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "nodeType",
        type: "string",
      },
    ],
    name: "NodeAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "nodeId",
        type: "string",
      },
    ],
    name: "NodeFinished",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "nodeId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
    ],
    name: "RfpAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
    ],
    name: "TechTreeAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
    ],
    name: "TechTreeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "nodeId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TreasuryAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "nodeId",
        type: "string",
      },
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
    ],
    name: "addContribution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_source",
        type: "string",
      },
      {
        internalType: "string",
        name: "_target",
        type: "string",
      },
    ],
    name: "addEdge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "nodeId",
        type: "string",
      },
    ],
    name: "addFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_id",
        type: "string",
      },
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_nodeType",
        type: "string",
      },
    ],
    name: "addNode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_id",
        type: "string",
      },
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
    ],
    name: "addRfp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_nodeId",
        type: "string",
      },
    ],
    name: "addTechTree",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "edges",
    outputs: [
      {
        internalType: "string",
        name: "source",
        type: "string",
      },
      {
        internalType: "string",
        name: "target",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "creationTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "nodeId",
        type: "string",
      },
    ],
    name: "finishNode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
    ],
    name: "getEdgesByTechTreeId",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "source",
            type: "string",
          },
          {
            internalType: "string",
            name: "target",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "techTreeId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "creationTime",
            type: "uint256",
          },
        ],
        internalType: "struct Contribution.Edge[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "nodeId",
        type: "string",
      },
    ],
    name: "getNode",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "nodeType",
            type: "string",
          },
          {
            components: [
              {
                internalType: "address",
                name: "contributor",
                type: "address",
              },
              {
                internalType: "string",
                name: "ipfsHash",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "createdAt",
                type: "uint256",
              },
            ],
            internalType: "struct Contribution.ContributionDetail[]",
            name: "contributions",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "createdBy",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isFinished",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "techTreeId",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "funder",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "fundedAt",
                type: "uint256",
              },
            ],
            internalType: "struct Contribution.Treasury",
            name: "treasury",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "writer",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "createdAt",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "ipfsHash",
                type: "string",
              },
            ],
            internalType: "struct Contribution.RFP",
            name: "rfp",
            type: "tuple",
          },
        ],
        internalType: "struct Contribution.NodeLite",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
    ],
    name: "getNodesAndEdgesFromTechTreeId",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "nodeType",
            type: "string",
          },
          {
            components: [
              {
                internalType: "address",
                name: "contributor",
                type: "address",
              },
              {
                internalType: "string",
                name: "ipfsHash",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "createdAt",
                type: "uint256",
              },
            ],
            internalType: "struct Contribution.ContributionDetail[]",
            name: "contributions",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "createdBy",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isFinished",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "techTreeId",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "funder",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "fundedAt",
                type: "uint256",
              },
            ],
            internalType: "struct Contribution.Treasury",
            name: "treasury",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "writer",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "createdAt",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "ipfsHash",
                type: "string",
              },
            ],
            internalType: "struct Contribution.RFP",
            name: "rfp",
            type: "tuple",
          },
        ],
        internalType: "struct Contribution.NodeLite[]",
        name: "",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "string",
            name: "source",
            type: "string",
          },
          {
            internalType: "string",
            name: "target",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "techTreeId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "creationTime",
            type: "uint256",
          },
        ],
        internalType: "struct Contribution.Edge[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
    ],
    name: "getNodesByTechTreeId",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "nodeType",
            type: "string",
          },
          {
            components: [
              {
                internalType: "address",
                name: "contributor",
                type: "address",
              },
              {
                internalType: "string",
                name: "ipfsHash",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "createdAt",
                type: "uint256",
              },
            ],
            internalType: "struct Contribution.ContributionDetail[]",
            name: "contributions",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "createdBy",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isFinished",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "techTreeId",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "funder",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "fundedAt",
                type: "uint256",
              },
            ],
            internalType: "struct Contribution.Treasury",
            name: "treasury",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "writer",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "createdAt",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "ipfsHash",
                type: "string",
              },
            ],
            internalType: "struct Contribution.RFP",
            name: "rfp",
            type: "tuple",
          },
        ],
        internalType: "struct Contribution.NodeLite[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
    ],
    name: "getTechTree",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        internalType: "struct Contribution.TechTree",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTechTrees",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        internalType: "struct Contribution.TechTree[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nodeIndex",
        type: "uint256",
      },
    ],
    name: "getUserNodePoints",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "nodes",
    outputs: [
      {
        internalType: "string",
        name: "id",
        type: "string",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "nodeType",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isFinished",
        type: "bool",
      },
      {
        components: [
          {
            internalType: "address",
            name: "funder",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fundedAt",
            type: "uint256",
          },
        ],
        internalType: "struct Contribution.Treasury",
        name: "treasury",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address",
            name: "writer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
        ],
        internalType: "struct Contribution.RFP",
        name: "rfp",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "techTrees",
    outputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "techTreeId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "nodeType",
            type: "string",
          },
        ],
        internalType: "struct Contribution.NodeInput[]",
        name: "_nodes",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "string",
            name: "source",
            type: "string",
          },
          {
            internalType: "string",
            name: "target",
            type: "string",
          },
        ],
        internalType: "struct Contribution.EdgeInput[]",
        name: "_edges",
        type: "tuple[]",
      },
    ],
    name: "updateTechTree",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userNodePoints",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const contributionContractAddress = !!process.env.NEXT_PUBLIC_IS_LOCAL
  ? "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  : "0xa0697da50Fc9fb14D4941e55c7623AA6736A6F40";

// export const chainOptions = [hardhat, filecoinCalibration, thetaTestnet];
export const chainOptions = [thetaTestnet];
