import { SpacemapNode, WarpPower } from "./SpacemapNode";

export class Spacemap implements ISpacemap, ISpacemapPrivileged {
	private registry: Map<string, SpacemapNode>;
	private graph: Map<string, Set<string>>;

	public constructor() {
		this.registry = new Map();
		this.graph = new Map();
	}

	public resolveNodeFromName(name: string | SpacemapNode): SpacemapNode | undefined {
		if (typeof name == "string") return this.registry.get(name);
		return name;
	}

	public addNode(node: SpacemapNode): this {
		if (this.registry.has(node.Name)) {
			throw new TypeError(`Duplicate spacemap entry for node ${node.Name}`);
		}
		this.registry.set(node.Name, node);
		this.graph.set(node.Name, new Set());
		return this;
	}
	public addNodes(nodes: SpacemapNode[]): this {
		nodes.forEach((node) => {
			if (this.registry.has(node.Name)) {
				throw new TypeError(`Duplicate spacemap entry for node ${node.Name}`);
			}
			this.registry.set(node.Name, node);
			this.graph.set(node.Name, new Set());
		});
		return this;
	}

	public addLink(a: SpacemapNode | string, b: SpacemapNode | string): this {
		const aNode = this.resolveNodeFromName(a);
		const bNode = this.resolveNodeFromName(b);
		if (aNode == undefined || bNode == undefined) throw new TypeError(`Invalid spacenodes ${a} pr ${b} passed`);
		a = aNode;
		b = bNode;
		if (!(this.registry.has(a.Name) && this.registry.has(a.Name))) {
			throw new TypeError(`Both nodes: ${a.Name} and ${b.Name} must exist for a link to be made between them.`);
		}
		this.graph.get(a.Name)!.add(b.Name);
		this.graph.get(b.Name)!.add(a.Name);
		return this;
	}

	public getConnectedNodes(node: string | SpacemapNode): Array<SpacemapNode> {
		if (node instanceof SpacemapNode) {
			node = node.Name;
		}
		if (!this.registry.has(node))
			throw new TypeError(`Nodes: ${node} does not exist, cannot get connected nodes of node that does not exist.`);
		const nodes = this.graph.get(node)!;
		const output: SpacemapNode[] = [];
		nodes.forEach((val) => output.push(this.registry.get(val)!));
		return output;
	}

	public canTravel(node: SpacemapNode | string, warp: WarpPower): boolean {
		const MapNode = this.resolveNodeFromName(node);
		if (MapNode == undefined)
			throw new TypeError(`Cannot query node warp requirements when node "${node}" does not exist.`);
		return warp >= MapNode.RequiredWarp;
	}

	public updateMap(): void {
		this.MapRegister.forEach((node) => node.nodeAllStores().forEach((store) => store.update()));
	}

	/**@internal */
	public get MapRegister(): Map<string, SpacemapNode> {
		return this.registry;
	}
	/**@internal */
	public get Graph(): Map<string, Set<string>> {
		return this.graph;
	}
}

export interface ISpacemap {
	canTravel(node: SpacemapNode | string, warp: WarpPower): boolean;
	getConnectedNodes(node: string | SpacemapNode): Array<SpacemapNode>;
	addLink(a: SpacemapNode | string, b: SpacemapNode | string): this;
	addNode(node: SpacemapNode): this;
	resolveNodeFromName(name: string | SpacemapNode): SpacemapNode | undefined;
}
export interface ISpacemapPrivileged {
	canTravel(node: SpacemapNode | string, warp: WarpPower): boolean;
	getConnectedNodes(node: string | SpacemapNode): Array<SpacemapNode>;
	addLink(a: SpacemapNode | string, b: SpacemapNode | string): this;
	addNode(node: SpacemapNode): this;
	resolveNodeFromName(name: string | SpacemapNode): SpacemapNode | undefined;
	MapRegister: Map<string, SpacemapNode>;
	Graph: Map<string, Set<string>>;
}
