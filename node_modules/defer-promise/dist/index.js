(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.defer = factory());
}(this, (function () { 'use strict';

  /**
   * @module defer-promise
   */

  function defer () {
    if (typeof Promise !== 'undefined' && Promise.defer) {
      return Promise.defer()
    } else {
      var deferred = {};
      deferred.promise = new Promise(function (resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
      });
      return deferred
    }
  }

  return defer;

})));
