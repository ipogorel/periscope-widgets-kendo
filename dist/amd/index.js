define(["exports", "./grid-dt"], function (exports, _gridDt) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_gridDt).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _gridDt[key];
      }
    });
  });
  exports.configure = configure;
  function configure(aurelia) {
    aurelia.globalResources("./grid-dt");
  }
});