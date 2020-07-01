"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Client_1 = require("./Client/Client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return Client_1.Client; } });
var Database_1 = require("./GameApi/Database/Database");
Object.defineProperty(exports, "connect", { enumerable: true, get: function () { return Database_1.connect; } });
Object.defineProperty(exports, "disconnect", { enumerable: true, get: function () { return Database_1.disconnect; } });
