"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
class streamVideo extends stream_1.Readable {
    constructor(parameters, s3, maxLength, nodeReadableStreamOptions) {
        super(nodeReadableStreamOptions);
        this._currentCursorPosition = 0; // Holds the current starting position for our range queries
        this._s3DataRange = 1024 * 1024 * 16; // Amount of bytes to grab
        this._maxContentLength = maxLength;
        this._s3 = s3;
        this._s3StreamParams = parameters;
    }
    _read() {
        if (this._currentCursorPosition > this._maxContentLength) {
            this.push(null);
        }
        else {
            const range = this._currentCursorPosition + this._s3DataRange;
            const adjustedRange = range < this._maxContentLength ? range : this._maxContentLength;
            this._s3StreamParams.Range = `bytes=${this._currentCursorPosition}-${adjustedRange}`;
            this._currentCursorPosition = adjustedRange + 1;
            this._s3.getObject(this._s3StreamParams, (error, data) => {
                if (error) {
                    this.destroy(error);
                }
                else {
                    this.push(data.Body);
                }
            });
        }
    }
}
exports.default = streamVideo;
