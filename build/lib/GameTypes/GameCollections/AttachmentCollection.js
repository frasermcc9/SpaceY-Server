"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentCollection = void 0;
const Client_1 = require("../../Client/Client");
const GameCollectionBase_1 = require("./GameCollectionBase");
class AttachmentCollection extends GameCollectionBase_1.GameCollectionBase {
    constructor(options) {
        super();
        this.attachmentSet = Client_1.Client.Get().Registry.AttachmentRegistry;
        //Create map with all empty attachment values, but set defined attachments to the given value.
        if (options?.data) {
            this.attachmentSet.forEach((attachment) => {
                this.set(attachment.Name, options.data?.get(attachment.Name) || 0);
            });
        }
        else {
            this.attachmentSet.forEach((attachment) => {
                this.set(attachment.Name, 0);
            });
        }
    }
}
exports.AttachmentCollection = AttachmentCollection;
