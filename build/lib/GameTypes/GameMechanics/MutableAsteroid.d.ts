import { Asteroid } from "./Asteroid";
export declare function CreateMutable(asteroid: Asteroid, tags: Set<string>): IMutableAsteroid;
export interface AttachmentAsteroid {
    buffCollection(multiplier: number): void;
    hasTag(tag: string): boolean;
}
export interface IMutableAsteroid extends AttachmentAsteroid, Map<string, number> {
    applyDeviation(percent: number): void;
}
