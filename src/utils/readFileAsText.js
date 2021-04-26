define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.readFileAsText = void 0;
    function readFileAsText(inputFile) {
        var temporaryFileReader = new FileReader();
        return new Promise(function (resolve, reject) {
            temporaryFileReader.onerror = function () {
                temporaryFileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };
            temporaryFileReader.onload = function () {
                resolve(String(temporaryFileReader.result));
            };
            temporaryFileReader.readAsText(inputFile);
        });
    }
    exports.readFileAsText = readFileAsText;
});
//# sourceMappingURL=readFileAsText.js.map