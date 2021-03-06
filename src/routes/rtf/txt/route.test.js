const accepts = require("fastify-accepts");
const fs = require("fs");
const Fastify = require("fastify");
const isHtml = require("is-html");
const plugin = require(".");
const getConfig = require("../../../config");

describe("RTF-to-TXT route", () => {
	let options;
	let server;

	beforeAll(async () => {
		options = await getConfig();

		server = Fastify().register(accepts);
		server.register(plugin, options);

		await server.ready();
	});

	afterAll(async () => {
		await server.close();
	});

	test("Should return RTF file converted to TXT", async () => {
		const response = await server.inject({
			method: "POST",
			url: "/",
			body: fs.readFileSync("./test_resources/test_files/valid_rtf.rtf"),
			headers: {
				accept: "application/json, text/plain",
				"content-type": "application/rtf",
			},
		});

		expect(response.payload).toEqual(
			expect.stringContaining("Ask not what your country can do for you")
		);
		expect(isHtml(response.payload)).toEqual(false);
		expect(response.statusCode).toEqual(200);
	});

	test("Should return HTTP status code 415 if file is missing", async () => {
		const response = await server.inject({
			method: "POST",
			url: "/",

			headers: {
				accept: "application/json, text/plain",
				"content-type": "application/rtf",
			},
		});

		expect(response.statusCode).toEqual(415);
		expect(response.statusMessage).toEqual("Unsupported Media Type");
	});

	test("Should return HTTP status code 415 if file with '.rtf' extension is not a valid RTF file", async () => {
		const response = await server.inject({
			method: "POST",
			url: "/",
			body: fs.readFileSync(
				"./test_resources/test_files/invalid_rtf.rtf"
			),
			query: {
				lastPageToConvert: 2,
			},
			headers: {
				accept: "application/json, text/plain",
				"content-type": "application/rtf",
			},
		});

		expect(response.statusCode).toEqual(415);
		expect(response.statusMessage).toEqual("Unsupported Media Type");
	});

	test("Should return HTTP status code 415 if file media type is not supported by route", async () => {
		const response = await server.inject({
			method: "POST",
			url: "/",
			body: fs.readFileSync(
				"./test_resources/test_files/valid_empty_html.html"
			),
			headers: {
				accept: "application/json, text/plain",
				"content-type": "application/html",
			},
		});

		expect(response.statusCode).toEqual(415);
		expect(response.statusMessage).toEqual("Unsupported Media Type");
	});

	test("Should return HTTP status code 406 if media type in `Accept` request header is unsupported", async () => {
		const response = await server.inject({
			method: "POST",
			url: "/",
			body: fs.readFileSync("./test_resources/test_files/valid_rtf.rtf"),
			headers: {
				accept: "application/javascript",
				"content-type": "application/rtf",
			},
		});

		expect(response.statusCode).toEqual(406);
	});
});
