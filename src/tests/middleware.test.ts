import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("astro:middleware", () => ({
	defineMiddleware: (fn: unknown) => fn,
}));

type MiddlewareFn = (
	context: {
		url: URL;
		rewrite: ReturnType<typeof vi.fn>;
	},
	next: ReturnType<typeof vi.fn>,
) => Promise<Response>;

const importMiddleware = async (): Promise<MiddlewareFn> => {
	const mod = await import("../middleware");
	return mod.onRequest as unknown as MiddlewareFn;
};

const makeContext = (pathname: string, rewriteResponse?: Response) => {
	const rewrite = vi.fn(() => {
		return (
			rewriteResponse ??
			new Response("rewritten body", {
				status: 200,
				headers: { "content-type": "text/html" },
			})
		);
	});
	return {
		url: new URL(`https://laborforzion.com${pathname}`),
		rewrite,
	};
};

describe("middleware onRequest", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("passes through non-404 responses unchanged", async () => {
		const onRequest = await importMiddleware();
		const context = makeContext("/es/some-page");
		const original = new Response("ok", { status: 200 });
		const next = vi.fn(() => original);

		const result = await onRequest(context, next);

		expect(result).toBe(original);
		expect(context.rewrite).not.toHaveBeenCalled();
	});

	it("passes through 404 on non-/es/ path unchanged", async () => {
		const onRequest = await importMiddleware();
		const context = makeContext("/missing");
		const original = new Response("not found", { status: 404 });
		const next = vi.fn(() => original);

		const result = await onRequest(context, next);

		expect(result).toBe(original);
		expect(context.rewrite).not.toHaveBeenCalled();
	});

	it("passes through 404 on /es/404 unchanged (avoid recursion)", async () => {
		const onRequest = await importMiddleware();
		const context = makeContext("/es/404");
		const original = new Response("not found", { status: 404 });
		const next = vi.fn(() => original);

		const result = await onRequest(context, next);

		expect(result).toBe(original);
		expect(context.rewrite).not.toHaveBeenCalled();
	});

	it("passes through 404 on /es/404/ unchanged (avoid recursion)", async () => {
		const onRequest = await importMiddleware();
		const context = makeContext("/es/404/");
		const original = new Response("not found", { status: 404 });
		const next = vi.fn(() => original);

		const result = await onRequest(context, next);

		expect(result).toBe(original);
		expect(context.rewrite).not.toHaveBeenCalled();
	});

	it("rewrites 404 on /es/* path to /es/404 with status 404 and 'Not Found'", async () => {
		const onRequest = await importMiddleware();
		const rewritten = new Response("rewritten body", {
			status: 200,
			headers: { "content-type": "text/html; charset=utf-8" },
		});
		const context = makeContext("/es/unknown-page", rewritten);
		const original = new Response("not found", { status: 404 });
		const next = vi.fn(() => original);

		const result = await onRequest(context, next);

		expect(context.rewrite).toHaveBeenCalledTimes(1);
		expect(context.rewrite).toHaveBeenCalledWith("/es/404");
		expect(result).not.toBe(original);
		expect(result.status).toBe(404);
		expect(result.statusText).toBe("Not Found");
		expect(result.headers.get("content-type")).toBe(
			"text/html; charset=utf-8",
		);
		expect(await result.text()).toBe("rewritten body");
	});

	it("rewrites 404 on nested /es/* path", async () => {
		const onRequest = await importMiddleware();
		const context = makeContext("/es/2022/09/some-note");
		const next = vi.fn(() => new Response("nf", { status: 404 }));

		const result = await onRequest(context, next);

		expect(context.rewrite).toHaveBeenCalledWith("/es/404");
		expect(result.status).toBe(404);
		expect(result.statusText).toBe("Not Found");
	});
});
