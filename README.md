# Theta Hackathon-2024: Decentralized Technology Tree

## Decentralized Scientific Collaboration

The Decentralized Technology Tree project aims to create a platform that enables updatable maps of technological progress. Users can contribute, fund, and earn rewards based on their participation, driving collaborative growth and tackling futuristic technologies with precision.

## Getting Started

### Prerequisites

- **Node.js**: [Download and install Node.js](https://nodejs.org/en/download/)
- **MetaMask**: [Install MetaMask](https://metamask.io/download.html)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ericnadem/technologytree.git
cd technologytree
yarn install
```

### App Setup

Set up environment variables:

```bash
cd packages/app
cp .env.example .env
```

### Thirdweb Setup

An API key is required to use web3 authentication and other services. You can get an API key by signing up at [Thirdweb](https://thirdweb.io/).

### Web3 Configuration

All configuration can be found in `/src/lib/constants.ts`.

### Contracts

All contracts can be found in `/src/lib/contracts`.

## Contribution Contract

The Contribution contract is central to managing the technology tree's structure and collaborative interactions. It handles the creation and maintenance of nodes and edges within the technology trees. Each node represents a technology or sub-field and contains details such as title, creator, type, and contributions from users stored as IPFS hashes. Contributions can be tracked and incentivized through a points system managed by the contract.

This contract also handles RFPs (Requests for Proposals) for new content or features, enabling decentralized decision-making. Funding mechanisms are incorporated into nodes through the Treasury struct, allowing funders to finance specific nodes, with transactions timestamped and recorded transparently.

Events are emitted for significant actions like adding nodes, edges, contributions, and funding, providing a comprehensive audit trail for all changes made within the platform.

## Overall Functionality

Together, these contracts form a robust framework for a decentralized, collaborative platform where contributors can add value and receive incentives in a transparent and secure manner. The integration of blockchain technology ensures that all interactions within the technology tree are immutable and traceable, fostering trust and encouraging active participation from the community.

This system not only facilitates technological documentation and innovation but also aligns contributor incentives with the platform's growth and success, ensuring sustained engagement and development.

## Tech Edge Cloud

### Theta Edge Cloud Model Deployment with Llama 3 8B

We used the Llama 3 8B model on the Theta Edge Cloud deployment to generate the nodes for the research. This integration allows for efficient and scalable generation of research nodes, leveraging the advanced capabilities of the Llama 3 8B model for high-quality, precise outputs.
