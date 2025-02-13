(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Plugin = /** @class */ (function () {
        function Plugin(config) {
            if (config === void 0) { config = {}; }
            this.css = {};
            this.html = {};
            this.config = config;
        }
        Plugin.addStyle = function (html, style) {
            return html.replace('<!-- inline_css_outlet -->', "<style type=\"text/css\">" + style + "</style>");
        };
        Plugin.prototype.filter = function (fileName) {
            if (typeof this.config.filter === 'function') {
                return this.config.filter(fileName);
            }
            else {
                return true;
            }
        };
        Plugin.prototype.prepare = function (_a) {
            var _this = this;
            var assets = _a.assets;
            var isCSS = is('css');
            var isHTML = is('html');
            Object.keys(assets).forEach(function (fileName) {
                if (isCSS(fileName)) {
                    var isCurrentFileNeedsToBeInlined = _this.filter(fileName);
                    if (isCurrentFileNeedsToBeInlined) {
                        _this.css[fileName] = assets[fileName].source();
                    }
                }
                else if (isHTML(fileName)) {
                    _this.html[fileName] = assets[fileName].source();
                }
            });
        };
        Plugin.prototype.process = function (_a, _b) {
            var _this = this;
            var assets = _a.assets;
            var output = _b.output;
            var publicPath = (output && output.publicPath) || '';
            Object.keys(this.html).forEach(function (htmlFileName) {
                var html = _this.html[htmlFileName];
                Object.keys(_this.css).forEach(function (key) {
                    html = Plugin.addStyle(html, _this.css[key]);
                });
                assets[htmlFileName] = {
                    source: function () { return html; },
                    size: function () { return html.length; },
                };
            });
        };
        Plugin.prototype.apply = function (compiler) {
            var _this = this;
            compiler.hooks.emit.tapAsync('html-inline-css-webpack-plugin', function (compilation, callback) {
                _this.prepare(compilation);
                _this.process(compilation, compiler.options);
                callback();
            });
        };
        return Plugin;
    }());
    exports.default = Plugin;
    function is(filenameExtension) {
        var reg = new RegExp("." + filenameExtension + "$");
        return function (fileName) { return reg.test(fileName); };
    }
});
//# sourceMappingURL=index.js.map