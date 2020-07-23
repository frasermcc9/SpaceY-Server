export class Skin {
    constructor(private readonly skinName: string, private readonly skinUri: string) {}

    public get SkinUri() {
        return this.skinUri;
    }

    public get SkinName() {
        return this.skinName;
    }
}
