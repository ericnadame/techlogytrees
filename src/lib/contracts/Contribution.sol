// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Contribution {

    struct RFP {
        address writer;
        uint256 createdAt;
        string ipfsHash;
    }

    struct Treasury {
        address funder;
        uint256 amount;
        uint256 fundedAt;
    }

    struct ContributionDetail {
        address contributor;
        string ipfsHash;
        uint256 createdAt;
    }

    struct Node {
        string title;
        string nodeType;
        ContributionDetail[] contributions;
        uint256 createdAt;
        address creator;
        bool isFinished;
        Treasury treasury;
        uint256 techTreeId;
        RFP rfp;
        mapping(address => uint256) lastDripBlock;
    }

    struct Edge {
        string source;
        string target;
        uint256 techTreeId;
        address creator;
        uint256 creationTime;
    }

    struct NodeLite {
        string title;
        string nodeType;
        ContributionDetail[] contributions;
        uint256 createdAt;
        address createdBy;
        bool isFinished;
        uint256 techTreeId;
        Treasury treasury;
        RFP rfp;
    }

    struct NodeInput {
        string title;
        string nodeType;
    }

    struct EdgeInput {
        string source;
        string target;
    }

    struct UserNodePoints {
        uint256 points;
        NodeLite node;
    }

    struct TechTree {
        string title;
        uint256 id;
    }

    // we need nodes and edges to be techTreeId dependent and not stored in 1 big array
    mapping(uint256 => Node[]) public nodes;
    mapping(uint256 => Edge[]) public edges;
    TechTree[] public techTrees;

    mapping(address => mapping(uint256 => uint256)) public userNodePoints;

    event NodeAdded(uint256 indexed nodeId, uint256 techTreeId, string title, string nodeType);
    event EdgeAdded(uint256 indexed edgeId, uint256 techTreeId, string source, string target);
    event TechTreeUpdated(uint256 indexed techTreeId);
    event ContributionAdded(address indexed user, uint256 nodeIndex, string ipfsHash);
    event RfpAdded(uint256 indexed nodeIndex, string _ipfsHash);
    event TreasuryAdded(uint256 indexed nodeIndex, uint256 amount);
    event NodeFinished(uint256 indexed nodeId);
    event TechTreeAdded(uint256 indexed techTreeId, string title);

    function addTechTree(string memory _title) public {
        TechTree memory newTechTree = TechTree({ title: _title, id: techTrees.length });
        techTrees.push(newTechTree);
        emit TechTreeAdded(newTechTree.id, _title);
    }

    function addNode(uint256 techTreeId, string memory _title, string memory _nodeType) public {
        require(techTreeId < techTrees.length, "TechTree does not exist");

        Node storage newNode = nodes[techTreeId].push();
        newNode.title = _title;
        newNode.nodeType = _nodeType;
        newNode.createdAt = block.timestamp;
        newNode.creator = msg.sender;
        newNode.isFinished = false;
        newNode.techTreeId = techTreeId;

        uint256 nodeId = nodes[techTreeId].length - 1;

        userNodePoints[msg.sender][nodeId] += 10;
        newNode.lastDripBlock[msg.sender] = block.number;

        emit NodeAdded(nodeId, techTreeId, _title, _nodeType);
    }

    function addRfp(uint256 techTreeId, uint256 nodeIndex, string memory _ipfsHash) public {
        require(nodeIndex < nodes[techTreeId].length, "Node does not exist");

        Node storage node = nodes[techTreeId][nodeIndex];
        node.rfp = RFP({ writer: msg.sender, ipfsHash: _ipfsHash, createdAt: block.timestamp });

        emit RfpAdded(nodeIndex, _ipfsHash);
    }

    function addEdge(uint256 techTreeId, string memory _source, string memory _target) public {
        require(techTreeId < techTrees.length, "TechTree does not exist");

        Edge storage newEdge = edges[techTreeId].push();
        newEdge.source = _source;
        newEdge.target = _target;
        newEdge.techTreeId = techTreeId;

        newEdge.creationTime = block.timestamp;
        newEdge.creator = msg.sender;
        uint256 edgeId = edges[techTreeId].length - 1;

        emit EdgeAdded(edgeId, techTreeId, _source, _target);
    }

    function updateTechTree(uint256 techTreeId, NodeInput[] memory _nodes, EdgeInput[] memory _edges) public {
        require(techTreeId < techTrees.length, "TechTree does not exist");

        for (uint i = 0; i < _nodes.length; i++) {
            addNode(techTreeId, _nodes[i].title, _nodes[i].nodeType);
        }
        for (uint i = 0; i < _edges.length; i++) {
            addEdge(techTreeId, _edges[i].source, _edges[i].target);
        }
        emit TechTreeUpdated(techTreeId);
    }

    function addContribution(uint256 techTreeId, uint256 nodeIndex, string memory _ipfsHash) public {
        require(nodeIndex < nodes[techTreeId].length, "Node does not exist");

        Node storage node = nodes[techTreeId][nodeIndex];
        node.contributions.push(ContributionDetail({
            contributor: msg.sender,
            ipfsHash: _ipfsHash,
            createdAt: block.timestamp
        }));

        userNodePoints[msg.sender][nodeIndex] += 5;
        node.lastDripBlock[msg.sender] = block.number;

        emit ContributionAdded(msg.sender, nodeIndex, _ipfsHash);
    }

    function addFunds(uint256 techTreeId, uint256 nodeIndex) public payable {
        require(nodeIndex < nodes[techTreeId].length, "Node does not exist");
        require(msg.value > 0, "Must send some TFIL to fund the node");

        Node storage node = nodes[techTreeId][nodeIndex];
        require(node.treasury.funder == address(0) || node.treasury.funder == msg.sender, "Only the funder can add more funds");

        if (node.treasury.funder == address(0)) {
            node.treasury = Treasury({ funder: msg.sender, amount: msg.value, fundedAt: block.timestamp });
        } else {
            require(node.treasury.funder == msg.sender, "Only the funder can add more funds");
            node.treasury.amount += msg.value;
        }

        emit TreasuryAdded(nodeIndex, msg.value);
    }

    function finishNode(uint256 techTreeId, uint256 nodeIndex) public {
        require(nodeIndex < nodes[techTreeId].length, "Node does not exist");

        Node storage node = nodes[techTreeId][nodeIndex];
        require(node.treasury.funder == msg.sender, "Only the funder can finish the node");
        node.isFinished = true;

        // Distribute funds to contributors
        for (uint i = 0; i < node.contributions.length; i++) {
            ContributionDetail storage contribution = node.contributions[i];
            address contributor = contribution.contributor;
            uint256 points = userNodePoints[contributor][nodeIndex];
            uint256 share = (node.treasury.amount * points) / 100;
            payable(contributor).transfer(share);
        }

        emit NodeFinished(nodeIndex);
    }

    function getNodesByTechTreeId(uint256 techTreeId) public view returns (NodeLite[] memory) {
        NodeLite[] memory nodesLite = new NodeLite[](nodes[techTreeId].length);
        for (uint i = 0; i < nodes[techTreeId].length; i++) {
            Node storage node = nodes[techTreeId][i];
            if (node.techTreeId == techTreeId) {
                nodesLite[i] = NodeLite({
                    title: node.title,
                    nodeType: node.nodeType,
                    contributions: node.contributions,
                    createdAt: node.createdAt,
                    createdBy: node.creator,
                    isFinished: node.isFinished,
                    treasury: node.treasury,
                    rfp: node.rfp,
                    techTreeId: node.techTreeId
                });
            }
        }
        return nodesLite;
    }

    function getEdgesByTechTreeId(uint256 techTreeId) public view returns (Edge[] memory) {
        Edge[] memory edgesByTechTreeId = new Edge[](edges[techTreeId].length);
        for (uint i = 0; i < edges[techTreeId].length; i++) {
            Edge storage edge = edges[techTreeId][i];
            if (edge.techTreeId == techTreeId) {
                edgesByTechTreeId[i] = Edge({
                    source: edge.source,
                    target: edge.target,
                    techTreeId: edge.techTreeId,
                    creator: edge.creator,
                    creationTime: edge.creationTime
                });
            }
        }
        return edgesByTechTreeId;
    }

    function getNodesAndEdgesFromTechTreeId(uint256 techTreeId) external view returns (NodeLite[] memory, Edge[] memory) {
        NodeLite[] memory nodesLite = getNodesByTechTreeId(techTreeId);
        Edge[] memory edgesByTechTreeId = getEdgesByTechTreeId(techTreeId);
        return (nodesLite, edgesByTechTreeId);
    }

    function getTechTrees() external view returns (TechTree[] memory) {
        return techTrees;
    }

    function getNode(uint256 techTreeId, uint256 nodeIndex) public view returns (NodeLite memory) {
        Node storage node = nodes[techTreeId][nodeIndex];
        NodeLite memory nodeLite = NodeLite({
            title: node.title,
            nodeType: node.nodeType,
            contributions: node.contributions,
            createdAt: node.createdAt,
            createdBy: node.creator,
            isFinished: node.isFinished,
            rfp: node.rfp,
            treasury: node.treasury,
            techTreeId: node.techTreeId
        });
        return nodeLite;
    }

    function getUserNodePoints(address _user, uint256 nodeIndex) external view returns (uint256) {
        return userNodePoints[_user][nodeIndex];
    }

    function getUserParticipatedNodes(uint256 techTreeId, address _user) external view returns (UserNodePoints[] memory) {
        UserNodePoints[] memory userParticipatedNodes = new UserNodePoints[](nodes[techTreeId].length);
        for (uint i = 0; i < nodes[techTreeId].length; i++) {
            if (userNodePoints[_user][i] > 0) {
                NodeLite memory node = getNode(techTreeId, i);
                userParticipatedNodes[i] = UserNodePoints({
                    points: userNodePoints[_user][i],
                    node: node
                });
            }
        }
        return userParticipatedNodes;
    }
}
