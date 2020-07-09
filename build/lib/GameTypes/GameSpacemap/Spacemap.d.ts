import { SpacemapNode, WarpPower } from "./SpacemapNode";
export declare class Spacemap implements ISpacemap, ISpacemapPrivileged {
    private registry;
    private graph;
    constructor();
    resolveNodeFromName(name: string | SpacemapNode): SpacemapNode | undefined;
    addNode(node: SpacemapNode): this;
    addNodes(nodes: SpacemapNode[]): this;
    addLink(a: SpacemapNode | string, b: SpacemapNode | string): this;
    getConnectedNodes(node: string | SpacemapNode): Array<SpacemapNode>;
    canTravel(node: SpacemapNode | string, warp: WarpPower): boolean;
    updateMap(): void;
    /**@internal */
    get MapRegister(): Map<string, SpacemapNode>;
    /**@internal */
    get Graph(): Map<string, Set<string>>;
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
