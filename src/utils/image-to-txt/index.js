const { createWorker } = require("tesseract.js");

/**
 * @author Frazer Smith
 * @description Utility to convert images of text to text strings,
 * using Tesseract Optical Character Recognition (OCR) engine.
 * @param {string|Buffer} image - A path to an image, a Buffer
 * storing a binary image, or a base64 encoded image.
 * @param {string=} languages - Languages to load trained data for.
 * Multiple languages are concatenated with a `+` i.e. `eng+chi_tra`
 * for English and Chinese Traditional languages.
 * @returns {Promise<string|Error>} Promise of text retrieved
 * from image as string on resolve, or Error object on rejection.
 */
module.exports = async function util(image, languages) {
	const worker = createWorker();
	try {
		if (image === undefined || Object.keys(image).length === 0) {
			throw new Error("Cannot convert image");
		}
		await worker.load();
		await worker.loadLanguage(languages);
		await worker.initialize(languages);
		// Disable HOCR and TSV in output, not needed
		await worker.setParameters({
			tessjs_create_hocr: "0",
			tessjs_create_tsv: "0",
		});

		const {
			data: { text },
		} = await worker.recognize(image).catch((err) => {
			throw err;
		});
		await worker.terminate();

		return text;
	} catch (err) {
		await worker.terminate();
		return Promise.reject(err);
	}
};
