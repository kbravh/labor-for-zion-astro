import { dedupeArray, splitArray } from "@utils/array";
import { describe, expect, it } from "vitest";

describe("Array", () => {
	describe("splitArray", () => {
		it("throws on an invalid group", () => {
			expect(() => splitArray(0, [1, 2, 3])).toThrowError(
				"Group must be 1 or greater",
			);
		});
		it("splits an even set of items", () => {
			expect(splitArray(2, [1, 2, 3, 4])).toStrictEqual([
				[1, 3],
				[2, 4],
			]);
		});
		it("splits an uneven set of items", () => {
			expect(splitArray(2, [1, 2, 3, 4, 5])).toStrictEqual([
				[1, 3, 5],
				[2, 4],
			]);
		});
	});

	describe("dedupeArray", () => {
		it("deduplicates an array of numbers", () => {
			expect(dedupeArray([1, 1, 2, 3], (item) => item)).toStrictEqual([
				1, 2, 3,
			]);
		});
		it(" deduplicates an array of objects by title", () => {
			expect(
				dedupeArray(
					[
						{ id: "1", title: "Far From Home" },
						{ id: "2", title: "Close to Home" },
						{ id: "3", title: "Far From Home" },
					],
					(item) => item.title,
				),
			).toStrictEqual([
				{ id: "1", title: "Far From Home" },
				{ id: "2", title: "Close to Home" },
			]);
		});
	});
});
