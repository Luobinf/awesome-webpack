(() => {
  var __webpack_modules__ = {
    "./src/about.js": (
      __unused_webpack_module,
      __unused_webpack_exports,
      __webpack_require__
    ) => {
      eval(
        'let title = __webpack_require__(/*! ./title.js */ "./src/title.js");\nconsole.log("about:", title);//loader2//loader1\n\n//# sourceURL=webpack://awesome-webpack/./src/about.js?'
      );
    },

    "./src/title.js": (module) => {
      eval(
        'module.exports = "title";//loader2//loader1\n\n//# sourceURL=webpack://awesome-webpack/./src/title.js?'
      );
    },
  };
  // The module cache
  var __webpack_module_cache__ = {};

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // Create a new module (and put it into the cache)
    var module = (__webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {},
    });

    // Execute the module function
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Return the exports of the module
    return module.exports;
  }
  // startup
  // Load entry module and return exports
  // This entry module can't be inlined because the eval devtool is used.
  var __webpack_exports__ = __webpack_require__("./src/about.js");
})();
