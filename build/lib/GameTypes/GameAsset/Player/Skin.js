"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skin = void 0;
class Skin {
    constructor(skinName, skinUri) {
        this.skinName = skinName;
        this.skinUri = skinUri;
    }
    get SkinUri() {
        return this.skinUri;
    }
    get SkinName() {
        return this.skinName;
    }
}
exports.Skin = Skin;
