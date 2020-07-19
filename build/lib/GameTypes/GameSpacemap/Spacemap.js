"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spacemap = void 0;
const SpacemapNode_1 = require("./SpacemapNode");
class Spacemap {
    constructor() {
        this.registry = new Map();
        this.graph = new Map();
    }
    resolveNodeFromName(name) {
        if (typeof name == "string")
            return this.registry.get(name);
        return name;
    }
    addNode(node) {
        if (this.registry.has(node.Name)) {
            throw new TypeError(`Duplicate spacemap entry for node ${node.Name}`);
        }
        this.registry.set(node.Name, node);
        this.graph.set(node.Name, new Set());
        return this;
    }
    addNodes(nodes) {
        nodes.forEach((node) => {
            if (this.registry.has(node.Name)) {
                throw new TypeError(`Duplicate spacemap entry for node ${node.Name}`);
            }
            this.registry.set(node.Name, node);
            this.graph.set(node.Name, new Set());
        });
        return this;
    }
    addLink(a, b) {
        const aNode = this.resolveNodeFromName(a);
        const bNode = this.resolveNodeFromName(b);
        if (aNode == undefined || bNode == undefined)
            throw new TypeError(`Invalid spacenodes ${a} pr ${b} passed`);
        a = aNode;
        b = bNode;
        if (!(this.registry.has(a.Name) && this.registry.has(a.Name))) {
            throw new TypeError(`Both nodes: ${a.Name} and ${b.Name} must exist for a link to be made between them.`);
        }
        this.graph.get(a.Name).add(b.Name);
        this.graph.get(b.Name).add(a.Name);
        return this;
    }
    getConnectedNodes(node) {
        if (node instanceof SpacemapNode_1.SpacemapNode) {
            node = node.Name;
        }
        if (!this.registry.has(node))
            throw new TypeError(`Nodes: ${node} does not exist, cannot get connected nodes of node that does not exist.`);
        const nodes = this.graph.get(node);
        const output = [];
        nodes.forEach((val) => output.push(this.registry.get(val)));
        return output;
    }
    canTravel(node, warp) {
        const MapNode = this.resolveNodeFromName(node);
        if (MapNode == undefined)
            throw new TypeError(`Cannot query node warp requirements when node "${node}" does not exist.`);
        return warp >= MapNode.RequiredWarp;
    }
    updateMap() {
        this.MapRegister.forEach((node) => node.nodeAllStores().forEach((store) => store.update()));
    }
    /**@internal */
    get MapRegister() {
        return this.registry;
    }
    /**@internal */
    get Graph() {
        return this.graph;
    }
}
exports.Spacemap = Spacemap;
//# sourceMappingURL=Spacemap.js.map