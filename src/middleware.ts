import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();
	if (response.status !== 404) {
		return response;
	}
	if (!context.url.pathname.startsWith("/es/")) {
		return response;
	}
	if (
		context.url.pathname === "/es/404" ||
		context.url.pathname === "/es/404/"
	) {
		return response;
	}
	const rewritten = await context.rewrite("/es/404");
	return new Response(rewritten.body, {
		status: 404,
		statusText: "Not Found",
		headers: rewritten.headers,
	});
});
