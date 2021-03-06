const fs = require("fs");
const Fastify = require("fastify");
const isHtml = require("is-html");
const startServer = require("./server");
const getConfig = require("./config");

describe("Server Deployment", () => {
	describe("End-To-End - Bearer Token Disabled", () => {
		let config;
		let server;

		beforeAll(async () => {
			const AUTH_BEARER_TOKEN_ARRAY = "";
			Object.assign(process.env, {
				AUTH_BEARER_TOKEN_ARRAY,
			});
			config = await getConfig();

			server = Fastify();
			server.register(startServer, config);

			await server.ready();
		});

		afterAll(async () => {
			await server.close();
		});

		describe("/healthcheck Route", () => {
			test("Should return `ok`", async () => {
				const response = await server.inject({
					method: "GET",
					url: "/healthcheck",
					headers: {
						accept: "text/plain",
					},
				});

				expect(response.headers).toEqual(
					expect.objectContaining({
						"content-security-policy":
							"default-src 'self';base-uri 'self';img-src 'self' data:;object-src 'none';child-src 'self';frame-ancestors 'none';form-action 'self';upgrade-insecure-requests;block-all-mixed-content",
						"x-dns-prefetch-control": "off",
						"expect-ct": "max-age=0",
						"x-frame-options": "SAMEORIGIN",
						"strict-transport-security":
							"max-age=31536000; includeSubDomains",
						"x-download-options": "noopen",
						"x-content-type-options": "nosniff",
						"x-permitted-cross-domain-policies": "none",
						"referrer-policy": "no-referrer",
						"x-xss-protection": "0",
						"surrogate-control": "no-store",
						"cache-control": "no-store, max-age=0, must-revalidate",
						pragma: "no-cache",
						expires: "0",
						"permissions-policy": "interest-cohort=()",
						vary: "accept-encoding",
						"x-ratelimit-limit": expect.any(Number),
						"x-ratelimit-remaining": expect.any(Number),
						"x-ratelimit-reset": expect.any(Number),
						"content-type": "text/plain; charset=utf-8",
						"content-length": expect.any(String),
						date: expect.any(String),
						connection: "keep-alive",
					})
				);
				expect(response.statusCode).toEqual(200);
				expect(response.payload).toEqual("ok");
			});

			test("Should return HTTP status code 406 if media type in `Accept` request header is unsupported", async () => {
				const response = await server.inject({
					method: "GET",
					url: "/healthcheck",
					headers: {
						accept: "application/javascript",
					},
				});

				expect(response.statusCode).toEqual(406);
			});
		});

		describe("/pdf/html Route", () => {
			test("Should return PDF file converted to HTML, with expected headers set", async () => {
				const response = await server.inject({
					method: "POST",
					url: "/pdf/html",
					body: fs.readFileSync(
						"./test_resources/test_files/pdf_1.3_NHS_Constitution.pdf"
					),
					query: {
						lastPageToConvert: 2,
					},
					headers: {
						accept: "application/json, text/html",
						"content-type": "application/pdf",
					},
				});

				expect(response.headers).toEqual(
					expect.objectContaining({
						"content-security-policy":
							"default-src 'self';base-uri 'self';img-src 'self' data:;object-src 'none';child-src 'self';frame-ancestors 'none';form-action 'self';upgrade-insecure-requests;block-all-mixed-content",
						"x-dns-prefetch-control": "off",
						"expect-ct": "max-age=0",
						"x-frame-options": "SAMEORIGIN",
						"strict-transport-security":
							"max-age=31536000; includeSubDomains",
						"x-download-options": "noopen",
						"x-content-type-options": "nosniff",
						"x-permitted-cross-domain-policies": "none",
						"referrer-policy": "no-referrer",
						"x-xss-protection": "0",
						"surrogate-control": "no-store",
						"cache-control": "no-store, max-age=0, must-revalidate",
						pragma: "no-cache",
						expires: "0",
						"permissions-policy": "interest-cohort=()",
						vary: "Origin, accept-encoding",
						"x-ratelimit-limit": expect.any(Number),
						"x-ratelimit-remaining": expect.any(Number),
						"x-ratelimit-reset": expect.any(Number),
						"content-type": "text/html; charset=UTF-8",
						"content-length": expect.any(String),
						date: expect.any(String),
						connection: "keep-alive",
					})
				);
				expect(isHtml(response.payload)).toEqual(true);
				expect(response.statusCode).toEqual(200);
			});

			test("Should return HTTP status code 406 if media type in `Accept` request header is unsupported", async () => {
				const response = await server.inject({
					method: "POST",
					url: "/pdf/html",
					body: fs.readFileSync(
						"./test_resources/test_files/pdf_1.3_NHS_Constitution.pdf"
					),
					query: {
						lastPageToConvert: 2,
					},
					headers: {
						accept: "application/javascript",
						"content-type": "application/pdf",
					},
				});

				expect(response.statusCode).toEqual(406);
			});
		});

		describe("/pdf/txt Route", () => {
			test("Should return PDF file converted to TXT, with expected headers set", async () => {
				const response = await server.inject({
					method: "POST",
					url: "/pdf/txt",
					body: fs.readFileSync(
						"./test_resources/test_files/pdf_1.3_NHS_Constitution.pdf"
					),
					query: {
						lastPageToConvert: 2,
					},
					headers: {
						accept: "application/json, text/plain",
						"content-type": "application/pdf",
					},
				});

				expect(response.headers).toEqual(
					expect.objectContaining({
						"content-security-policy":
							"default-src 'self';base-uri 'self';img-src 'self' data:;object-src 'none';child-src 'self';frame-ancestors 'none';form-action 'self';upgrade-insecure-requests;block-all-mixed-content",
						"x-dns-prefetch-control": "off",
						"expect-ct": "max-age=0",
						"x-frame-options": "SAMEORIGIN",
						"strict-transport-security":
							"max-age=31536000; includeSubDomains",
						"x-download-options": "noopen",
						"x-content-type-options": "nosniff",
						"x-permitted-cross-domain-policies": "none",
						"referrer-policy": "no-referrer",
						"x-xss-protection": "0",
						"surrogate-control": "no-store",
						"cache-control": "no-store, max-age=0, must-revalidate",
						pragma: "no-cache",
						expires: "0",
						"permissions-policy": "interest-cohort=()",
						vary: "Origin, accept-encoding",
						"x-ratelimit-limit": expect.any(Number),
						"x-ratelimit-remaining": expect.any(Number),
						"x-ratelimit-reset": expect.any(Number),
						"content-type": "text/plain; charset=UTF-8",
						"content-length": expect.any(String),
						date: expect.any(String),
						connection: "keep-alive",
					})
				);
				expect(response.payload).toEqual(
					expect.stringContaining("The NHS Constitution")
				);
				expect(isHtml(response.payload)).toEqual(false);
				expect(response.statusCode).toEqual(200);
			});
		});

		describe("/rtf/html Route", () => {
			test("Should return RTF file converted to HTML, with expected headers set", async () => {
				const response = await server.inject({
					method: "POST",
					url: "/rtf/html",
					body: fs.readFileSync(
						"./test_resources/test_files/valid_rtf.rtf"
					),
					headers: {
						accept: "application/json, text/html",
						"content-type": "application/rtf",
					},
				});

				expect(response.headers).toEqual(
					expect.objectContaining({
						"content-security-policy":
							"default-src 'self';base-uri 'self';img-src 'self' data:;object-src 'none';child-src 'self';frame-ancestors 'none';form-action 'self';upgrade-insecure-requests;block-all-mixed-content",
						"x-dns-prefetch-control": "off",
						"expect-ct": "max-age=0",
						"x-frame-options": "SAMEORIGIN",
						"strict-transport-security":
							"max-age=31536000; includeSubDomains",
						"x-download-options": "noopen",
						"x-content-type-options": "nosniff",
						"x-permitted-cross-domain-policies": "none",
						"referrer-policy": "no-referrer",
						"x-xss-protection": "0",
						"surrogate-control": "no-store",
						"cache-control": "no-store, max-age=0, must-revalidate",
						pragma: "no-cache",
						expires: "0",
						"permissions-policy": "interest-cohort=()",
						vary: "Origin, accept-encoding",
						"x-ratelimit-limit": expect.any(Number),
						"x-ratelimit-remaining": expect.any(Number),
						"x-ratelimit-reset": expect.any(Number),
						"content-type": "text/html",
						"content-length": expect.any(String),
						date: expect.any(String),
						connection: "keep-alive",
					})
				);
				expect(isHtml(response.payload)).toEqual(true);
				expect(response.statusCode).toEqual(200);
			});
		});

		describe("/rtf/txt Route", () => {
			test("Should return RTF file converted to TXT, with expected headers set", async () => {
				const response = await server.inject({
					method: "POST",
					url: "/rtf/txt",
					body: fs.readFileSync(
						"./test_resources/test_files/valid_rtf.rtf"
					),
					headers: {
						accept: "application/json, text/plain",
						"content-type": "application/rtf",
					},
				});

				expect(response.headers).toEqual(
					expect.objectContaining({
						"content-security-policy":
							"default-src 'self';base-uri 'self';img-src 'self' data:;object-src 'none';child-src 'self';frame-ancestors 'none';form-action 'self';upgrade-insecure-requests;block-all-mixed-content",
						"x-dns-prefetch-control": "off",
						"expect-ct": "max-age=0",
						"x-frame-options": "SAMEORIGIN",
						"strict-transport-security":
							"max-age=31536000; includeSubDomains",
						"x-download-options": "noopen",
						"x-content-type-options": "nosniff",
						"x-permitted-cross-domain-policies": "none",
						"referrer-policy": "no-referrer",
						"x-xss-protection": "0",
						"surrogate-control": "no-store",
						"cache-control": "no-store, max-age=0, must-revalidate",
						pragma: "no-cache",
						expires: "0",
						"permissions-policy": "interest-cohort=()",
						vary: "Origin, accept-encoding",
						"x-ratelimit-limit": expect.any(Number),
						"x-ratelimit-remaining": expect.any(Number),
						"x-ratelimit-reset": expect.any(Number),
						"content-type": "text/plain",
						"content-length": expect.any(String),
						date: expect.any(String),
						connection: "keep-alive",
					})
				);
				expect(isHtml(response.payload)).toEqual(false);
				expect(response.statusCode).toEqual(200);
			});
		});
	});

	describe("End-To-End - Bearer Token Enabled", () => {
		let config;
		let server;

		beforeAll(async () => {
			const AUTH_BEARER_TOKEN_ARRAY =
				'[{"service": "test", "value": "testtoken"}]';
			Object.assign(process.env, {
				AUTH_BEARER_TOKEN_ARRAY,
			});

			config = await getConfig();

			server = Fastify();
			server.register(startServer, config);

			await server.ready();
		});

		afterAll(async () => {
			await server.close();
		});

		describe("/healthcheck Route", () => {
			test("Should return `ok`", async () => {
				const response = await server.inject({
					method: "GET",
					url: "/healthcheck",
					headers: {
						accept: "text/plain",
					},
				});

				expect(response.headers).toEqual(
					expect.objectContaining({
						"content-security-policy":
							"default-src 'self';base-uri 'self';img-src 'self' data:;object-src 'none';child-src 'self';frame-ancestors 'none';form-action 'self';upgrade-insecure-requests;block-all-mixed-content",
						"x-dns-prefetch-control": "off",
						"expect-ct": "max-age=0",
						"x-frame-options": "SAMEORIGIN",
						"strict-transport-security":
							"max-age=31536000; includeSubDomains",
						"x-download-options": "noopen",
						"x-content-type-options": "nosniff",
						"x-permitted-cross-domain-policies": "none",
						"referrer-policy": "no-referrer",
						"x-xss-protection": "0",
						"surrogate-control": "no-store",
						"cache-control": "no-store, max-age=0, must-revalidate",
						pragma: "no-cache",
						expires: "0",
						"permissions-policy": "interest-cohort=()",
						vary: "accept-encoding",
						"x-ratelimit-limit": expect.any(Number),
						"x-ratelimit-remaining": expect.any(Number),
						"x-ratelimit-reset": expect.any(Number),
						"content-type": "text/plain; charset=utf-8",
						"content-length": expect.any(String),
						date: expect.any(String),
						connection: "keep-alive",
					})
				);
				expect(response.statusCode).toEqual(200);
				expect(response.payload).toEqual("ok");
			});

			test("Should return HTTP status code 406 if media type in `Accept` request header is unsupported", async () => {
				const response = await server.inject({
					method: "GET",
					url: "/healthcheck",
					headers: {
						accept: "application/javascript",
					},
				});

				expect(response.statusCode).toEqual(406);
			});
		});

		describe("/pdf/html Route", () => {
			test("Should return PDF file converted to HTML, with expected headers set", async () => {
				const response = await server.inject({
					method: "POST",
					url: "/pdf/html",
					body: fs.readFileSync(
						"./test_resources/test_files/pdf_1.3_NHS_Constitution.pdf"
					),
					query: {
						lastPageToConvert: 2,
					},
					headers: {
						accept: "application/json, text/html",
						authorization: "Bearer testtoken",
						"content-type": "application/pdf",
					},
				});

				expect(response.headers).toEqual(
					expect.objectContaining({
						"content-security-policy":
							"default-src 'self';base-uri 'self';img-src 'self' data:;object-src 'none';child-src 'self';frame-ancestors 'none';form-action 'self';upgrade-insecure-requests;block-all-mixed-content",
						"x-dns-prefetch-control": "off",
						"expect-ct": "max-age=0",
						"x-frame-options": "SAMEORIGIN",
						"strict-transport-security":
							"max-age=31536000; includeSubDomains",
						"x-download-options": "noopen",
						"x-content-type-options": "nosniff",
						"x-permitted-cross-domain-policies": "none",
						"referrer-policy": "no-referrer",
						"x-xss-protection": "0",
						"surrogate-control": "no-store",
						"cache-control": "no-store, max-age=0, must-revalidate",
						pragma: "no-cache",
						expires: "0",
						"permissions-policy": "interest-cohort=()",
						vary: "Origin, accept-encoding",
						"x-ratelimit-limit": expect.any(Number),
						"x-ratelimit-remaining": expect.any(Number),
						"x-ratelimit-reset": expect.any(Number),
						"content-type": "text/html; charset=UTF-8",
						"content-length": expect.any(String),
						date: expect.any(String),
						connection: "keep-alive",
					})
				);
				expect(isHtml(response.payload)).toEqual(true);
				expect(response.statusCode).toEqual(200);
			});

			test("Should return HTTP status code 401 if auth bearer token is missing", async () => {
				const response = await server.inject({
					method: "POST",
					url: "/pdf/html",
					body: fs.readFileSync(
						"./test_resources/test_files/pdf_1.3_NHS_Constitution.pdf"
					),
					query: {
						lastPageToConvert: 2,
					},
					headers: {
						accept: "application/json, text/html",
						"content-type": "application/pdf",
					},
				});

				expect(response.headers).toEqual(
					expect.objectContaining({
						"content-security-policy":
							"default-src 'self';base-uri 'self';img-src 'self' data:;object-src 'none';child-src 'self';frame-ancestors 'none';form-action 'self';upgrade-insecure-requests;block-all-mixed-content",
						"x-dns-prefetch-control": "off",
						"expect-ct": "max-age=0",
						"x-frame-options": "SAMEORIGIN",
						"strict-transport-security":
							"max-age=31536000; includeSubDomains",
						"x-download-options": "noopen",
						"x-content-type-options": "nosniff",
						"x-permitted-cross-domain-policies": "none",
						"referrer-policy": "no-referrer",
						"x-xss-protection": "0",
						"surrogate-control": "no-store",
						"cache-control": "no-store, max-age=0, must-revalidate",
						pragma: "no-cache",
						expires: "0",
						"permissions-policy": "interest-cohort=()",
						vary: "accept-encoding",
						"content-type": "application/json; charset=utf-8",
						"content-length": expect.any(String),
						date: expect.any(String),
						connection: "keep-alive",
					})
				);

				expect(JSON.parse(response.payload)).toEqual(
					expect.objectContaining({
						error: "missing authorization header",
					})
				);
				expect(response.statusCode).toEqual(401);
			});

			test("Should return HTTP status code 406 if media type in `Accept` request header is unsupported", async () => {
				const response = await server.inject({
					method: "POST",
					url: "/pdf/html",
					body: fs.readFileSync(
						"./test_resources/test_files/pdf_1.3_NHS_Constitution.pdf"
					),
					query: {
						lastPageToConvert: 2,
					},
					headers: {
						accept: "application/javascript",
						authorization: "Bearer testtoken",
						"content-type": "application/pdf",
					},
				});

				expect(response.statusCode).toEqual(406);
			});
		});
	});
});
