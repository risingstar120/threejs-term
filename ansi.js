// Adopted from blessed/vendor/tng.js

const ascii_only = !true;
const colors = require('blessed/lib/colors');
const ascii = true;
const no_bg = true;

// 3 Modules
// ANSI only - No colors
// BG COLORS only - No ascii
// ASCII + BG COLORS + FG Colors
// ASCII + FG Colors

module.exports = (function() {
    this.colors = colors;

    let dchars;
    // Taken from libcaca:
    dchars = '????8@8@#8@8##8#MKXWwz$&%x><\\/xo;+=|^-:i\'.`,  `.        '.split('').reverse().join('')
    // dchars = ' .,:;=|iI+hHOE#`$'

    // darker bolder character set from https://github.com/saw/Canvas-ASCII-Art/
    // dchars = ' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$'
    // dchars = ' .:-=+*#%@';


    dchars = dchars.split('').reverse().join('');

    function pixelToSGR(pixel, ch) {
        var bga = 1.0
            , fga = 0.5
            , a = pixel.a / 255
            , bg
            , fg;

        bg = this.colors.match(
            pixel.r * a * bga | 0,
            pixel.g * a * bga | 0,
            pixel.b * a * bga | 0);

        if (ch && ascii) {
            fg = this.colors.match(
            pixel.r * a * fga | 0,
            pixel.g * a * fga | 0,
            pixel.b * a * fga | 0);
            if (a === 0 || no_bg) {
            return '\x1b[38;5;' + fg + 'm' + ch + '\x1b[m';
            }
            return '\x1b[38;5;' + fg + 'm\x1b[48;5;' + bg + 'm' + ch + '\x1b[m';
        }

        if (a === 0) return ' ';

        return '\x1b[48;5;' + bg + 'm \x1b[m';
    }

    function luminance(pixel) {
        var a = pixel.a / 255
            , r = pixel.r * a
            , g = pixel.g * a
            , b = pixel.b * a
            , l = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        return l / 255;
    };

    function getOutch(pixel) {
        var lumi = luminance(pixel)
        , outch = dchars[lumi * (dchars.length - 1) | 0];

        return outch;
    }

    function convert(image, targetWidth, targetHeight) {
        const { width, height, data } = image;
        let out = [];
        let ty, tx, i, pixel, outch;
        for (let y = 0; y < targetHeight; y++) {
            ty = y / targetHeight * height | 0;
            for (let x = 0; x < targetWidth; x++) {
                tx = x / targetWidth * width | 0;
                i = ty * width + tx;

                pixel = {
                    r: data[i * 4 + 0],
                    g: data[i * 4 + 1],
                    b: data[i * 4 + 2],
                    a: data[i * 4 + 0]
                }

                outch = getOutch(pixel);
                if (ascii_only) {
                    out.push(outch);
                }
                else {
                    out.push(pixelToSGR(pixel, outch));
                }
            }
            out.push('\n');
        }
        return out.join('');
    }

    return {
        convert: convert
    }
})();