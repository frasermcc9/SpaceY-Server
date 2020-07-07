import { default as must } from "must";
import { util } from "../../lib/Util/util";
import { throws } from "assert";
require("must/register");

describe("Throw Undefined Test", async () => {
	it("Should return the defined string", async () => {
		const A = "hello";
		util.throwUndefined(A).must.eql("hello");
	});
	it("Should return the defined object", async () => {
		const A = {};
		util.throwUndefined(A).must.eql({});
	});
	it("Should return the defined number", async () => {
		const A = 0;
		util.throwUndefined(A).must.eql(0);
	});
	it("Should throw the undefined", async () => {
		let A: string | undefined;
		throws(() => {
			util.throwUndefined(A);
		}, "Hi");
	});
});
