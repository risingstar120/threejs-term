class SoftwareCanvas {
    constructor() {
        this.style = {};
    }

    set width(w) {
        this._width = w;
        this._resize()
    }

    set height(h) {
        this._height = h;
        this._resize()
    }

    _resize() {
        this._data = new Uint8ClampedArray(this._width * this._height * 4);
    }

    getContext() {
        return this;

        // Use proxy to trap unhandled messages for development purposes
        const proxy = new Proxy(this, {
            get: function (object, property, proxy) {
                if (property in object) {
                    return object[property];
                }

                console.error('Trapped get',  property);
                return null;
            },

            set: function(object, property, value, proxy) {
                if (!(property in object)) {
                    console.error('Trapped set',  property, value);
                }

                object[property] = value;
                return object[property];
            }
        });

        return proxy;
    }

    fillRect(sx, sy, w, h) {
        const [r, g, b, a] = this._parseStyle(this.fillStyle);
        const a1 = a / 255;
        for (let j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
                const x = i + sx;
                const y = j + sy;

                const si = (y * this._width + x) * 4;
                // TODO Need to blend!!!
                this._data[si + 0] = r * a1 | 0;
                this._data[si + 1] = g * a1 | 0;
                this._data[si + 2] = b * a1 | 0;
                this._data[si + 3] = a;
            }
        }
    }

    _parseStyle(s) {
        const RGB = /rgb\s*\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)\s*\)/
        let match = RGB.exec(s);
        if (match) {
            return [...match.slice(1), 255];
        }

        const RGBA = /rgba\s*\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)[ ,]+(\d+)\s*\)/
        match = RGBA.exec(s);
        if (match)
            return match.slice(1);
        elsef
            console.error('Cannot parse', s);
        return [0, 0, 0, 0];
    }

    /*
    set fillStyle(x) {

    }*/

    getImageData(sx, sy, sw, sh) {
        const data = new Uint8ClampedArray(sw * sh * 4);
        // TODO this doesn't check boundary conditions!

        for (let j = 0; j < sh; j++) {
            for (let i = 0; i < sw; i++) {
                const x = sx + i;
                const y = sy + j;

                const source = (y * this._width + x) * 4;
                const dest = (j * sw + i) * 4;
                data[dest + 0] = this._data[source + 0];
                data[dest + 1] = this._data[source + 1];
                data[dest + 2] = this._data[source + 2];
                data[dest + 3] = this._data[source + 3];
            }
        }

        const result = {
            data: data,
            width: sw,
            height: sh
        }
        return result;
    }

    putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        const data = imageData.data;

        for (let y = 0; y < dirtyHeight; y++) {
            for (let x = 0; x < dirtyWidth; x++) {
                const tx = dirtyX + x;
                const ty = dirtyY + y;
                const source = (ty * imageData.width + tx) * 4;

                const sx = dx + x + dirtyX;
                const sy = dy + y + dirtyY;
                const dest = (sy * this._width + sx) * 4;
                const a = this._data[source + 3] / 255;
                this._data[dest + 0] = data[source + 0] * a | 0;
                this._data[dest + 1] = data[source + 1] * a | 0;
                this._data[dest + 2] = data[source + 2] * a | 0;
                this._data[dest + 3] *= data[source + 3] | 0;
            }
        }
    }
}

module.exports = SoftwareCanvas;