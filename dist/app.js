import { defineComponent, h, resolveComponent, openBlock, createBlock, renderSlot, createVNode, withCtx, Fragment, renderList, resolveDynamicComponent, withDirectives, vShow, mergeProps, withModifiers, createCommentVNode, ref, onMounted, toRaw, isProxy, createElementBlock, createElementVNode, toDisplayString, createTextVNode, normalizeClass, normalizeStyle, watch, toRefs, nextTick, onBeforeUnmount, onActivated, onDeactivated } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';

/*!
  * vue-draggable-next v2.2.0
  * (c) 2023 Anish George
  * @license MIT
  */

/**!
 * Sortable 1.14.0
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

var version = "1.14.0";

function userAgent(pattern) {
  if (typeof window !== 'undefined' && window.navigator) {
    return !! /*@__PURE__*/navigator.userAgent.match(pattern);
  }
}

var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

var captureMode = {
  capture: false,
  passive: false
};

function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}

function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}

function matches(
/**HTMLElement*/
el,
/**String*/
selector) {
  if (!selector) return;
  selector[0] === '>' && (selector = selector.substring(1));

  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }

  return false;
}

function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}

function closest(
/**HTMLElement*/
el,
/**String*/
selector,
/**HTMLElement*/
ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;

    do {
      if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }

      if (el === ctx) break;
      /* jshint boss:true */
    } while (el = getParentOrHost(el));
  }

  return null;
}

var R_SPACE = /\s+/g;

function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? 'add' : 'remove'](name);
    } else {
      var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
      el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
    }
  }
}

function css$7(el, prop, val) {
  var style = el && el.style;

  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, '');
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }

      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf('webkit') === -1) {
        prop = '-webkit-' + prop;
      }

      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }
  }
}

function matrix(el, selfOnly) {
  var appliedTransforms = '';

  if (typeof el === 'string') {
    appliedTransforms = el;
  } else {
    do {
      var transform = css$7(el, 'transform');

      if (transform && transform !== 'none') {
        appliedTransforms = transform + ' ' + appliedTransforms;
      }
      /* jshint boss:true */

    } while (!selfOnly && (el = el.parentNode));
  }

  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  /*jshint -W056 */

  return matrixFn && new matrixFn(appliedTransforms);
}

function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName),
        i = 0,
        n = list.length;

    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }

    return list;
  }

  return [];
}

function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;

  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}
/**
 * Returns the "bounding client rect" of given element
 * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
 * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
 * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
 * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
 * @param  {[HTMLElement]} container              The parent the element will be placed in
 * @return {Object}                               The boundingClientRect of el, with specified adjustments
 */


function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window) return;
  var elRect, top, left, bottom, right, height, width;

  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }

  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    // Adjust for translate()
    container = container || el.parentNode; // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
    // Not needed on <= IE11

    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css$7(container, 'transform') !== 'none' || relativeToNonStaticParent && css$7(container, 'position') !== 'static')) {
          var containerRect = container.getBoundingClientRect(); // Set relative to edges of padding box of container

          top -= containerRect.top + parseInt(css$7(container, 'border-top-width'));
          left -= containerRect.left + parseInt(css$7(container, 'border-left-width'));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
        /* jshint boss:true */

      } while (container = container.parentNode);
    }
  }

  if (undoScale && el !== window) {
    // Adjust for scale()
    var elMatrix = matrix(container || el),
        scaleX = elMatrix && elMatrix.a,
        scaleY = elMatrix && elMatrix.d;

    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }

  return {
    top: top,
    left: left,
    bottom: bottom,
    right: right,
    width: width,
    height: height
  };
}
/**
 * Checks if a side of an element is scrolled past a side of its parents
 * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
 * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
 * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
 * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
 */


function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true),
      elSideVal = getRect(el)[elSide];
  /* jshint boss:true */

  while (parent) {
    var parentSideVal = getRect(parent)[parentSide],
        visible = void 0;

    if (parentSide === 'top' || parentSide === 'left') {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }

    if (!visible) return parent;
    if (parent === getWindowScrollingElement()) break;
    parent = getParentAutoScrollElement(parent, false);
  }

  return false;
}
/**
 * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
 * and non-draggable elements
 * @param  {HTMLElement} el       The parent element
 * @param  {Number} childNum      The index of the child
 * @param  {Object} options       Parent Sortable's options
 * @return {HTMLElement}          The child at index childNum, or null if not found
 */


function getChild(el, childNum, options, includeDragEl) {
  var currentChild = 0,
      i = 0,
      children = el.children;

  while (i < children.length) {
    if (children[i].style.display !== 'none' && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }

      currentChild++;
    }

    i++;
  }

  return null;
}
/**
 * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
 * @param  {HTMLElement} el       Parent element
 * @param  {selector} selector    Any other elements that should be ignored
 * @return {HTMLElement}          The last child, ignoring ghostEl
 */


function lastChild(el, selector) {
  var last = el.lastElementChild;

  while (last && (last === Sortable.ghost || css$7(last, 'display') === 'none' || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }

  return last || null;
}
/**
 * Returns the index of an element within its parent for a selected set of
 * elements
 * @param  {HTMLElement} el
 * @param  {selector} selector
 * @return {number}
 */


function index(el, selector) {
  var index = 0;

  if (!el || !el.parentNode) {
    return -1;
  }
  /* jshint boss:true */


  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index++;
    }
  }

  return index;
}
/**
 * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
 * The value is returned in real pixels.
 * @param  {HTMLElement} el
 * @return {Array}             Offsets in the format of [left, top]
 */


function getRelativeScrollOffset(el) {
  var offsetLeft = 0,
      offsetTop = 0,
      winScroller = getWindowScrollingElement();

  if (el) {
    do {
      var elMatrix = matrix(el),
          scaleX = elMatrix.a,
          scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }

  return [offsetLeft, offsetTop];
}
/**
 * Returns the index of the object within the given array
 * @param  {Array} arr   Array that may or may not hold the object
 * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
 * @return {Number}      The index of the object in the array, or -1
 */


function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i)) continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }

  return -1;
}

function getParentAutoScrollElement(el, includeSelf) {
  // skip to window
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;

  do {
    // we don't need to get elem css if it isn't even overflowing in the first place (performance)
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css$7(elem);

      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
    /* jshint boss:true */

  } while (elem = elem.parentNode);

  return getWindowScrollingElement();
}

function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }

  return dst;
}

function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}

var _throttleTimeout;

function throttle(callback, ms) {
  return function () {
    if (!_throttleTimeout) {
      var args = arguments,
          _this = this;

      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }

      _throttleTimeout = setTimeout(function () {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}

function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}

function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}

function clone(el) {
  var Polymer = window.Polymer;
  var $ = window.jQuery || window.Zepto;

  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}

var expando = 'Sortable' + new Date().getTime();

function AnimationStateManager() {
  var animationStates = [],
      animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      var children = [].slice.call(this.el.children);
      children.forEach(function (child) {
        if (css$7(child, 'display') === 'none' || child === Sortable.ghost) return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });

        var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect); // If animating: compensate for current animation


        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);

          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }

        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target: target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;

      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === 'function') callback();
        return;
      }

      var animating = false,
          animationTime = 0;
      animationStates.forEach(function (state) {
        var time = 0,
            target = state.target,
            fromRect = target.fromRect,
            toRect = getRect(target),
            prevFromRect = target.prevFromRect,
            prevToRect = target.prevToRect,
            animatingRect = state.rect,
            targetMatrix = matrix(target, true);

        if (targetMatrix) {
          // Compensate for current animation
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }

        target.toRect = toRect;

        if (target.thisAnimationDuration) {
          // Could also check if animatingRect is between fromRect and toRect
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            // If returning to same place as started from animation and on same axis
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        } // if fromRect != toRect: animate


        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;

          if (!time) {
            time = _this.options.animation;
          }

          _this.animate(target, animatingRect, toRect, time);
        }

        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function () {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);

      if (!animating) {
        if (typeof callback === 'function') callback();
      } else {
        animationCallbackId = setTimeout(function () {
          if (typeof callback === 'function') callback();
        }, animationTime);
      }

      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css$7(target, 'transition', '');
        css$7(target, 'transform', '');
        var elMatrix = matrix(this.el),
            scaleX = elMatrix && elMatrix.a,
            scaleY = elMatrix && elMatrix.d,
            translateX = (currentRect.left - toRect.left) / (scaleX || 1),
            translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css$7(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
        this.forRepaintDummy = repaint(target); // repaint

        css$7(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
        css$7(target, 'transform', 'translate3d(0,0,0)');
        typeof target.animated === 'number' && clearTimeout(target.animated);
        target.animated = setTimeout(function () {
          css$7(target, 'transition', '');
          css$7(target, 'transform', '');
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}

function repaint(target) {
  return target.offsetWidth;
}

function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}

var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    // Set default static properties
    for (var option in defaults) {
      if (defaults.hasOwnProperty(option) && !(option in plugin)) {
        plugin[option] = defaults[option];
      }
    }

    plugins.forEach(function (p) {
      if (p.pluginName === plugin.pluginName) {
        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
      }
    });
    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;

    this.eventCanceled = false;

    evt.cancel = function () {
      _this.eventCanceled = true;
    };

    var eventNameGlobal = eventName + 'Global';
    plugins.forEach(function (plugin) {
      if (!sortable[plugin.pluginName]) return; // Fire global events if it exists in this sortable

      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
          sortable: sortable
        }, evt));
      } // Only fire plugin event if plugin is enabled in this sortable,
      // and plugin has event defined


      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread2({
          sortable: sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults, options) {
    plugins.forEach(function (plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized; // Add default options from plugin

      _extends(defaults, initialized.defaults);
    });

    for (var option in sortable.options) {
      if (!sortable.options.hasOwnProperty(option)) continue;
      var modified = this.modifyOption(sortable, option, sortable.options[option]);

      if (typeof modified !== 'undefined') {
        sortable.options[option] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function (plugin) {
      if (typeof plugin.eventProperties !== 'function') return;

      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function (plugin) {
      // Plugin must exist on the Sortable
      if (!sortable[plugin.pluginName]) return; // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin

      if (plugin.optionListeners && typeof plugin.optionListeners[name] === 'function') {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};

function dispatchEvent(_ref) {
  var sortable = _ref.sortable,
      rootEl = _ref.rootEl,
      name = _ref.name,
      targetEl = _ref.targetEl,
      cloneEl = _ref.cloneEl,
      toEl = _ref.toEl,
      fromEl = _ref.fromEl,
      oldIndex = _ref.oldIndex,
      newIndex = _ref.newIndex,
      oldDraggableIndex = _ref.oldDraggableIndex,
      newDraggableIndex = _ref.newDraggableIndex,
      originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl && rootEl[expando];
  if (!sortable) return;
  var evt,
      options = sortable.options,
      onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1); // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent(name, true, true);
  }

  evt.to = toEl || rootEl;
  evt.from = fromEl || rootEl;
  evt.item = targetEl || rootEl;
  evt.clone = cloneEl;
  evt.oldIndex = oldIndex;
  evt.newIndex = newIndex;
  evt.oldDraggableIndex = oldDraggableIndex;
  evt.newDraggableIndex = newDraggableIndex;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;

  var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));

  for (var option in allEventProperties) {
    evt[option] = allEventProperties[option];
  }

  if (rootEl) {
    rootEl.dispatchEvent(evt);
  }

  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}

var _excluded = ["evt"];

var pluginEvent = function pluginEvent(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      originalEvent = _ref.evt,
      data = _objectWithoutProperties(_ref, _excluded);

  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
    dragEl: dragEl,
    parentEl: parentEl,
    ghostEl: ghostEl,
    rootEl: rootEl,
    nextEl: nextEl,
    lastDownEl: lastDownEl,
    cloneEl: cloneEl,
    cloneHidden: cloneHidden,
    dragStarted: moved,
    putSortable: putSortable,
    activeSortable: Sortable.active,
    originalEvent: originalEvent,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable: sortable,
        name: name,
        originalEvent: originalEvent
      });
    }
  }, data));
};

function _dispatchEvent(info) {
  dispatchEvent(_objectSpread2({
    putSortable: putSortable,
    cloneEl: cloneEl,
    targetEl: dragEl,
    rootEl: rootEl,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex
  }, info));
}

var dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    oldIndex,
    newIndex,
    oldDraggableIndex,
    newDraggableIndex,
    activeGroup,
    putSortable,
    awaitingDragStarted = false,
    ignoreNextClick = false,
    sortables = [],
    tapEvt,
    touchEvt,
    lastDx,
    lastDy,
    tapDistanceLeft,
    tapDistanceTop,
    moved,
    lastTarget,
    lastDirection,
    pastFirstInvertThresh = false,
    isCircumstantialInvert = false,
    targetMoveDistance,
    // For positioning ghost absolutely
ghostRelativeParent,
    ghostRelativeParentInitialScroll = [],
    // (left, top)
_silent = false,
    savedInputChecked = [];
/** @const */

var documentExists = typeof document !== 'undefined',
    PositionGhostAbsolutely = IOS,
    CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',
    // This will not pass for IE9, because IE9 DnD only works on anchors
supportDraggable = documentExists && !ChromeForAndroid && !IOS && 'draggable' in document.createElement('div'),
    supportCssPointerEvents = function () {
  if (!documentExists) return; // false when <= IE11

  if (IE11OrLess) {
    return false;
  }

  var el = document.createElement('x');
  el.style.cssText = 'pointer-events:auto';
  return el.style.pointerEvents === 'auto';
}(),
    _detectDirection = function _detectDirection(el, options) {
  var elCSS = css$7(el),
      elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
      child1 = getChild(el, 0, options),
      child2 = getChild(el, 1, options),
      firstChildCSS = child1 && css$7(child1),
      secondChildCSS = child2 && css$7(child2),
      firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
      secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;

  if (elCSS.display === 'flex') {
    return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
  }

  if (elCSS.display === 'grid') {
    return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
  }

  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== 'none') {
    var touchingSideChild2 = firstChildCSS["float"] === 'left' ? 'left' : 'right';
    return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
  }

  return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
},
    _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
      dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
      dragElOppLength = vertical ? dragRect.width : dragRect.height,
      targetS1Opp = vertical ? targetRect.left : targetRect.top,
      targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
      targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
},

/**
 * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
 * @param  {Number} x      X position
 * @param  {Number} y      Y position
 * @return {HTMLElement}   Element of the first found nearest Sortable
 */
_detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
  var ret;
  sortables.some(function (sortable) {
    var threshold = sortable[expando].options.emptyInsertThreshold;
    if (!threshold || lastChild(sortable)) return;
    var rect = getRect(sortable),
        insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
        insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;

    if (insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
},
    _prepareGroup = function _prepareGroup(options) {
  function toFn(value, pull) {
    return function (to, from, dragEl, evt) {
      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;

      if (value == null && (pull || sameGroup)) {
        // Default pull value
        // Default pull and put value if same group
        return true;
      } else if (value == null || value === false) {
        return false;
      } else if (pull && value === 'clone') {
        return value;
      } else if (typeof value === 'function') {
        return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
      } else {
        var otherGroup = (pull ? to : from).options.group.name;
        return value === true || typeof value === 'string' && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
      }
    };
  }

  var group = {};
  var originalGroup = options.group;

  if (!originalGroup || _typeof(originalGroup) != 'object') {
    originalGroup = {
      name: originalGroup
    };
  }

  group.name = originalGroup.name;
  group.checkPull = toFn(originalGroup.pull, true);
  group.checkPut = toFn(originalGroup.put);
  group.revertClone = originalGroup.revertClone;
  options.group = group;
},
    _hideGhostForTarget = function _hideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css$7(ghostEl, 'display', 'none');
  }
},
    _unhideGhostForTarget = function _unhideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css$7(ghostEl, 'display', '');
  }
}; // #1184 fix - Prevent click event on fallback if dragged but item not changed position


if (documentExists) {
  document.addEventListener('click', function (evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}

var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;

    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);

    if (nearest) {
      // Create imitation event
      var event = {};

      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }

      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;

      nearest[expando]._onDragOver(event);
    }
  }
};

var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};
/**
 * @class  Sortable
 * @param  {HTMLElement}  el
 * @param  {Object}       [options]
 */


function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }

  this.el = el; // root element

  this.options = options = _extends({}, options); // Export instance

  el[expando] = this;
  var defaults = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    ignore: 'a, img',
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl) {
      dataTransfer.setData('Text', dragEl.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: 'data-id',
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: 'sortable-fallback',
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: Sortable.supportPointer !== false && 'PointerEvent' in window && !Safari,
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults); // Set default options

  for (var name in defaults) {
    !(name in options) && (options[name] = defaults[name]);
  }

  _prepareGroup(options); // Bind all private methods


  for (var fn in this) {
    if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
      this[fn] = this[fn].bind(this);
    }
  } // Setup drag mode


  this.nativeDraggable = options.forceFallback ? false : supportDraggable;

  if (this.nativeDraggable) {
    // Touch start threshold cannot be greater than the native dragstart threshold
    this.options.touchStartThreshold = 1;
  } // Bind events


  if (options.supportPointer) {
    on(el, 'pointerdown', this._onTapStart);
  } else {
    on(el, 'mousedown', this._onTapStart);
    on(el, 'touchstart', this._onTapStart);
  }

  if (this.nativeDraggable) {
    on(el, 'dragover', this);
    on(el, 'dragenter', this);
  }

  sortables.push(this.el); // Restore sorting

  options.store && options.store.get && this.sort(options.store.get(this) || []); // Add animation state manager

  _extends(this, AnimationStateManager());
}

Sortable.prototype =
/** @lends Sortable.prototype */
{
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(
  /** Event|TouchEvent */
  evt) {
    if (!evt.cancelable) return;

    var _this = this,
        el = this.el,
        options = this.options,
        preventOnFilter = options.preventOnFilter,
        type = evt.type,
        touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt,
        target = (touch || evt).target,
        originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
        filter = options.filter;

    _saveInputCheckedState(el); // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.


    if (dragEl) {
      return;
    }

    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return; // only left button and enabled
    } // cancel dnd if original target is content editable


    if (originalTarget.isContentEditable) {
      return;
    } // Safari ignores further event handling after mousedown


    if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === 'SELECT') {
      return;
    }

    target = closest(target, options.draggable, el, false);

    if (target && target.animated) {
      return;
    }

    if (lastDownEl === target) {
      // Ignoring duplicate `down`
      return;
    } // Get the index of the dragged element within its parent


    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable); // Check filter

    if (typeof filter === 'function') {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: 'filter',
          targetEl: target,
          toEl: el,
          fromEl: el
        });

        pluginEvent('filter', _this, {
          evt: evt
        });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    } else if (filter) {
      filter = filter.split(',').some(function (criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);

        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: 'filter',
            targetEl: target,
            fromEl: el,
            toEl: el
          });

          pluginEvent('filter', _this, {
            evt: evt
          });
          return true;
        }
      });

      if (filter) {
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    }

    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    } // Prepare `dragstart`


    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(
  /** Event */
  evt,
  /** Touch */
  touch,
  /** HTMLElement */
  target) {
    var _this = this,
        el = _this.el,
        options = _this.options,
        ownerDocument = el.ownerDocument,
        dragStartFn;

    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style['will-change'] = 'all';

      dragStartFn = function dragStartFn() {
        pluginEvent('delayEnded', _this, {
          evt: evt
        });

        if (Sortable.eventCanceled) {
          _this._onDrop();

          return;
        } // Delayed drag has been triggered
        // we can re-enable the events: touchmove/mousemove


        _this._disableDelayedDragEvents();

        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        } // Bind the events: dragstart/dragend


        _this._triggerDragStart(evt, touch); // Drag start event


        _dispatchEvent({
          sortable: _this,
          name: 'choose',
          originalEvent: evt
        }); // Chosen item


        toggleClass(dragEl, options.chosenClass, true);
      }; // Disable "draggable"


      options.ignore.split(',').forEach(function (criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mouseup', _this._onDrop);
      on(ownerDocument, 'touchend', _this._onDrop);
      on(ownerDocument, 'touchcancel', _this._onDrop); // Make dragEl draggable (must be before delay for FireFox)

      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }

      pluginEvent('delayStart', this, {
        evt: evt
      }); // Delay is impossible for native DnD in Edge or IE

      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();

          return;
        } // If the user moves the pointer or let go the click or touch
        // before the delay has been reached:
        // disable the delayed drag


        on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
        on(ownerDocument, 'touchend', _this._disableDelayedDrag);
        on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
        on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
        on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(
  /** TouchEvent|PointerEvent **/
  e) {
    var touch = e.touches ? e.touches[0] : e;

    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);

    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._disableDelayedDrag);
    off(ownerDocument, 'touchend', this._disableDelayedDrag);
    off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
    off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(
  /** Event */
  evt,
  /** Touch */
  touch) {
    touch = touch || evt.pointerType == 'touch' && evt;

    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, 'pointermove', this._onTouchMove);
      } else if (touch) {
        on(document, 'touchmove', this._onTouchMove);
      } else {
        on(document, 'mousemove', this._onTouchMove);
      }
    } else {
      on(dragEl, 'dragend', this);
      on(rootEl, 'dragstart', this._onDragStart);
    }

    try {
      if (document.selection) {
        // Timeout neccessary for IE9
        _nextTick(function () {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {}
  },
  _dragStarted: function _dragStarted(fallback, evt) {

    awaitingDragStarted = false;

    if (rootEl && dragEl) {
      pluginEvent('dragStarted', this, {
        evt: evt
      });

      if (this.nativeDraggable) {
        on(document, 'dragover', _checkOutsideTargetEl);
      }

      var options = this.options; // Apply effect

      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost(); // Drag start event

      _dispatchEvent({
        sortable: this,
        name: 'start',
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;

      _hideGhostForTarget();

      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;

      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent) break;
        parent = target;
      }

      dragEl.parentNode[expando]._isOutsideThisEl(target);

      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target: target,
              rootEl: parent
            });

            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }

          target = parent; // store last element
        }
        /* jshint boss:true */
        while (parent = parent.parentNode);
      }

      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(
  /**TouchEvent*/
  evt) {
    if (tapEvt) {
      var options = this.options,
          fallbackTolerance = options.fallbackTolerance,
          fallbackOffset = options.fallbackOffset,
          touch = evt.touches ? evt.touches[0] : evt,
          ghostMatrix = ghostEl && matrix(ghostEl, true),
          scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
          scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
          relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent),
          dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
          dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1); // only set the status to dragging, when we are actually dragging

      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }

        this._onDragStart(evt, true);
      }

      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }

        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css$7(ghostEl, 'webkitTransform', cssMatrix);
        css$7(ghostEl, 'mozTransform', cssMatrix);
        css$7(ghostEl, 'msTransform', cssMatrix);
        css$7(ghostEl, 'transform', cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }

      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    // Bug if using scale(): https://stackoverflow.com/questions/2637058
    // Not being adjusted for
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl,
          rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container),
          options = this.options; // Position absolutely

      if (PositionGhostAbsolutely) {
        // Get relatively positioned parent
        ghostRelativeParent = container;

        while (css$7(ghostRelativeParent, 'position') === 'static' && css$7(ghostRelativeParent, 'transform') === 'none' && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }

        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }

        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }

      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css$7(ghostEl, 'transition', '');
      css$7(ghostEl, 'transform', '');
      css$7(ghostEl, 'box-sizing', 'border-box');
      css$7(ghostEl, 'margin', 0);
      css$7(ghostEl, 'top', rect.top);
      css$7(ghostEl, 'left', rect.left);
      css$7(ghostEl, 'width', rect.width);
      css$7(ghostEl, 'height', rect.height);
      css$7(ghostEl, 'opacity', '0.8');
      css$7(ghostEl, 'position', PositionGhostAbsolutely ? 'absolute' : 'fixed');
      css$7(ghostEl, 'zIndex', '100000');
      css$7(ghostEl, 'pointerEvents', 'none');
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl); // Set transform-origin

      css$7(ghostEl, 'transform-origin', tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + '% ' + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + '%');
    }
  },
  _onDragStart: function _onDragStart(
  /**Event*/
  evt,
  /**boolean*/
  fallback) {
    var _this = this;

    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent('dragStart', this, {
      evt: evt
    });

    if (Sortable.eventCanceled) {
      this._onDrop();

      return;
    }

    pluginEvent('setupClone', this);

    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.draggable = false;
      cloneEl.style['will-change'] = '';

      this._hideClone();

      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    } // #1143: IFrame support workaround


    _this.cloneId = _nextTick(function () {
      pluginEvent('clone', _this);
      if (Sortable.eventCanceled) return;

      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }

      _this._hideClone();

      _dispatchEvent({
        sortable: _this,
        name: 'clone'
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true); // Set proper drop events

    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      // Undo what was set in _prepareDragStart before drag started
      off(document, 'mouseup', _this._onDrop);
      off(document, 'touchend', _this._onDrop);
      off(document, 'touchcancel', _this._onDrop);

      if (dataTransfer) {
        dataTransfer.effectAllowed = 'move';
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }

      on(document, 'drop', _this); // #1276 fix:

      css$7(dragEl, 'transform', 'translateZ(0)');
    }

    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, 'selectstart', _this);
    moved = true;

    if (Safari) {
      css$7(document.body, 'user-select', 'none');
    }
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function _onDragOver(
  /**Event*/
  evt) {
    var el = this.el,
        target = evt.target,
        dragRect,
        targetRect,
        revert,
        options = this.options,
        group = options.group,
        activeSortable = Sortable.active,
        isOwner = activeGroup === group,
        canSort = options.sort,
        fromSortable = putSortable || activeSortable,
        vertical,
        _this = this,
        completedFired = false;

    if (_silent) return;

    function dragOverEvent(name, extra) {
      pluginEvent(name, _this, _objectSpread2({
        evt: evt,
        isOwner: isOwner,
        axis: vertical ? 'vertical' : 'horizontal',
        revert: revert,
        dragRect: dragRect,
        targetRect: targetRect,
        canSort: canSort,
        fromSortable: fromSortable,
        target: target,
        completed: completed,
        onMove: function onMove(target, after) {
          return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
        },
        changed: changed
      }, extra));
    } // Capture animation state


    function capture() {
      dragOverEvent('dragOverAnimationCapture');

      _this.captureAnimationState();

      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    } // Return invocation when dragEl is inserted (or completed)


    function completed(insertion) {
      dragOverEvent('dragOverCompleted', {
        insertion: insertion
      });

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }

        if (_this !== fromSortable) {
          // Set ghost class to new sortable's ghost class
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }

        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        } // Animation


        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }

        _this.animateAll(function () {
          dragOverEvent('dragOverAnimationComplete');
          _this._ignoreWhileAnimating = null;
        });

        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      } // Null lastTarget if it is not inside a previously swapped element


      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      } // no bubbling and not fallback


      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target); // Do not detect for empty insert if already inserted


        !insertion && nearestEmptyInsertDetectEvent(evt);
      }

      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    } // Call when dragEl has been inserted


    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);

      _dispatchEvent({
        sortable: _this,
        name: 'change',
        toEl: el,
        newIndex: newIndex,
        newDraggableIndex: newDraggableIndex,
        originalEvent: evt
      });
    }

    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }

    target = closest(target, options.draggable, el, true);
    dragOverEvent('dragOver');
    if (Sortable.eventCanceled) return completedFired;

    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }

    ignoreNextClick = false;

    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) // Reverting item into the original list
    : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === 'vertical';
      dragRect = getRect(dragEl);
      dragOverEvent('dragOverValid');
      if (Sortable.eventCanceled) return completedFired;

      if (revert) {
        parentEl = rootEl; // actualization

        capture();

        this._hideClone();

        dragOverEvent('revert');

        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }

        return completed(true);
      }

      var elLastChild = lastChild(el, options.draggable);

      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        // Insert to end of list
        // If already at end of list: Do not insert
        if (elLastChild === dragEl) {
          return completed(false);
        } // if there is a last element, it is the target


        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }

        if (target) {
          targetRect = getRect(target);
        }

        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          el.appendChild(dragEl);
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
        // Insert to start of list
        var firstChild = getChild(el, 0, options, true);

        if (firstChild === dragEl) {
          return completed(false);
        }

        target = firstChild;
        targetRect = getRect(target);

        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
          capture();
          el.insertBefore(dragEl, firstChild);
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0,
            targetBeforeFirstSwap,
            differentLevel = dragEl.parentNode !== el,
            differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
            side1 = vertical ? 'top' : 'left',
            scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
            scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;

        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }

        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;

        if (direction !== 0) {
          // Check if target is beside dragEl in respective direction (ignoring hidden elements)
          var dragIndex = index(dragEl);

          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css$7(sibling, 'display') === 'none' || sibling === ghostEl));
        } // If dragEl is already beside target: Do not insert


        if (direction === 0 || sibling === target) {
          return completed(false);
        }

        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling,
            after = false;
        after = direction === 1;

        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }

          _silent = true;
          setTimeout(_unsilent, 30);
          capture();

          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          } // Undo chrome's scroll adjustment (has no effect on other browsers)


          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }

          parentEl = dragEl.parentNode; // actualization
          // must be done before animation

          if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }

          changed();
          return completed(true);
        }
      }

      if (el.contains(dragEl)) {
        return completed(false);
      }
    }

    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, 'mousemove', this._onTouchMove);
    off(document, 'touchmove', this._onTouchMove);
    off(document, 'pointermove', this._onTouchMove);
    off(document, 'dragover', nearestEmptyInsertDetectEvent);
    off(document, 'mousemove', nearestEmptyInsertDetectEvent);
    off(document, 'touchmove', nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._onDrop);
    off(ownerDocument, 'touchend', this._onDrop);
    off(ownerDocument, 'pointerup', this._onDrop);
    off(ownerDocument, 'touchcancel', this._onDrop);
    off(document, 'selectstart', this);
  },
  _onDrop: function _onDrop(
  /**Event*/
  evt) {
    var el = this.el,
        options = this.options; // Get the index of the dragged element within its parent

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent('drop', this, {
      evt: evt
    });
    parentEl = dragEl && dragEl.parentNode; // Get again after plugin event

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);

    if (Sortable.eventCanceled) {
      this._nulling();

      return;
    }

    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);

    _cancelNextTick(this.cloneId);

    _cancelNextTick(this._dragStartId); // Unbind events


    if (this.nativeDraggable) {
      off(document, 'drop', this);
      off(el, 'dragstart', this._onDragStart);
    }

    this._offMoveEvents();

    this._offUpEvents();

    if (Safari) {
      css$7(document.body, 'user-select', '');
    }

    css$7(dragEl, 'transform', '');

    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }

      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        // Remove clone(s)
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }

      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, 'dragend', this);
        }

        _disableDraggable(dragEl);

        dragEl.style['will-change'] = ''; // Remove classes
        // ghostClass is added in dragStarted

        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }

        toggleClass(dragEl, this.options.chosenClass, false); // Drag stop event

        _dispatchEvent({
          sortable: this,
          name: 'unchoose',
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });

        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            // Add event
            _dispatchEvent({
              rootEl: parentEl,
              name: 'add',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            }); // Remove event


            _dispatchEvent({
              sortable: this,
              name: 'remove',
              toEl: parentEl,
              originalEvent: evt
            }); // drag from one list and drop into another


            _dispatchEvent({
              rootEl: parentEl,
              name: 'sort',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });

            _dispatchEvent({
              sortable: this,
              name: 'sort',
              toEl: parentEl,
              originalEvent: evt
            });
          }

          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              // drag & drop within the same list
              _dispatchEvent({
                sortable: this,
                name: 'update',
                toEl: parentEl,
                originalEvent: evt
              });

              _dispatchEvent({
                sortable: this,
                name: 'sort',
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }

        if (Sortable.active) {
          /* jshint eqnull:true */
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }

          _dispatchEvent({
            sortable: this,
            name: 'end',
            toEl: parentEl,
            originalEvent: evt
          }); // Save sorting


          this.save();
        }
      }
    }

    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent('nulling', this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function (el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(
  /**Event*/
  evt) {
    switch (evt.type) {
      case 'drop':
      case 'dragend':
        this._onDrop(evt);

        break;

      case 'dragenter':
      case 'dragover':
        if (dragEl) {
          this._onDragOver(evt);

          _globalDragOver(evt);
        }

        break;

      case 'selectstart':
        evt.preventDefault();
        break;
    }
  },

  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function toArray() {
    var order = [],
        el,
        children = this.el.children,
        i = 0,
        n = children.length,
        options = this.options;

    for (; i < n; i++) {
      el = children[i];

      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }

    return order;
  },

  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function sort(order, useAnimation) {
    var items = {},
        rootEl = this.el;
    this.toArray().forEach(function (id, i) {
      var el = rootEl.children[i];

      if (closest(el, this.options.draggable, rootEl, false)) {
        items[id] = el;
      }
    }, this);
    useAnimation && this.captureAnimationState();
    order.forEach(function (id) {
      if (items[id]) {
        rootEl.removeChild(items[id]);
        rootEl.appendChild(items[id]);
      }
    });
    useAnimation && this.animateAll();
  },

  /**
   * Save the current sorting
   */
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },

  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },

  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function option(name, value) {
    var options = this.options;

    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);

      if (typeof modifiedValue !== 'undefined') {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }

      if (name === 'group') {
        _prepareGroup(options);
      }
    }
  },

  /**
   * Destroy
   */
  destroy: function destroy() {
    pluginEvent('destroy', this);
    var el = this.el;
    el[expando] = null;
    off(el, 'mousedown', this._onTapStart);
    off(el, 'touchstart', this._onTapStart);
    off(el, 'pointerdown', this._onTapStart);

    if (this.nativeDraggable) {
      off(el, 'dragover', this);
      off(el, 'dragenter', this);
    } // Remove draggable attributes


    Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
      el.removeAttribute('draggable');
    });

    this._onDrop();

    this._disableDelayedDragEvents();

    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent('hideClone', this);
      if (Sortable.eventCanceled) return;
      css$7(cloneEl, 'display', 'none');

      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }

      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable) {
    if (putSortable.lastPutMode !== 'clone') {
      this._hideClone();

      return;
    }

    if (cloneHidden) {
      pluginEvent('showClone', this);
      if (Sortable.eventCanceled) return; // show clone at dragEl or original position

      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }

      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }

      css$7(cloneEl, 'display', '');
      cloneHidden = false;
    }
  }
};

function _globalDragOver(
/**Event*/
evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = 'move';
  }

  evt.cancelable && evt.preventDefault();
}

function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt,
      sortable = fromEl[expando],
      onMoveFn = sortable.options.onMove,
      retVal; // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent('move', {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent('move', true, true);
  }

  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);

  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }

  return retVal;
}

function _disableDraggable(el) {
  el.draggable = false;
}

function _unsilent() {
  _silent = false;
}

function _ghostIsFirst(evt, vertical, sortable) {
  var rect = getRect(getChild(sortable.el, 0, sortable.options, true));
  var spacer = 10;
  return vertical ? evt.clientX < rect.left - spacer || evt.clientY < rect.top && evt.clientX < rect.right : evt.clientY < rect.top - spacer || evt.clientY < rect.bottom && evt.clientX < rect.left;
}

function _ghostIsLast(evt, vertical, sortable) {
  var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var spacer = 10;
  return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
}

function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
      targetLength = vertical ? targetRect.height : targetRect.width,
      targetS1 = vertical ? targetRect.top : targetRect.left,
      targetS2 = vertical ? targetRect.bottom : targetRect.right,
      invert = false;

  if (!invertSwap) {
    // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
      // check if past first invert threshold on side opposite of lastDirection
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        // past first invert threshold, do not restrict inverted threshold to dragEl shadow
        pastFirstInvertThresh = true;
      }

      if (!pastFirstInvertThresh) {
        // dragEl shadow (target move distance shadow)
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
        : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      // Regular
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }

  invert = invert || invertSwap;

  if (invert) {
    // Invert of regular
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }

  return 0;
}
/**
 * Gets the direction dragEl must be swapped relative to target in order to make it
 * seem that dragEl has been "inserted" into that element's position
 * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
 * @return {Number}                   Direction dragEl must be swapped
 */


function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}
/**
 * Generate id
 * @param   {HTMLElement} el
 * @returns {String}
 * @private
 */


function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent,
      i = str.length,
      sum = 0;

  while (i--) {
    sum += str.charCodeAt(i);
  }

  return sum.toString(36);
}

function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName('input');
  var idx = inputs.length;

  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}

function _nextTick(fn) {
  return setTimeout(fn, 0);
}

function _cancelNextTick(id) {
  return clearTimeout(id);
} // Fixed #973:


if (documentExists) {
  on(document, 'touchmove', function (evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
} // Export utils


Sortable.utils = {
  on: on,
  off: off,
  css: css$7,
  find: find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend: extend,
  throttle: throttle,
  closest: closest,
  toggleClass: toggleClass,
  clone: clone,
  index: index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild: getChild
};
/**
 * Get the Sortable instance of an element
 * @param  {HTMLElement} element The element
 * @return {Sortable|undefined}         The instance of Sortable
 */

Sortable.get = function (element) {
  return element[expando];
};
/**
 * Mount a plugin to Sortable
 * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
 */


Sortable.mount = function () {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }

  if (plugins[0].constructor === Array) plugins = plugins[0];
  plugins.forEach(function (plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }

    if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
    PluginManager.mount(plugin);
  });
};
/**
 * Create sortable instance
 * @param {HTMLElement}  el
 * @param {Object}      [options]
 */


Sortable.create = function (el, options) {
  return new Sortable(el, options);
}; // Export


Sortable.version = version;

var autoScrolls = [],
    scrollEl,
    scrollRootEl,
    scrolling = false,
    lastAutoScrollX,
    lastAutoScrollY,
    touchEvt$1,
    pointerElemChangedInterval;

function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      forceAutoScrollFallback: false,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    }; // Bind all private methods

    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }
  }

  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;

      if (this.sortable.nativeDraggable) {
        on(document, 'dragover', this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, 'pointermove', this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, 'touchmove', this._handleFallbackAutoScroll);
        } else {
          on(document, 'mousemove', this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;

      // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop() {
      if (this.sortable.nativeDraggable) {
        off(document, 'dragover', this._handleAutoScroll);
      } else {
        off(document, 'pointermove', this._handleFallbackAutoScroll);
        off(document, 'touchmove', this._handleFallbackAutoScroll);
        off(document, 'mousemove', this._handleFallbackAutoScroll);
      }

      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;

      var x = (evt.touches ? evt.touches[0] : evt).clientX,
          y = (evt.touches ? evt.touches[0] : evt).clientY,
          elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt; // IE does not seem to have native autoscroll,
      // Edge's autoscroll seems too conditional,
      // MACOS Safari does not have autoscroll,
      // Firefox and Chrome are good

      if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback); // Listener for pointer element change

        var ogElemScroller = getParentAutoScrollElement(elem, true);

        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval(); // Detect for pointer elem change, emulating native DnD behaviour

          pointerElemChangedInterval = setInterval(function () {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);

            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }

            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }

        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: 'scroll',
    initializeByDefault: true
  });
}

function clearAutoScrolls() {
  autoScrolls.forEach(function (autoScroll) {
    clearInterval(autoScroll.pid);
  });
  autoScrolls = [];
}

function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}

var autoScroll = throttle(function (evt, options, rootEl, isFallback) {
  // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  if (!options.scroll) return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX,
      y = (evt.touches ? evt.touches[0] : evt).clientY,
      sens = options.scrollSensitivity,
      speed = options.scrollSpeed,
      winScroller = getWindowScrollingElement();
  var scrollThisInstance = false,
      scrollCustomFn; // New scroll root, set scrollEl

  if (scrollRootEl !== rootEl) {
    scrollRootEl = rootEl;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;

    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl, true);
    }
  }

  var layersOut = 0;
  var currentParent = scrollEl;

  do {
    var el = currentParent,
        rect = getRect(el),
        top = rect.top,
        bottom = rect.bottom,
        left = rect.left,
        right = rect.right,
        width = rect.width,
        height = rect.height,
        canScrollX = void 0,
        canScrollY = void 0,
        scrollWidth = el.scrollWidth,
        scrollHeight = el.scrollHeight,
        elCSS = css$7(el),
        scrollPosX = el.scrollLeft,
        scrollPosY = el.scrollTop;

    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
    }

    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);

    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }

    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);

      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        /* jshint loopfunc:true */

        autoScrolls[layersOut].pid = setInterval(function () {
          // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1); // To move ghost if it is positioned absolutely

          }

          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;

          if (typeof scrollCustomFn === 'function') {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== 'continue') {
              return;
            }
          }

          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }

    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));

  scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
}, 30);

var drop = function drop(_ref) {
  var originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      dragEl = _ref.dragEl,
      activeSortable = _ref.activeSortable,
      dispatchSortableEvent = _ref.dispatchSortableEvent,
      hideGhostForTarget = _ref.hideGhostForTarget,
      unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent) return;
  var toSortable = putSortable || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();

  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent('spill');
    this.onSpill({
      dragEl: dragEl,
      putSortable: putSortable
    });
  }
};

function Revert() {}

Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl = _ref3.dragEl,
        putSortable = _ref3.putSortable;
    this.sortable.captureAnimationState();

    if (putSortable) {
      putSortable.captureAnimationState();
    }

    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);

    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl);
    }

    this.sortable.animateAll();

    if (putSortable) {
      putSortable.animateAll();
    }
  },
  drop: drop
};

_extends(Revert, {
  pluginName: 'revertOnSpill'
});

function Remove() {}

Remove.prototype = {
  onSpill: function onSpill(_ref4) {
    var dragEl = _ref4.dragEl,
        putSortable = _ref4.putSortable;
    var parentSortable = putSortable || this.sortable;
    parentSortable.captureAnimationState();
    dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
    parentSortable.animateAll();
  },
  drop: drop
};

_extends(Remove, {
  pluginName: 'removeOnSpill'
});

Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);

function getConsole() {
    if (typeof window !== 'undefined') {
        return window.console;
    }
    return global.console;
}
const console$1 = getConsole();
function cached(fn) {
    const cache = Object.create(null);
    return function cachedFn(str) {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    };
}
const regex = /-(\w)/g;
const camelize = cached((str) => str.replace(regex, (_, c) => (c ? c.toUpperCase() : '')));
function removeNode(node) {
    if (node.parentElement !== null) {
        node.parentElement.removeChild(node);
    }
}
function insertNodeAt(fatherNode, node, position) {
    const refNode = position === 0
        ? fatherNode.children[0]
        : fatherNode.children[position - 1].nextSibling;
    fatherNode.insertBefore(node, refNode);
}

function computeVmIndex(vnodes, element) {
    return Object.values(vnodes).indexOf(element);
}
function computeIndexes(slots, children, isTransition, footerOffset) {
    if (!slots) {
        return [];
    }
    const elmFromNodes = Object.values(slots);
    const footerIndex = children.length - footerOffset;
    const rawIndexes = [...children].map((elt, idx) => idx >= footerIndex ? elmFromNodes.length : elmFromNodes.indexOf(elt));
    return rawIndexes;
}
function emit(evtName, evtData) {
    //@ts-ignore
    this.$nextTick(() => this.$emit(evtName.toLowerCase(), evtData));
}
function delegateAndEmit(evtName) {
    //@ts-ignore
    return evtData => {
        //@ts-ignore
        if (this.realList !== null) {
            //@ts-ignore
            this['onDrag' + evtName](evtData);
        }
        //@ts-ignore
        emit.call(this, evtName, evtData);
    };
}
function isTransitionName(name) {
    return ['transition-group', 'TransitionGroup'].includes(name);
}
function isTransition(slots) {
    if (!slots || slots.length !== 1) {
        return false;
    }
    // @ts-ignore
    const [{ type }] = slots;
    if (!type) {
        return false;
    }
    //@ts-ignore
    return isTransitionName(type.name);
}
function getComponentAttributes($attrs, componentData) {
    if (!componentData) {
        return $attrs;
    }
    return { ...componentData.props, ...componentData.attrs };
}
const eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End'];
const eventsToEmit = ['Choose', 'Unchoose', 'Sort', 'Filter', 'Clone'];
const readonlyProperties = ['Move', ...eventsListened, ...eventsToEmit].map(evt => 'on' + evt);
// @ts-ignore
let draggingElement = null;
const props = {
    options: Object,
    list: {
        type: Array,
        required: false,
        default: null,
    },
    noTransitionOnDrag: {
        type: Boolean,
        default: false,
    },
    clone: {
        type: Function,
        default: (original) => {
            return original;
        },
    },
    tag: {
        type: String,
        default: 'div',
    },
    move: {
        type: Function,
        default: null,
    },
    componentData: {
        type: Object,
        required: false,
        default: null,
    },
    component: {
        type: String,
        default: null,
    },
    modelValue: {
        type: Array,
        required: false,
        default: null,
    },
};
const VueDraggableNext = defineComponent({
    name: 'VueDraggableNext',
    inheritAttrs: false,
    emits: [
        'update:modelValue',
        'move',
        'change',
        ...eventsListened.map(s => s.toLowerCase()),
        ...eventsToEmit.map(s => s.toLowerCase()),
    ],
    props,
    data() {
        return {
            transitionMode: false,
            noneFunctionalComponentMode: false,
            headerOffset: 0,
            footerOffset: 0,
            _sortable: {},
            visibleIndexes: [],
            context: {},
        };
    },
    render() {
        const slots = this.$slots.default ? this.$slots.default() : null;
        const attrs = getComponentAttributes(this.$attrs, this.componentData);
        if (!slots)
            return h(this.getTag(), attrs, []);
        this.transitionMode = isTransition(slots);
        return h(this.getTag(), attrs, slots);
    },
    created() {
        if (this.list !== null && this.modelValue !== null) {
            console$1.error('list props are mutually exclusive! Please set one.');
        }
    },
    mounted() {
        const optionsAdded = {};
        eventsListened.forEach(elt => {
            optionsAdded['on' + elt] = delegateAndEmit.call(this, elt);
        });
        eventsToEmit.forEach(elt => {
            optionsAdded['on' + elt] = emit.bind(this, elt);
        });
        const attributes = Object.keys(this.$attrs).reduce((res, key) => {
            res[camelize(key)] = this.$attrs[key];
            return res;
        }, {});
        const options = Object.assign({}, attributes, optionsAdded, {
            onMove: (evt, originalEvent) => {
                return this.onDragMove(evt, originalEvent);
            },
        });
        !('draggable' in options) && (options.draggable = '>*');
        const targetDomElement = this.$el.nodeType === 1 ? this.$el : this.$el.parentElement;
        this._sortable = new Sortable(targetDomElement, options);
        targetDomElement.__draggable_component__ = this;
        this.computeIndexes();
    },
    beforeUnmount() {
        try {
            if (this._sortable !== undefined)
                this._sortable.destroy();
        }
        catch (error) { }
    },
    computed: {
        realList() {
            return this.list ? this.list : this.modelValue;
        },
    },
    watch: {
        $attrs: {
            handler(newOptionValue) {
                this.updateOptions(newOptionValue);
            },
            deep: true,
        },
        realList() {
            this.computeIndexes();
        },
    },
    methods: {
        getTag() {
            return this.component ? resolveComponent(this.component) : this.tag;
        },
        updateOptions(newOptionValue) {
            for (var property in newOptionValue) {
                const value = camelize(property);
                if (readonlyProperties.indexOf(value) === -1) {
                    this._sortable.option(value, newOptionValue[property]);
                }
            }
        },
        getChildrenNodes() {
            return this.$el.children;
        },
        computeIndexes() {
            this.$nextTick(() => {
                this.visibleIndexes = computeIndexes(this.getChildrenNodes(), this.$el.children, this.transitionMode, this.footerOffset);
            });
        },
        getUnderlyingVm(htmlElt) {
            const index = computeVmIndex(this.getChildrenNodes() || [], htmlElt);
            if (index === -1) {
                //Edge case during move callback: related element might be
                //an element different from collection
                return null;
            }
            //@ts-ignore
            const element = this.realList[index];
            return { index, element };
        },
        emitChanges(evt) {
            this.$nextTick(() => {
                this.$emit('change', evt);
            });
        },
        alterList(onList) {
            if (this.list) {
                onList(this.list);
                return;
            }
            const newList = [...this.modelValue];
            onList(newList);
            this.$emit('update:modelValue', newList);
        },
        spliceList() {
            const spliceList = (list) => list.splice(...arguments);
            this.alterList(spliceList);
        },
        updatePosition(oldIndex, newIndex) {
            const updatePosition = (list) => list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
            this.alterList(updatePosition);
        },
        getVmIndex(domIndex) {
            const indexes = this.visibleIndexes;
            const numberIndexes = indexes.length;
            return domIndex > numberIndexes - 1 ? numberIndexes : indexes[domIndex];
        },
        getComponent() {
            return this.$slots.default
                ? //@ts-ignore
                    this.$slots.default()[0].componentInstance
                : null;
        },
        resetTransitionData(index) {
            if (!this.noTransitionOnDrag || !this.transitionMode) {
                return;
            }
            var nodes = this.getChildrenNodes();
            nodes[index].data = null;
            const transitionContainer = this.getComponent();
            transitionContainer.children = [];
            transitionContainer.kept = undefined;
        },
        onDragStart(evt) {
            this.computeIndexes();
            this.context = this.getUnderlyingVm(evt.item);
            if (!this.context)
                return;
            evt.item._underlying_vm_ = this.clone(this.context.element);
            draggingElement = evt.item;
        },
        onDragAdd(evt) {
            const element = evt.item._underlying_vm_;
            if (element === undefined) {
                return;
            }
            removeNode(evt.item);
            const newIndex = this.getVmIndex(evt.newIndex);
            //@ts-ignore
            this.spliceList(newIndex, 0, element);
            this.computeIndexes();
            const added = { element, newIndex };
            this.emitChanges({ added });
        },
        onDragRemove(evt) {
            insertNodeAt(this.$el, evt.item, evt.oldIndex);
            if (evt.pullMode === 'clone') {
                removeNode(evt.clone);
                return;
            }
            if (!this.context)
                return;
            const oldIndex = this.context.index;
            //@ts-ignore
            this.spliceList(oldIndex, 1);
            const removed = { element: this.context.element, oldIndex };
            this.resetTransitionData(oldIndex);
            this.emitChanges({ removed });
        },
        onDragUpdate(evt) {
            removeNode(evt.item);
            insertNodeAt(evt.from, evt.item, evt.oldIndex);
            //@ts-ignore
            const oldIndex = this.context.index;
            const newIndex = this.getVmIndex(evt.newIndex);
            this.updatePosition(oldIndex, newIndex);
            //@ts-ignore
            const moved = { element: this.context.element, oldIndex, newIndex };
            this.emitChanges({ moved });
        },
        updateProperty(evt, propertyName) {
            evt.hasOwnProperty(propertyName) &&
                (evt[propertyName] += this.headerOffset);
        },
        onDragMove(evt, originalEvent) {
            const onMove = this.move;
            if (!onMove || !this.realList) {
                return true;
            }
            const relatedContext = this.getRelatedContextFromMoveEvent(evt);
            const draggedContext = this.context;
            const futureIndex = this.computeFutureIndex(relatedContext, evt);
            Object.assign(draggedContext, { futureIndex });
            const sendEvt = Object.assign({}, evt, {
                relatedContext,
                draggedContext,
            });
            return onMove(sendEvt, originalEvent);
        },
        onDragEnd() {
            this.computeIndexes();
            draggingElement = null;
        },
        getTrargetedComponent(htmElement) {
            return htmElement.__draggable_component__;
        },
        getRelatedContextFromMoveEvent({ to, related }) {
            const component = this.getTrargetedComponent(to);
            if (!component) {
                return { component };
            }
            const list = component.realList;
            const context = { list, component };
            if (to !== related && list && component.getUnderlyingVm) {
                const destination = component.getUnderlyingVm(related);
                if (destination) {
                    return Object.assign(destination, context);
                }
            }
            return context;
        },
        computeFutureIndex(relatedContext, evt) {
            const domChildren = [...evt.to.children].filter(el => el.style['display'] !== 'none');
            if (domChildren.length === 0)
                return 0;
            const currentDOMIndex = domChildren.indexOf(evt.related);
            const currentIndex = relatedContext.component.getVmIndex(currentDOMIndex);
            const draggedInList = domChildren.indexOf(draggingElement) !== -1;
            return draggedInList || !evt.willInsertAfter
                ? currentIndex
                : currentIndex + 1;
        },
    },
});

function p(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,n);}return i}function g(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?p(Object(i),!0).forEach((function(e){f(t,e,i[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):p(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e));}));}return t}function f(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function v(t,e){if(null==t)return {};var i,n,s=function(t,e){if(null==t)return {};var i,n,s={},o=Object.keys(t);for(n=0;n<o.length;n++)i=o[n],e.indexOf(i)>=0||(s[i]=t[i]);return s}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(n=0;n<o.length;n++)i=o[n],e.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(t,i)&&(s[i]=t[i]);}return s}function b(t){return function(t){if(Array.isArray(t))return w(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return w(t,e);var i=Object.prototype.toString.call(t).slice(8,-1);"Object"===i&&t.constructor&&(i=t.constructor.name);if("Map"===i||"Set"===i)return Array.from(t);if("Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i))return w(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function w(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,n=new Array(e);i<e;i++)n[i]=t[i];return n}var y,z,R,A=(y=function(t){
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
!function(){var e={}.hasOwnProperty;function i(){for(var t=[],n=0;n<arguments.length;n++){var s=arguments[n];if(s){var o=typeof s;if("string"===o||"number"===o)t.push(s);else if(Array.isArray(s)){if(s.length){var r=i.apply(null,s);r&&t.push(r);}}else if("object"===o)if(s.toString===Object.prototype.toString)for(var a in s)e.call(s,a)&&s[a]&&t.push(a);else t.push(s.toString());}}return t.join(" ")}t.exports?(i.default=i,t.exports=i):window.classNames=i;}();},y(R={path:z,exports:{},require:function(t,e){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==e&&R.path)}},R.exports),R.exports),M=function(t){return function(e,i){if(!e)return t;var n;"string"==typeof e?n=e:i=e;var s=t;return n&&(s+="__"+n),s+(i?Object.keys(i).reduce((function(t,e){var n=i[e];return n&&(t+=" "+("boolean"==typeof n?s+"--"+e:s+"--"+e+"_"+n)),t}),""):"")}};function S(t,e,i){var n,s,o,r,a;function h(){var c=Date.now()-r;c<e&&c>=0?n=setTimeout(h,e-c):(n=null,i||(a=t.apply(o,s),o=s=null));}null==e&&(e=100);var c=function(){o=this,s=arguments,r=Date.now();var c=i&&!n;return n||(n=setTimeout(h,e)),c&&(a=t.apply(o,s),o=s=null),a};return c.clear=function(){n&&(clearTimeout(n),n=null);},c.flush=function(){n&&(a=t.apply(o,s),o=s=null,clearTimeout(n),n=null);},c}S.debounce=S;var x=S,C=function(){return C=Object.assign||function(t){for(var e,i=1,n=arguments.length;i<n;i++)for(var s in e=arguments[i])Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t},C.apply(this,arguments)};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function E(t,e){var i,n;return t&&e?(i=""+t+e[0].toUpperCase()+e.slice(1),n=t+"-"+e):(i=t||e,n=t||e),{name:i,classname:n}}function W(t){return /^blob:/.test(t)}function T(t){return W(t)||function(t){return /^data:/.test(t)}(t)}function O(t){return !!(t&&t.constructor&&t.call&&t.apply)}function D(t){return void 0===t}function H(t){return "object"==typeof t&&null!==t}function j(t,e,i){var n={};return H(t)?(Object.keys(e).forEach((function(s){D(t[s])?n[s]=e[s]:H(e[s])?H(t[s])?n[s]=j(t[s],e[s],i[s]):n[s]=t[s]?e[s]:i[s]:!0===e[s]||!1===e[s]?n[s]=Boolean(t[s]):n[s]=t[s];})),n):t?e:i}function L(t){var e=Number(t);return Number.isNaN(e)?t:e}function P(t){return typeof("number"==t||function(t){return "object"==typeof t&&null!==t}(t)&&"[object Number]"==toString.call(t))&&!$(t)}function $(t){return t!=t}function I(t,e){return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))}var B=function(t,e){void 0===t&&(t={}),void 0===e&&(e={}),this.type="manipulateImage",this.move=t,this.scale=e;},X=function(t,e){void 0===e&&(e={}),this.type="resize",this.directions=t,this.params=e;},Y=function(t){this.type="move",this.directions=t;},k=function(){function t(t,e,i,n,s){this.type="drag",this.nativeEvent=t,this.position=i,this.previousPosition=n,this.element=e,this.anchor=s;}return t.prototype.shift=function(){var t=this,e=t.element,i=t.anchor,n=t.position;if(e){var s=e.getBoundingClientRect(),o=s.left,r=s.top;return {left:n.left-o-i.left,top:n.top-r-i.top}}return {left:0,top:0}},t}(),F={name:"DraggableElement",props:{classname:{type:String}},beforeMount:function(){window.addEventListener("mouseup",this.onMouseUp,{passive:!1}),window.addEventListener("mousemove",this.onMouseMove,{passive:!1}),window.addEventListener("touchmove",this.onTouchMove,{passive:!1}),window.addEventListener("touchend",this.onTouchEnd,{passive:!1});},beforeUnmount:function(){window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("touchend",this.onTouchEnd);},mounted:function(){if(!this.$refs.draggable)throw new Error('You should add ref "draggable" to your root element to use draggable mixin');this.touches=[],this.hovered=!1;},methods:{onMouseOver:function(){this.hovered||(this.hovered=!0,this.$emit("enter"));},onMouseLeave:function(){this.hovered&&!this.touches.length&&(this.hovered=!1,this.$emit("leave"));},onTouchStart:function(t){t.cancelable&&!this.disabled&&1===t.touches.length&&(this.touches=b(t.touches),this.hovered||(this.$emit("enter"),this.hovered=!0),t.touches.length&&this.initAnchor(this.touches.reduce((function(e,i){return {clientX:e.clientX+i.clientX/t.touches.length,clientY:e.clientY+i.clientY/t.touches.length}}),{clientX:0,clientY:0})),t.preventDefault&&t.preventDefault(),t.stopPropagation());},onTouchEnd:function(){this.processEnd();},onTouchMove:function(t){this.touches.length&&(this.processMove(t,t.touches),t.preventDefault&&t.preventDefault(),t.stopPropagation&&t.stopPropagation());},onMouseDown:function(t){if(!this.disabled){var e={fake:!0,clientX:t.clientX,clientY:t.clientY};this.touches=[e],this.initAnchor(e),t.stopPropagation();}},onMouseMove:function(t){this.touches.length&&(this.processMove(t,[{fake:!0,clientX:t.clientX,clientY:t.clientY}]),t.preventDefault&&t.preventDefault());},onMouseUp:function(){this.processEnd();},initAnchor:function(t){var e=this.$refs.draggable.getBoundingClientRect(),i=e.left,n=e.right,s=e.bottom,o=e.top;this.anchor={left:t.clientX-i,top:t.clientY-o,bottom:s-t.clientY,right:n-t.clientX};},processMove:function(t,e){var i=b(e);if(this.touches.length){if(1===this.touches.length&&1===i.length){var n=this.$refs.draggable;this.$emit("drag",new k(t,n,{left:i[0].clientX,top:i[0].clientY},{left:this.touches[0].clientX,top:this.touches[0].clientY},this.anchor));}this.touches=i;}},processEnd:function(){this.touches.length&&this.$emit("drag-end"),this.hovered&&(this.$emit("leave"),this.hovered=!1),this.touches=[];}},emits:["drag","drag-end","leave","enter"]};F.render=function(n,s,o,r,a,h){return openBlock(),createBlock("div",{ref:"draggable",class:o.classname,onTouchstart:s[1]||(s[1]=function(){return h.onTouchStart&&h.onTouchStart.apply(h,arguments)}),onMousedown:s[2]||(s[2]=function(){return h.onMouseDown&&h.onMouseDown.apply(h,arguments)}),onMouseover:s[3]||(s[3]=function(){return h.onMouseOver&&h.onMouseOver.apply(h,arguments)}),onMouseleave:s[4]||(s[4]=function(){return h.onMouseLeave&&h.onMouseLeave.apply(h,arguments)})},[renderSlot(n.$slots,"default")],34)};var U=M("vue-handler-wrapper"),N={name:"HandlerWrapper",components:{DraggableElement:F},props:{horizontalPosition:{type:String},verticalPosition:{type:String},disabled:{type:Boolean,default:!1}},computed:{classes:function(){var t;if(this.horizontalPosition||this.verticalPosition){var e,i=E(this.horizontalPosition,this.verticalPosition);t=U((f(e={},i.classname,!0),f(e,"disabled",this.disabled),e));}else t=U({disabled:this.disabled});return {root:t,draggable:U("draggable")}}},emits:["leave","enter","drag","drag-end"]};N.render=function(r,a,h,c,l,u){var d=resolveComponent("DraggableElement");return openBlock(),createBlock("div",{class:u.classes.root},[createVNode(d,{class:u.classes.draggable,onDrag:a[1]||(a[1]=function(t){return r.$emit("drag",t)}),onDragEnd:a[2]||(a[2]=function(t){return r.$emit("drag-end")}),onLeave:a[3]||(a[3]=function(t){return r.$emit("leave")}),onEnter:a[4]||(a[4]=function(t){return r.$emit("enter")})},{default:withCtx((function(){return [renderSlot(r.$slots,"default")]})),_:3},8,["class"])],2)};var Z=M("vue-line-wrapper"),q={name:"LineWrapper",components:{DraggableElement:F},props:{position:{type:String,required:!0},disabled:{type:Boolean,default:!1}},computed:{classname:function(){var t;return Z((f(t={},this.position,!0),f(t,"disabled",this.disabled),t))}},emits:["leave","enter","drag","drag-end"]};q.render=function(s,r,a,h,c,l){var u=resolveComponent("DraggableElement");return openBlock(),createBlock(u,{class:l.classname,onDrag:r[1]||(r[1]=function(t){return s.$emit("drag",t)}),onDragEnd:r[2]||(r[2]=function(t){return s.$emit("drag-end")}),onLeave:r[3]||(r[3]=function(t){return s.$emit("leave")}),onEnter:r[4]||(r[4]=function(t){return s.$emit("enter")})},{default:withCtx((function(){return [renderSlot(s.$slots,"default")]})),_:3},8,["class"])};var V=["left","right","top","bottom"],_=["left","right"],G=["top","bottom"],Q=["left","top"],K=["fill-area","fit-area","stencil","none"],J={left:0,top:0,width:0,height:0};function tt(t,e,i){return !(i=i||["width","height","left","top"]).some((function(i){return t[i]!==e[i]}))}function et(t){return {left:t.left,top:t.top,right:t.left+t.width,bottom:t.top+t.height}}function it(t,e){return {left:t.left-e.left,top:t.top-e.top}}function nt(t){return {left:t.left+t.width/2,top:t.top+t.height/2}}function st(t,e){var i={left:0,top:0,right:0,bottom:0};return V.forEach((function(n){var s=e[n],o=et(t)[n];i[n]=void 0!==s&&void 0!==o?"left"===n||"top"===n?Math.max(0,s-o):Math.max(0,o-s):0;})),i}function ot(t,e){return {left:t.left-e.left,top:t.top-e.top,width:t.width+e.left+e.right,height:t.height+e.top+e.bottom}}function rt(t){return {left:-t.left,top:-t.top}}function at(t,e){return C(C({},t),{left:t.left+e.left,top:t.top+e.top})}function ht(t,e,i,n){if(1!==e){if(i){var s=nt(t);return {width:t.width*e,height:t.height*e,left:t.left+t.width*(1-e)/2+(i.left-s.left)*(n||1-e),top:t.top+t.height*(1-e)/2+(i.top-s.top)*(n||1-e)}}return {width:t.width*e,height:t.height*e,left:t.left+t.width*(1-e)/2,top:t.top+t.height*(1-e)/2}}return t}function ct(t){return t.width/t.height}function lt(t,e){return Math.min(void 0!==e.right&&void 0!==e.left?(e.right-e.left)/t.width:1/0,void 0!==e.bottom&&void 0!==e.top?(e.bottom-e.top)/t.height:1/0)}function ut(t,e){var i={left:0,top:0},n=st(t,e);return n.left&&n.left>0?i.left=n.left:n.right&&n.right>0&&(i.left=-n.right),n.top&&n.top>0?i.top=n.top:n.bottom&&n.bottom>0&&(i.top=-n.bottom),i}function dt(t,e){var i;return e.minimum&&t<e.minimum?i=e.minimum:e.maximum&&t>e.maximum&&(i=e.maximum),i}function mt(t,e){var i=ct(t),n=ct(e);return e.width<1/0&&e.height<1/0?i>n?{width:e.width,height:e.width/i}:{width:e.height*i,height:e.height}:e.width<1/0?{width:e.width,height:e.width/i}:e.height<1/0?{width:e.height*i,height:e.height}:t}function pt(t,e){var i=e*Math.PI/180;return {width:Math.abs(t.width*Math.cos(i))+Math.abs(t.height*Math.sin(i)),height:Math.abs(t.width*Math.sin(i))+Math.abs(t.height*Math.cos(i))}}function gt(t,e){var i=e*Math.PI/180;return {left:t.left*Math.cos(i)-t.top*Math.sin(i),top:t.left*Math.sin(i)+t.top*Math.cos(i)}}function ft(t,e){var i=st(vt(t,e),e);return i.left+i.right+i.top+i.bottom?i.left+i.right>i.top+i.bottom?Math.min((t.width+i.left+i.right)/t.width,lt(t,e)):Math.min((t.height+i.top+i.bottom)/t.height,lt(t,e)):1}function vt(t,e,i){void 0===i&&(i=!1);var n=ut(t,e);return at(t,i?rt(n):n)}function bt(t){return {width:void 0!==t.right&&void 0!==t.left?t.right-t.left:1/0,height:void 0!==t.bottom&&void 0!==t.top?t.bottom-t.top:1/0}}function wt(t,e){return C(C({},t),{minWidth:Math.min(e.width,t.minWidth),minHeight:Math.min(e.height,t.minHeight),maxWidth:Math.min(e.width,t.maxWidth),maxHeight:Math.min(e.height,t.maxHeight)})}function yt(t,e,i){void 0===i&&(i=!0);var n={};return V.forEach((function(s){var o=t[s],r=e[s];void 0!==o&&void 0!==r?n[s]="left"===s||"top"===s?i?Math.max(o,r):Math.min(o,r):i?Math.min(o,r):Math.max(o,r):void 0!==r?n[s]=r:void 0!==o&&(n[s]=o);})),n}function zt(t,e){return yt(t,e,!0)}function Rt(t){var e=t.size,i=t.aspectRatio,n=t.ignoreMinimum,s=t.sizeRestrictions;return Boolean((e.correctRatio||ct(e)>=i.minimum&&ct(e)<=i.maximum)&&e.height<=s.maxHeight&&e.width<=s.maxWidth&&e.width&&e.height&&(n||e.height>=s.minHeight&&e.width>=s.minWidth))}function At(t,e){return Math.pow(t.width-e.width,2)+Math.pow(t.height-e.height,2)}function Mt(t){var e=t.width,i=t.height,n=t.sizeRestrictions,s={minimum:t.aspectRatio&&t.aspectRatio.minimum||0,maximum:t.aspectRatio&&t.aspectRatio.maximum||1/0},o={width:Math.max(n.minWidth,Math.min(n.maxWidth,e)),height:Math.max(n.minHeight,Math.min(n.maxHeight,i))};function r(t,o){return void 0===o&&(o=!1),t.reduce((function(t,r){return Rt({size:r,aspectRatio:s,sizeRestrictions:n,ignoreMinimum:o})&&(!t||At(r,{width:e,height:i})<At(t,{width:e,height:i}))?r:t}),null)}var a=[];s&&[s.minimum,s.maximum].forEach((function(t){t&&a.push({width:o.width,height:o.width/t,correctRatio:!0},{width:o.height*t,height:o.height,correctRatio:!0});})),Rt({size:o,aspectRatio:s,sizeRestrictions:n})&&a.push(o);var h=r(a)||r(a,!0);return h&&{width:h.width,height:h.height}}function St(t){var e=t.event,i=t.coordinates,n=t.positionRestrictions,s=void 0===n?{}:n,o=at(i,e.directions);return at(o,ut(o,s))}function xt(t){var e=t.coordinates,i=t.transform,n=t.imageSize,s=t.sizeRestrictions,o=t.positionRestrictions,r=t.aspectRatio,a=t.visibleArea,h=function(t,e){return St({coordinates:t,positionRestrictions:o,event:new Y({left:e.left-t.left,top:e.top-t.top})})},c=C({},e);return (Array.isArray(i)?i:[i]).forEach((function(t){var e={};D((e="function"==typeof t?t({coordinates:c,imageSize:n,visibleArea:a}):t).width)&&D(e.height)||(c=function(t,e){var i=C(C(C({},t),Mt({width:e.width,height:e.height,sizeRestrictions:s,aspectRatio:r})),{left:0,top:0});return h(i,{left:t.left,top:t.top})}(c,C(C({},c),e))),D(e.left)&&D(e.top)||(c=h(c,C(C({},c),e)));})),c}function Ct(t){t.event;var e=t.getAreaRestrictions,i=t.boundaries,n=t.coordinates,s=t.visibleArea;t.aspectRatio;var o=t.stencilSize,r=t.sizeRestrictions,a=t.positionRestrictions;t.stencilReference;var h,c,l,u=C({},n),d=C({},s),m=C({},o);h=ct(m),c=ct(u),void 0===l&&(l=.001),(0===h||0===c?Math.abs(c-h)<l:Math.abs(c/h)<1+l&&Math.abs(c/h)>1-l)||(u=C(C({},u),Mt({sizeRestrictions:r,width:u.width,height:u.height,aspectRatio:{minimum:ct(m),maximum:ct(m)}})));var p=ft(d=ht(d,u.width*i.width/(d.width*m.width)),e({visibleArea:d,type:"resize"}));return 1!==p&&(d=ht(d,p),u=ht(u,p)),d=vt(d=at(d,it(nt(u),nt(d))),e({visibleArea:d,type:"move"})),{coordinates:u=vt(u,zt(et(d),a)),visibleArea:d}}function Et(t){var e=t.event,i=t.getAreaRestrictions,n=t.boundaries,s=t.coordinates,o=t.visibleArea;t.aspectRatio,t.stencilSize,t.sizeRestrictions;var r=t.positionRestrictions;t.stencilReference;var a=C({},s),h=C({},o);if(s&&o&&"manipulateImage"!==e.type){var c={width:0,height:0};h.width,n.width,ct(n)>ct(a)?(c.height=.8*n.height,c.width=c.height*ct(a)):(c.width=.8*n.width,c.height=c.width*ct(a));var l=ft(h=ht(h,a.width*n.width/(h.width*c.width)),i({visibleArea:h,type:"resize"}));h=ht(h,l),1!==l&&(c.height/=l,c.width/=l),h=vt(h=at(h,it(nt(a),nt(h))),i({visibleArea:h,type:"move"})),a=vt(a,zt(et(h),r));}return {coordinates:a,visibleArea:h}}function Wt(t){var e=t.event,i=t.coordinates,n=t.visibleArea,s=t.getAreaRestrictions,o=C({},n),r=C({},i);if("setCoordinates"===e.type){var a=Math.max(0,r.width-o.width),h=Math.max(0,r.height-o.height);a>h?o=ht(o,Math.min(r.width/o.width,lt(o,s({visibleArea:o,type:"resize"})))):h>a&&(o=ht(o,Math.min(r.height/o.height,lt(o,s({visibleArea:o,type:"resize"}))))),o=vt(o=at(o,rt(ut(r,et(o)))),s({visibleArea:o,type:"move"}));}return {visibleArea:o,coordinates:r}}function Tt(t){var e=t.imageSize,i=t.visibleArea,n=t.coordinates,s=i||e;return {left:(i?i.left:0)+s.width/2-n.width/2,top:(i?i.top:0)+s.height/2-n.height/2}}function Ot(t){var e=t.imageSize,i=t.visibleArea,n=t.aspectRatio,s=t.sizeRestrictions,o=i||e,r=Math.min(n.maximum||1/0,Math.max(n.minimum||0,ct(o))),a=o.width<o.height?{width:.8*o.width,height:.8*o.width/r}:{height:.8*o.height,width:.8*o.height*r};return Mt(C(C({},a),{aspectRatio:n,sizeRestrictions:s}))}function Dt(t){var e,i,n=t.imageSize,s=t.visibleArea,o=t.boundaries,r=t.aspectRatio,a=t.sizeRestrictions,h=t.stencilSize,c=s||n;return ct(c)>ct(o)?i=(e=h.height*c.height/o.height)*ct(h):e=(i=h.width*c.width/o.width)/ct(h),Mt({width:i,height:e,aspectRatio:r,sizeRestrictions:a})}function Ht(t){var e=t.getAreaRestrictions,i=t.coordinates,n=t.imageSize,s=ct(t.boundaries);if(i){var o={height:Math.max(i.height,n.height),width:Math.max(i.width,n.width)},r=mt({width:ct(o)>s?o.width:o.height*s,height:ct(o)>s?o.width/s:o.height},bt(e())),a={left:i.left+i.width/2-r.width/2,top:i.top+i.height/2-r.height/2,width:r.width,height:r.height},h=st(i,et(C({left:0,top:0},n))),c={};return !h.left&&!h.right&&a.width<=n.width&&(c.left=0,c.right=n.width),!h.top&&!h.bottom&&a.height<=n.height&&(c.top=0,c.bottom=n.height),vt(a,c)}var l=ct(n);r={height:l>s?n.height:n.width/s,width:l>s?n.height*s:n.width};return {left:n.width/2-r.width/2,top:n.height/2-r.height/2,width:r.width,height:r.height}}function jt(t,e){return yt(t,et(e))}function Lt(t){var e=t.event,i=t.coordinates,n=t.visibleArea,s=t.sizeRestrictions,o=t.getAreaRestrictions,r=t.positionRestrictions,a=t.adjustStencil,h=e.scale,c=e.move,l=C({},n),u=C({},i),d=1,m=1,p=h.factor&&Math.abs(h.factor-1)>.001;l=at(l,{left:c.left||0,top:c.top||0});var g={stencil:{minimum:Math.max(s.minWidth?s.minWidth/u.width:0,s.minHeight?s.minHeight/u.height:0),maximum:Math.min(s.maxWidth?s.maxWidth/u.width:1/0,s.maxHeight?s.maxHeight/u.height:1/0,lt(u,r))},area:{maximum:lt(l,o({visibleArea:l,type:"resize"}))}};h.factor&&p&&(h.factor<1?(m=Math.max(h.factor,g.stencil.minimum))>1&&(m=1):h.factor>1&&(m=Math.min(h.factor,Math.min(g.area.maximum,g.stencil.maximum)))<1&&(m=1)),m&&(l=ht(l,m,h.center));var f=i.left-n.left,v=n.width+n.left-(i.width+i.left),b=i.top-n.top,w=n.height+n.top-(i.height+i.top);return l=vt(l=at(l,ut(l,{left:void 0!==r.left?r.left-f*m:void 0,top:void 0!==r.top?r.top-b*m:void 0,bottom:void 0!==r.bottom?r.bottom+w*m:void 0,right:void 0!==r.right?r.right+v*m:void 0})),o({visibleArea:l,type:"move"})),u.width=u.width*m,u.height=u.height*m,u.left=l.left+f*m,u.top=l.top+b*m,u=vt(u,zt(et(l),r)),h.factor&&p&&a&&(h.factor>1?d=Math.min(g.area.maximum,h.factor)/m:h.factor<1&&(d=Math.max(u.height/l.height,u.width/l.width,h.factor/m)),1!==d&&(l=at(l=vt(l=ht(l,d,h.factor>1?h.center:nt(u)),o({visibleArea:l,type:"move"})),rt(ut(u,et(l)))))),{coordinates:u,visibleArea:l}}function Pt(t){var e=t.aspectRatio,i=t.getAreaRestrictions,n=t.coordinates,s=t.visibleArea,o=t.sizeRestrictions,r=t.positionRestrictions,a=t.imageSize,h=t.previousImageSize,c=t.angle,l=C({},n),u=C({},s),d=gt(nt(C({left:0,top:0},h)),c);return (l=C(C({},Mt({sizeRestrictions:o,aspectRatio:e,width:l.width,height:l.height})),gt(nt(l),c))).left-=d.left-a.width/2+l.width/2,l.top-=d.top-a.height/2+l.height/2,u=ht(u,ft(u,i({visibleArea:u,type:"resize"}))),{coordinates:l=vt(l,r),visibleArea:u=vt(u=at(u,it(nt(l),nt(n))),i({visibleArea:u,type:"move"}))}}function $t(t){var e=t.flip,i=t.previousFlip,n=t.rotate;t.aspectRatio;var s=t.getAreaRestrictions,o=t.coordinates,r=t.visibleArea,a=t.imageSize,h=C({},o),c=C({},r),l=i.horizontal!==e.horizontal,u=i.vertical!==e.vertical;if(l||u){var d=gt({left:a.width/2,top:a.height/2},-n),m=gt(nt(h),-n),p=gt({left:l?d.left-(m.left-d.left):m.left,top:u?d.top-(m.top-d.top):m.top},n);h=at(h,it(p,nt(h))),m=gt(nt(c),-n),c=vt(c=at(c,it(p=gt({left:l?d.left-(m.left-d.left):m.left,top:u?d.top-(m.top-d.top):m.top},n),nt(c))),s({visibleArea:c,type:"move"}));}return {coordinates:h,visibleArea:c}}function It(t){var e=t.directions,i=t.coordinates,n=t.positionRestrictions,s=void 0===n?{}:n,o=t.sizeRestrictions,r=t.preserveRatio,a=t.compensate,h=C({},e),c=ot(i,h).width,l=ot(i,h).height;c<0&&(h.left<0&&h.right<0?(h.left=-(i.width-o.minWidth)/(h.left/h.right),h.right=-(i.width-o.minWidth)/(h.right/h.left)):h.left<0?h.left=-(i.width-o.minWidth):h.right<0&&(h.right=-(i.width-o.minWidth))),l<0&&(h.top<0&&h.bottom<0?(h.top=-(i.height-o.minHeight)/(h.top/h.bottom),h.bottom=-(i.height-o.minHeight)/(h.bottom/h.top)):h.top<0?h.top=-(i.height-o.minHeight):h.bottom<0&&(h.bottom=-(i.height-o.minHeight)));var u=st(ot(i,h),s);a&&(u.left&&u.left>0&&0===u.right?(h.right+=u.left,h.left-=u.left):u.right&&u.right>0&&0===u.left&&(h.left+=u.right,h.right-=u.right),u.top&&u.top>0&&0===u.bottom?(h.bottom+=u.top,h.top-=u.top):u.bottom&&u.bottom>0&&0===u.top&&(h.top+=u.bottom,h.bottom-=u.bottom),u=st(ot(i,h),s));var d={width:1/0,height:1/0,left:1/0,right:1/0,top:1/0,bottom:1/0};if(V.forEach((function(t){var e=u[t];e&&h[t]&&(d[t]=Math.max(0,1-e/h[t]));})),r){var m=Math.min.apply(null,V.map((function(t){return d[t]})));m!==1/0&&V.forEach((function(t){h[t]*=m;}));}else V.forEach((function(t){d[t]!==1/0&&(h[t]*=d[t]);}));if(c=ot(i,h).width,l=ot(i,h).height,h.right+h.left&&(c>o.maxWidth?d.width=(o.maxWidth-i.width)/(h.right+h.left):c<o.minWidth&&(d.width=(o.minWidth-i.width)/(h.right+h.left))),h.bottom+h.top&&(l>o.maxHeight?d.height=(o.maxHeight-i.height)/(h.bottom+h.top):l<o.minHeight&&(d.height=(o.minHeight-i.height)/(h.bottom+h.top))),r){var p=Math.min(d.width,d.height);p!==1/0&&V.forEach((function(t){h[t]*=p;}));}else d.width!==1/0&&_.forEach((function(t){h[t]*=d.width;})),d.height!==1/0&&G.forEach((function(t){h[t]*=d.height;}));return h}function Bt(t,e,i){return 0==e&&0==i?t/2:0==e?0:0==i?t:t*Math.abs(e/(e+i))}var Xt=M("vue-simple-handler"),Yt=M("vue-simple-handler-wrapper"),kt={name:"SimpleHandler",components:{HandlerWrapper:N},props:{defaultClass:{type:String},hoverClass:{type:String},wrapperClass:{type:String},horizontalPosition:{type:String},verticalPosition:{type:String},disabled:{type:Boolean,default:!1}},data:function(){return {hover:!1}},computed:{classes:function(){var t,e=(f(t={},this.horizontalPosition,Boolean(this.horizontalPosition)),f(t,this.verticalPosition,Boolean(this.verticalPosition)),f(t,"".concat(this.horizontalPosition,"-").concat(this.verticalPosition),Boolean(this.verticalPosition&&this.horizontalPosition)),f(t,"hover",this.hover),t);return {default:A(Xt(e),this.defaultClass,this.hover&&this.hoverClass),wrapper:A(Yt(e),this.wrapperClass)}}},methods:{onDrag:function(t){this.$emit("drag",t);},onEnter:function(){this.hover=!0;},onLeave:function(){this.hover=!1;},onDragEnd:function(){this.$emit("drag-end");}},emits:["drag","drag-end"]};kt.render=function(i,r,a,h,c,l){var u=resolveComponent("HandlerWrapper");return openBlock(),createBlock(u,{class:l.classes.wrapper,"vertical-position":a.verticalPosition,"horizontal-position":a.horizontalPosition,disabled:a.disabled,onDrag:l.onDrag,onDragEnd:l.onDragEnd,onEnter:l.onEnter,onLeave:l.onLeave},{default:withCtx((function(){return [createVNode("div",{class:l.classes.default},null,2)]})),_:1},8,["class","vertical-position","horizontal-position","disabled","onDrag","onDragEnd","onEnter","onLeave"])};var Ft=M("vue-simple-line"),Ut=M("vue-simple-line-wrapper"),Nt={name:"SimpleLine",components:{LineWrapper:q},props:{defaultClass:{type:String},hoverClass:{type:String},wrapperClass:{type:String},position:{type:String},disabled:{type:Boolean,default:!1}},data:function(){return {hover:!1}},computed:{classes:function(){return {root:A(Ft(f({},this.position,!0)),this.defaultClass,this.hover&&this.hoverClass),wrapper:A(Ut(f({},this.position,!0)),this.wrapperClass)}}},methods:{onDrag:function(t){this.$emit("drag",t);},onEnter:function(){this.hover=!0;},onLeave:function(){this.hover=!1;},onDragEnd:function(){this.$emit("drag-end");}},emits:["drag","drag-end"]};Nt.render=function(i,r,a,h,c,l){var u=resolveComponent("LineWrapper");return openBlock(),createBlock(u,{class:l.classes.wrapper,position:a.position,disabled:a.disabled,onDrag:l.onDrag,onDragEnd:l.onDragEnd,onEnter:l.onEnter,onLeave:l.onLeave},{default:withCtx((function(){return [createVNode("div",{class:l.classes.root},null,2)]})),_:1},8,["class","position","disabled","onDrag","onDragEnd","onEnter","onLeave"])};var Zt=M("vue-bounding-box"),qt=["east","west",null],Vt=["south","north",null],_t={name:"BoundingBox",props:{width:{type:Number},height:{type:Number},transitions:{type:Object},handlers:{type:Object,default:function(){return {eastNorth:!0,north:!0,westNorth:!0,west:!0,westSouth:!0,south:!0,eastSouth:!0,east:!0}}},handlersComponent:{type:[Object,String],default:function(){return kt}},handlersClasses:{type:Object,default:function(){return {}}},handlersWrappersClasses:{type:Object,default:function(){return {}}},lines:{type:Object,default:function(){return {west:!0,north:!0,east:!0,south:!0}}},linesComponent:{type:[Object,String],default:function(){return Nt}},linesClasses:{type:Object,default:function(){return {}}},linesWrappersClasses:{type:Object,default:function(){return {}}},resizable:{type:Boolean,default:!0}},data:function(){var t=[];return qt.forEach((function(e){Vt.forEach((function(i){if(e!==i){var n=E(e,i),s=n.name,o=n.classname;t.push({name:s,classname:o,verticalDirection:i,horizontalDirection:e});}}));})),{points:t}},computed:{style:function(){var t={};return this.width&&this.height&&(t.width="".concat(this.width,"px"),t.height="".concat(this.height,"px"),this.transitions&&this.transitions.enabled&&(t.transition="".concat(this.transitions.time,"ms ").concat(this.transitions.timingFunction))),t},classes:function(){var t=this.handlersClasses,e=this.handlersWrappersClasses,i=this.linesClasses,n=this.linesWrappersClasses;return {root:Zt(),handlers:t,handlersWrappers:e,lines:i,linesWrappers:n}},lineNodes:function(){var t=this,e=[];return this.points.forEach((function(i){i.horizontalDirection&&i.verticalDirection||!t.lines[i.name]||e.push({name:i.name,component:t.linesComponent,class:A(t.classes.lines.default,t.classes.lines[i.name],!t.resizable&&t.classes.lines.disabled),wrapperClass:A(t.classes.linesWrappers.default,t.classes.linesWrappers[i.name],!t.resizable&&t.classes.linesWrappers.disabled),hoverClass:t.classes.lines.hover,verticalDirection:i.verticalDirection,horizontalDirection:i.horizontalDirection,disabled:!t.resizable});})),e},handlerNodes:function(){var t=this,e=[],i=this.width,n=this.height;return this.points.forEach((function(s){if(t.handlers[s.name]){var o={name:s.name,component:t.handlersComponent,class:A(t.classes.handlers.default,t.classes.handlers[s.name]),wrapperClass:A(t.classes.handlersWrappers.default,t.classes.handlersWrappers[s.name]),hoverClass:t.classes.handlers.hover,verticalDirection:s.verticalDirection,horizontalDirection:s.horizontalDirection,disabled:!t.resizable};if(i&&n){var r=s.horizontalDirection,a=s.verticalDirection,h="east"===r?i:"west"===r?0:i/2,c="south"===a?n:"north"===a?0:n/2;o.wrapperClass=Zt("handler"),o.wrapperStyle={transform:"translate(".concat(h,"px, ").concat(c,"px)")},t.transitions&&t.transitions.enabled&&(o.wrapperStyle.transition="".concat(t.transitions.time,"ms ").concat(t.transitions.timingFunction));}else o.wrapperClass=Zt("handler",f({},s.classname,!0));e.push(o);}})),e}},beforeMount:function(){window.addEventListener("mouseup",this.onMouseUp,{passive:!1}),window.addEventListener("mousemove",this.onMouseMove,{passive:!1}),window.addEventListener("touchmove",this.onTouchMove,{passive:!1}),window.addEventListener("touchend",this.onTouchEnd,{passive:!1});},beforeUnmount:function(){window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("touchend",this.onTouchEnd);},mounted:function(){this.touches=[];},methods:{onEnd:function(){this.$emit("resize-end");},onHandlerDrag:function(t,e,i){var n,s=t.shift(),o=s.left,r=s.top,a={left:0,right:0,top:0,bottom:0};"west"===e?a.left-=o:"east"===e&&(a.right+=o),"north"===i?a.top-=r:"south"===i&&(a.bottom+=r),!i&&e?n="width":i&&!e&&(n="height"),this.resizable&&this.$emit("resize",new X(a,{allowedDirections:{left:"west"===e||!e,right:"east"===e||!e,bottom:"south"===i||!i,top:"north"===i||!i},preserveAspectRatio:t.nativeEvent&&t.nativeEvent.shiftKey,respectDirection:n}));}},emits:["resize","resize-end"]};_t.render=function(n,o,c,l,u,d){return openBlock(),createBlock("div",{ref:"box",class:d.classes.root,style:d.style},[renderSlot(n.$slots,"default"),createVNode("div",null,[(openBlock(!0),createBlock(Fragment,null,renderList(d.lineNodes,(function(i){return openBlock(),createBlock(resolveDynamicComponent(i.component),{key:i.name,"default-class":i.class,"hover-class":i.hoverClass,"wrapper-class":i.wrapperClass,position:i.name,disabled:i.disabled,onDrag:function(t){return d.onHandlerDrag(t,i.horizontalDirection,i.verticalDirection)},onDragEnd:o[1]||(o[1]=function(t){return d.onEnd()})},null,8,["default-class","hover-class","wrapper-class","position","disabled","onDrag"])})),128))]),(openBlock(!0),createBlock(Fragment,null,renderList(d.handlerNodes,(function(i){return openBlock(),createBlock("div",{key:i.name,style:i.wrapperStyle,class:i.wrapperClass},[(openBlock(),createBlock(resolveDynamicComponent(i.component),{"default-class":i.class,"hover-class":i.hoverClass,"wrapper-class":i.wrapperClass,"horizontal-position":i.horizontalDirection,"vertical-position":i.verticalDirection,disabled:i.disabled,onDrag:function(t){return d.onHandlerDrag(t,i.horizontalDirection,i.verticalDirection)},onDragEnd:o[2]||(o[2]=function(t){return d.onEnd()})},null,8,["default-class","hover-class","wrapper-class","horizontal-position","vertical-position","disabled","onDrag"]))],6)})),128))],6)};var Gt=M("vue-draggable-area"),Qt={name:"DraggableArea",props:{movable:{type:Boolean,default:!0},activationDistance:{type:Number,default:20}},computed:{classnames:function(){return {default:Gt()}}},beforeMount:function(){window.addEventListener("mouseup",this.onMouseUp,{passive:!1}),window.addEventListener("mousemove",this.onMouseMove,{passive:!1}),window.addEventListener("touchmove",this.onTouchMove,{passive:!1}),window.addEventListener("touchend",this.onTouchEnd,{passive:!1});},beforeUnmount:function(){window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("touchend",this.onTouchEnd);},mounted:function(){this.touches=[],this.touchStarted=!1;},methods:{onTouchStart:function(t){if(t.cancelable){var e=this.movable&&1===t.touches.length;e&&(this.touches=b(t.touches)),(this.touchStarted||e)&&(t.preventDefault(),t.stopPropagation());}},onTouchEnd:function(){this.touchStarted=!1,this.processEnd();},onTouchMove:function(t){this.touches.length>=1&&(this.touchStarted?(this.processMove(t,t.touches),t.preventDefault(),t.stopPropagation()):I({x:this.touches[0].clientX,y:this.touches[0].clientY},{x:t.touches[0].clientX,y:t.touches[0].clientY})>this.activationDistance&&(this.initAnchor({clientX:t.touches[0].clientX,clientY:t.touches[0].clientY}),this.touchStarted=!0));},onMouseDown:function(t){if(this.movable&&0===t.button){var e={fake:!0,clientX:t.clientX,clientY:t.clientY};this.touches=[e],this.initAnchor(e),t.stopPropagation();}},onMouseMove:function(t){this.touches.length&&(this.processMove(t,[{fake:!0,clientX:t.clientX,clientY:t.clientY}]),t.preventDefault&&t.cancelable&&t.preventDefault(),t.stopPropagation());},onMouseUp:function(){this.processEnd();},initAnchor:function(t){var e=this.$refs.container.getBoundingClientRect(),i=e.left,n=e.top;this.anchor={x:t.clientX-i,y:t.clientY-n};},processMove:function(t,e){var i=b(e);if(this.touches.length){var n=this.$refs.container.getBoundingClientRect(),s=n.left,o=n.top;1===this.touches.length&&1===i.length&&this.$emit("move",new Y({left:i[0].clientX-(s+this.anchor.x),top:i[0].clientY-(o+this.anchor.y)}));}},processEnd:function(){this.touches.length&&this.$emit("move-end"),this.touches=[];}},emits:["move","move-end"]};Qt.render=function(n,s,o,r,a,h){return openBlock(),createBlock("div",{ref:"container",onTouchstart:s[1]||(s[1]=function(){return h.onTouchStart&&h.onTouchStart.apply(h,arguments)}),onMousedown:s[2]||(s[2]=function(){return h.onMouseDown&&h.onMouseDown.apply(h,arguments)})},[renderSlot(n.$slots,"default")],544)};function Kt(t){var e,i;return {rotate:t.rotate||0,flip:{horizontal:(null===(e=null==t?void 0:t.flip)||void 0===e?void 0:e.horizontal)||!1,vertical:(null===(i=null==t?void 0:t.flip)||void 0===i?void 0:i.vertical)||!1}}}function Jt(t){return new Promise((function(e,i){try{if(t)if(/^data:/i.test(t))e(function(t){t=t.replace(/^data:([^;]+);base64,/gim,"");for(var e=atob(t),i=e.length,n=new ArrayBuffer(i),s=new Uint8Array(n),o=0;o<i;o++)s[o]=e.charCodeAt(o);return n}(t));else if(/^blob:/i.test(t)){var n=new FileReader;n.onload=function(t){e(t.target.result);},o=t,r=function(t){n.readAsArrayBuffer(t);},(a=new XMLHttpRequest).open("GET",o,!0),a.responseType="blob",a.onload=function(){200!=this.status&&0!==this.status||r(this.response);},a.send();}else {var s=new XMLHttpRequest;s.onreadystatechange=function(){4===s.readyState&&(200===s.status||0===s.status?e(s.response):i("Warning: could not load an image to parse its orientation"),s=null);},s.onprogress=function(){"image/jpeg"!==s.getResponseHeader("content-type")&&s.abort();},s.withCredentials=!1,s.open("GET",t,!0),s.responseType="arraybuffer",s.send(null);}else i("Error: the image is empty");}catch(t){i(t);}var o,r,a;}))}function te(t){var e=t.rotate,i=t.flip,n=t.scaleX,s=t.scaleY,o="";return o+=" rotate("+e+"deg) ",o+=" scaleX("+n*(i.horizontal?-1:1)+") ",o+=" scaleY("+s*(i.vertical?-1:1)+") "}function ee(t){try{var e,i=new DataView(t),n=void 0,s=void 0,o=void 0,r=void 0;if(255===i.getUint8(0)&&216===i.getUint8(1))for(var a=i.byteLength,h=2;h+1<a;){if(255===i.getUint8(h)&&225===i.getUint8(h+1)){o=h;break}h++;}if(o&&(n=o+10,"Exif"===function(t,e,i){var n,s="";for(n=e,i+=e;n<i;n++)s+=String.fromCharCode(t.getUint8(n));return s}(i,o+4,4))){var c=i.getUint16(n);if(((s=18761===c)||19789===c)&&42===i.getUint16(n+2,s)){var l=i.getUint32(n+4,s);l>=8&&(r=n+l);}}if(r)for(var u=i.getUint16(r,s),d=0;d<u;d++){h=r+12*d+2;if(274===i.getUint16(h,s)){h+=8,e=i.getUint16(h,s),i.setUint16(h,1,s);break}}return e}catch(t){return null}}function se(t,e){var i=e.getBoundingClientRect(),n=i.left,s=i.top,o={left:0,top:0},r=0;return t.forEach((function(e){o.left+=(e.clientX-n)/t.length,o.top+=(e.clientY-s)/t.length;})),t.forEach((function(t){r+=I({x:o.left,y:o.top},{x:t.clientX-n,y:t.clientY-s});})),{centerMass:o,spread:r,count:t.length}}var oe={props:{touchMove:{type:Boolean,required:!0},mouseMove:{type:Boolean,required:!0},touchResize:{type:Boolean,required:!0},wheelResize:{type:[Boolean,Object],required:!0},eventsFilter:{type:Function,required:!1}},beforeMount:function(){window.addEventListener("mouseup",this.onMouseUp,{passive:!1}),window.addEventListener("mousemove",this.onMouseMove,{passive:!1}),window.addEventListener("touchmove",this.onTouchMove,{passive:!1}),window.addEventListener("touchend",this.onTouchEnd,{passive:!1});},beforeUnmount:function(){window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("touchend",this.onTouchEnd);},created:function(){this.transforming=!1,this.debouncedProcessEnd=x(this.processEnd),this.touches=[];},methods:{processMove:function(t,e){if(this.touches.length){if(1===this.touches.length&&1===e.length)this.$emit("move",new B({left:this.touches[0].clientX-e[0].clientX,top:this.touches[0].clientY-e[0].clientY}));else if(this.touches.length>1&&this.touchResize){var i=se(e,this.$refs.container),n=this.oldGeometricProperties;n.count===i.count&&n.count>1&&this.$emit("resize",new B({left:n.centerMass.left-i.centerMass.left,top:n.centerMass.top-i.centerMass.top},{factor:n.spread/i.spread,center:i.centerMass})),this.oldGeometricProperties=i;}this.touches=e;}},processEnd:function(){this.transforming&&(this.transforming=!1,this.$emit("transform-end"));},processStart:function(){this.transforming=!0,this.debouncedProcessEnd.clear();},processEvent:function(t){return this.eventsFilter?!1!==this.eventsFilter(t,this.transforming):(t.preventDefault(),t.stopPropagation(),!0)},onTouchStart:function(t){if(t.cancelable&&(this.touchMove||this.touchResize&&t.touches.length>1)&&this.processEvent(t)){var e=this.$refs.container,i=e.getBoundingClientRect(),n=i.left,s=i.top,o=i.bottom,r=i.right;this.touches=b(t.touches).filter((function(t){return t.clientX>n&&t.clientX<r&&t.clientY>s&&t.clientY<o})),this.oldGeometricProperties=se(this.touches,e);}},onTouchEnd:function(t){0===t.touches.length&&(this.touches=[],this.processEnd());},onTouchMove:function(t){var e=this;if(this.touches.length){var i=b(t.touches).filter((function(t){return !t.identifier||e.touches.find((function(e){return e.identifier===t.identifier}))}));this.processEvent(t)&&(this.processMove(t,i),this.processStart());}},onMouseDown:function(t){if(this.mouseMove&&"buttons"in t&&1===t.buttons&&this.processEvent(t)){var e={fake:!0,clientX:t.clientX,clientY:t.clientY};this.touches=[e],this.processStart();}},onMouseMove:function(t){this.touches.length&&this.processEvent(t)&&this.processMove(t,[{clientX:t.clientX,clientY:t.clientY}]);},onMouseUp:function(){this.touches=[],this.processEnd();},onWheel:function(t){if(this.wheelResize&&this.processEvent(t)){var e=this.$refs.container.getBoundingClientRect(),i=e.left,n=e.top,s=1+this.wheelResize.ratio*(r=t.deltaY||t.detail||t.wheelDelta,0===(a=+r)||$(a)?a:a>0?1:-1),o={left:t.clientX-i,top:t.clientY-n};this.$emit("resize",new B({},{factor:s,center:o})),this.touches.length||this.debouncedProcessEnd();}var r,a;}},emits:["resize","move","transform-end"]};oe.render=function(n,s,o,r,a,h){return openBlock(),createBlock("div",{ref:"container",onTouchstart:s[1]||(s[1]=function(){return h.onTouchStart&&h.onTouchStart.apply(h,arguments)}),onMousedown:s[2]||(s[2]=function(){return h.onMouseDown&&h.onMouseDown.apply(h,arguments)}),onWheel:s[3]||(s[3]=function(){return h.onWheel&&h.onWheel.apply(h,arguments)})},[renderSlot(n.$slots,"default")],544)};var re={components:{TransformableImage:oe},props:{touchMove:{type:Boolean,required:!0},mouseMove:{type:Boolean,required:!0},touchResize:{type:Boolean,required:!0},wheelResize:{type:[Boolean,Object],required:!0}},emits:["resize","move"]};re.render=function(s,r,a,h,c,l){var u=resolveComponent("transformable-image");return openBlock(),createBlock(u,{"touch-move":a.touchMove,"touch-resize":a.touchResize,"mouse-move":a.mouseMove,"wheel-resize":a.wheelResize,onMove:r[1]||(r[1]=function(t){return s.$emit("move",t)}),onResize:r[2]||(r[2]=function(t){return s.$emit("resize",t)})},{default:withCtx((function(){return [renderSlot(s.$slots,"default")]})),_:3},8,["touch-move","touch-resize","mouse-move","wheel-resize"])};var ae=M("vue-preview"),he={props:{coordinates:{type:Object},transitions:{type:Object},image:{type:Object,default:function(){return {}}},imageClass:{type:String},width:{type:Number},height:{type:Number},fill:{type:Boolean}},data:function(){return {calculatedImageSize:{width:0,height:0},calculatedSize:{width:0,height:0}}},computed:{classes:function(){return {root:ae({fill:this.fill}),wrapper:ae("wrapper"),imageWrapper:ae("image-wrapper"),image:A(ae("image"),this.imageClass)}},style:function(){if(this.fill)return {};var t={};return this.width&&(t.width="".concat(this.size.width,"px")),this.height&&(t.height="".concat(this.size.height,"px")),this.transitions&&this.transitions.enabled&&(t.transition="".concat(this.transitions.time,"ms ").concat(this.transitions.timingFunction)),t},wrapperStyle:function(){var t={width:"".concat(this.size.width,"px"),height:"".concat(this.size.height,"px"),left:"calc(50% - ".concat(this.size.width/2,"px)"),top:"calc(50% - ".concat(this.size.height/2,"px)")};return this.transitions&&this.transitions.enabled&&(t.transition="".concat(this.transitions.time,"ms ").concat(this.transitions.timingFunction)),t},imageStyle:function(){if(this.coordinates&&this.image){var t=this.coordinates.width/this.size.width,e=g(g({rotate:0,flip:{horizontal:!1,vertical:!1}},this.image.transforms),{},{scaleX:1/t,scaleY:1/t}),i=this.imageSize.width,n=this.imageSize.height,s=pt({width:i,height:n},e.rotate),o={width:"".concat(i,"px"),height:"".concat(n,"px"),left:"0px",top:"0px"},r={rotate:{left:(i-s.width)*e.scaleX/2,top:(n-s.height)*e.scaleY/2},scale:{left:(1-e.scaleX)*i/2,top:(1-e.scaleY)*n/2}};return o.transform="translate(\n\t\t\t\t".concat(-this.coordinates.left/t-r.rotate.left-r.scale.left,"px,").concat(-this.coordinates.top/t-r.rotate.top-r.scale.top,"px) ")+te(e),this.transitions&&this.transitions.enabled&&(o.transition="".concat(this.transitions.time,"ms ").concat(this.transitions.timingFunction)),o}return {}},size:function(){return {width:this.width||this.calculatedSize.width,height:this.height||this.calculatedSize.height}},imageSize:function(){return {width:this.image.width||this.calculatedImageSize.width,height:this.image.height||this.calculatedImageSize.height}}},watch:{image:function(t){(t.width||t.height)&&this.onChangeImage();}},mounted:function(){var t=this;this.onChangeImage(),this.$refs.image.addEventListener("load",(function(){t.refreshImage();})),window.addEventListener("resize",this.refresh),window.addEventListener("orientationchange",this.refresh);},unmounted:function(){window.removeEventListener("resize",this.refresh),window.removeEventListener("orientationchange",this.refresh);},methods:{refreshImage:function(){var t=this.$refs.image;this.calculatedImageSize.height=t.naturalHeight,this.calculatedImageSize.width=t.naturalWidth;},refresh:function(){var t=this.$refs.root;this.width||(this.calculatedSize.width=t.clientWidth),this.height||(this.calculatedSize.height=t.clientHeight);},onChangeImage:function(){var t=this.$refs.image;t&&t.complete&&this.refreshImage(),this.refresh();}}};he.render=function(i,n,o,r,a,h){return openBlock(),createBlock("div",{ref:"root",class:h.classes.root,style:h.style},[createVNode("div",{ref:"wrapper",class:h.classes.wrapper,style:h.wrapperStyle},[withDirectives(createVNode("img",{ref:"image",src:o.image&&o.image.src,class:h.classes.image,style:h.imageStyle},null,14,["src"]),[[vShow,o.image&&o.image.src]])],6)],6)};var ce={components:{Preview:he},inheritAttrs:!1};ce.render=function(i,s,o,r,a,h){var c=resolveComponent("preview");return openBlock(),createBlock(c,mergeProps(i.$attrs,{fill:!0}),null,16)};var le=M("vue-rectangle-stencil"),ue={name:"RectangleStencil",components:{StencilPreview:ce,BoundingBox:_t,DraggableArea:Qt},props:{image:{type:Object},coordinates:{type:Object},stencilCoordinates:{type:Object},handlers:{type:Object},handlersComponent:{type:[Object,String],default:function(){return kt}},lines:{type:Object},linesComponent:{type:[Object,String],default:function(){return Nt}},aspectRatio:{type:[Number,String]},minAspectRatio:{type:[Number,String]},maxAspectRatio:{type:[Number,String]},movable:{type:Boolean,default:!0},resizable:{type:Boolean,default:!0},transitions:{type:Object},movingClass:{type:String},resizingClass:{type:String},previewClass:{type:String},boundingBoxClass:{type:String},linesClasses:{type:Object,default:function(){return {}}},linesWrappersClasses:{type:Object,default:function(){return {}}},handlersClasses:{type:Object,default:function(){return {}}},handlersWrappersClasses:{type:Object,default:function(){return {}}}},data:function(){return {moving:!1,resizing:!1}},computed:{classes:function(){return {stencil:A(le({movable:this.movable,moving:this.moving,resizing:this.resizing}),this.moving&&this.movingClass,this.resizing&&this.resizingClass),preview:A(le("preview"),this.previewClass),boundingBox:A(le("bounding-box"),this.boundingBoxClass)}},style:function(){var t=this.stencilCoordinates,e=t.height,i=t.width,n=t.left,s=t.top,o={width:"".concat(i,"px"),height:"".concat(e,"px"),transform:"translate(".concat(n,"px, ").concat(s,"px)")};return this.transitions&&this.transitions.enabled&&(o.transition="".concat(this.transitions.time,"ms ").concat(this.transitions.timingFunction)),o}},methods:{onMove:function(t){this.$emit("move",t),this.moving=!0;},onMoveEnd:function(){this.$emit("move-end"),this.moving=!1;},onResize:function(t){this.$emit("resize",t),this.resizing=!0;},onResizeEnd:function(){this.$emit("resize-end"),this.resizing=!1;},aspectRatios:function(){return {minimum:this.aspectRatio||this.minAspectRatio,maximum:this.aspectRatio||this.maxAspectRatio}}},emits:["resize","resize-end","move","move-end"]};ue.render=function(i,r,a,h,c,l){var u=resolveComponent("stencil-preview"),d=resolveComponent("draggable-area"),m=resolveComponent("bounding-box");return openBlock(),createBlock("div",{class:l.classes.stencil,style:l.style},[createVNode(m,{width:a.stencilCoordinates.width,height:a.stencilCoordinates.height,transitions:a.transitions,class:l.classes.boundingBox,handlers:a.handlers,"handlers-component":a.handlersComponent,"handlers-classes":a.handlersClasses,"handlers-wrappers-classes":a.handlersWrappersClasses,lines:a.lines,"lines-component":a.linesComponent,"lines-classes":a.linesClasses,"lines-wrappers-classes":a.linesWrappersClasses,resizable:a.resizable,onResize:l.onResize,onResizeEnd:l.onResizeEnd},{default:withCtx((function(){return [createVNode(d,{movable:a.movable,onMove:l.onMove,onMoveEnd:l.onMoveEnd},{default:withCtx((function(){return [createVNode(u,{image:a.image,coordinates:a.coordinates,width:a.stencilCoordinates.width,height:a.stencilCoordinates.height,class:l.classes.preview,transitions:a.transitions},null,8,["image","coordinates","width","height","class","transitions"])]})),_:1},8,["movable","onMove","onMoveEnd"])]})),_:1},8,["width","height","transitions","class","handlers","handlers-component","handlers-classes","handlers-wrappers-classes","lines","lines-component","lines-classes","lines-wrappers-classes","resizable","onResize","onResizeEnd"])],6)};var pe=["transitions"],ge=M("vue-advanced-cropper"),fe={name:"Cropper",components:{BackgroundWrapper:re},props:{src:{type:String,default:null},stencilComponent:{type:[Object,String],default:function(){return ue}},backgroundWrapperComponent:{type:[Object,String],default:function(){return re}},stencilProps:{type:Object,default:function(){return {}}},autoZoom:{type:Boolean,default:!1},imageClass:{type:String},boundariesClass:{type:String},backgroundClass:{type:String},foregroundClass:{type:String},minWidth:{type:[Number,String]},minHeight:{type:[Number,String]},maxWidth:{type:[Number,String]},maxHeight:{type:[Number,String]},debounce:{type:[Boolean,Number],default:500},transitions:{type:Boolean,default:!0},checkOrientation:{type:Boolean,default:!0},canvas:{type:[Object,Boolean],default:!0},crossOrigin:{type:[Boolean,String],default:void 0},transitionTime:{type:Number,default:300},imageRestriction:{type:String,default:"fit-area",validator:function(t){return -1!==K.indexOf(t)}},roundResult:{type:Boolean,default:!0},defaultSize:{type:[Function,Object]},defaultPosition:{type:[Function,Object]},defaultVisibleArea:{type:[Function,Object]},defaultTransforms:{type:[Function,Object]},defaultBoundaries:{type:[Function,String],validator:function(t){return !("string"==typeof t&&"fill"!==t&&"fit"!==t)}},priority:{type:String,default:"coordinates"},stencilSize:{type:[Object,Function]},resizeImage:{type:[Boolean,Object],default:!0},moveImage:{type:[Boolean,Object],default:!0},autoZoomAlgorithm:{type:Function},resizeAlgorithm:{type:Function,default:function(t){var e=t.event,i=t.coordinates,n=t.aspectRatio,s=t.positionRestrictions,o=t.sizeRestrictions,r=C(C({},i),{right:i.left+i.width,bottom:i.top+i.height}),a=e.params||{},h=C({},e.directions),c=a.allowedDirections||{left:!0,right:!0,bottom:!0,top:!0};o.widthFrozen&&(h.left=0,h.right=0),o.heightFrozen&&(h.top=0,h.bottom=0),V.forEach((function(t){c[t]||(h[t]=0);}));var l=ot(r,h=It({coordinates:r,directions:h,sizeRestrictions:o,positionRestrictions:s})).width,u=ot(r,h).height,d=a.preserveRatio?ct(r):dt(l/u,n);if(d){var m=a.respectDirection;if(m||(m=r.width>=r.height||1===d?"width":"height"),"width"===m){var p=l/d-r.height;if(c.top&&c.bottom){var g=h.top,f=h.bottom;h.bottom=Bt(p,f,g),h.top=Bt(p,g,f);}else c.bottom?h.bottom=p:c.top?h.top=p:c.right?h.right=0:c.left&&(h.left=0);}else if("height"===m){var v=r.width-u*d;if(c.left&&c.right){var b=h.left,w=h.right;h.left=-Bt(v,b,w),h.right=-Bt(v,w,b);}else c.left?h.left=-v:c.right?h.right=-v:c.top?h.top=0:c.bottom&&(h.bottom=0);}h=It({directions:h,coordinates:r,sizeRestrictions:o,positionRestrictions:s,preserveRatio:!0,compensate:a.compensate});}return l=ot(r,h).width,u=ot(r,h).height,(d=a.preserveRatio?ct(r):dt(l/u,n))&&Math.abs(d-l/u)>.001&&V.forEach((function(t){c[t]||(h[t]=0);})),St({event:new Y({left:-h.left,top:-h.top}),coordinates:{width:i.width+h.right+h.left,height:i.height+h.top+h.bottom,left:i.left,top:i.top},positionRestrictions:s})}},moveAlgorithm:{type:Function,default:St},initStretcher:{type:Function,default:function(t){var e=t.stretcher,i=t.imageSize,n=ct(i);e.style.width=i.width+"px",e.style.height=e.clientWidth/n+"px",e.style.width=e.clientWidth+"px";}},fitCoordinates:{type:Function,default:function(t){var e=t.visibleArea,i=t.coordinates,n=t.aspectRatio,s=t.sizeRestrictions,o=t.positionRestrictions,r=C(C({},i),Mt({width:i.width,height:i.height,aspectRatio:n,sizeRestrictions:{maxWidth:e.width,maxHeight:e.height,minHeight:Math.min(e.height,s.minHeight),minWidth:Math.min(e.width,s.minWidth)}}));return r=vt(r=at(r,it(nt(i),nt(r))),zt(et(e),o))}},fitVisibleArea:{type:Function,default:function(t){var e=t.visibleArea,i=t.boundaries,n=t.getAreaRestrictions,s=t.coordinates,o=C({},e);o.height=o.width/ct(i),o.top+=(e.height-o.height)/2,(s.height-o.height>0||s.width-o.width>0)&&(o=ht(o,Math.max(s.height/o.height,s.width/o.width)));var r=rt(ut(s,et(o=ht(o,ft(o,n({visibleArea:o,type:"resize"}))))));return o.width<s.width&&(r.left=0),o.height<s.height&&(r.top=0),o=vt(o=at(o,r),n({visibleArea:o,type:"move"}))}},areaRestrictionsAlgorithm:{type:Function,default:function(t){var e=t.visibleArea,i=t.boundaries,n=t.imageSize,s=t.imageRestriction,o=t.type,r={};return "fill-area"===s?r={left:0,top:0,right:n.width,bottom:n.height}:"fit-area"===s&&(ct(i)>ct(n)?(r={top:0,bottom:n.height},e&&"move"===o&&(e.width>n.width?(r.left=-(e.width-n.width)/2,r.right=n.width-r.left):(r.left=0,r.right=n.width))):(r={left:0,right:n.width},e&&"move"===o&&(e.height>n.height?(r.top=-(e.height-n.height)/2,r.bottom=n.height-r.top):(r.top=0,r.bottom=n.height)))),r}},sizeRestrictionsAlgorithm:{type:Function,default:function(t){return {minWidth:t.minWidth,minHeight:t.minHeight,maxWidth:t.maxWidth,maxHeight:t.maxHeight}}},positionRestrictionsAlgorithm:{type:Function,default:function(t){var e=t.imageSize,i={};return "none"!==t.imageRestriction&&(i={left:0,top:0,right:e.width,bottom:e.height}),i}}},data:function(){return {transitionsActive:!1,imageLoaded:!1,imageAttributes:{width:null,height:null,crossOrigin:null,src:null},defaultImageTransforms:{rotate:0,flip:{horizontal:!1,vertical:!1}},appliedImageTransforms:{rotate:0,flip:{horizontal:!1,vertical:!1}},boundaries:{width:0,height:0},visibleArea:null,coordinates:g({},J)}},computed:{image:function(){return {src:this.imageAttributes.src,width:this.imageAttributes.width,height:this.imageAttributes.height,transforms:this.imageTransforms}},imageTransforms:function(){return {rotate:this.appliedImageTransforms.rotate,flip:{horizontal:this.appliedImageTransforms.flip.horizontal,vertical:this.appliedImageTransforms.flip.vertical},translateX:this.visibleArea?this.visibleArea.left/this.coefficient:0,translateY:this.visibleArea?this.visibleArea.top/this.coefficient:0,scaleX:1/this.coefficient,scaleY:1/this.coefficient}},imageSize:function(){var t=function(t){return t*Math.PI/180}(this.imageTransforms.rotate);return {width:Math.abs(this.imageAttributes.width*Math.cos(t))+Math.abs(this.imageAttributes.height*Math.sin(t)),height:Math.abs(this.imageAttributes.width*Math.sin(t))+Math.abs(this.imageAttributes.height*Math.cos(t))}},initialized:function(){return Boolean(this.visibleArea&&this.imageLoaded)},settings:function(){var t=j(this.resizeImage,{touch:!0,wheel:{ratio:.1},adjustStencil:!0},{touch:!1,wheel:!1,adjustStencil:!1});return {moveImage:j(this.moveImage,{touch:!0,mouse:!0},{touch:!1,mouse:!1}),resizeImage:t}},coefficient:function(){return this.visibleArea?this.visibleArea.width/this.boundaries.width:0},areaRestrictions:function(){return this.imageLoaded?this.areaRestrictionsAlgorithm({imageSize:this.imageSize,imageRestriction:this.imageRestriction,boundaries:this.boundaries}):{}},transitionsOptions:function(){return {enabled:this.transitionsActive,timingFunction:"ease-in-out",time:350}},sizeRestrictions:function(){if(this.boundaries.width&&this.boundaries.height&&this.imageSize.width&&this.imageSize.height){var t=this.sizeRestrictionsAlgorithm({imageSize:this.imageSize,minWidth:D(this.minWidth)?0:L(this.minWidth),minHeight:D(this.minHeight)?0:L(this.minHeight),maxWidth:D(this.maxWidth)?1/0:L(this.maxWidth),maxHeight:D(this.maxHeight)?1/0:L(this.maxHeight)});if(t=function(t){var e=t.areaRestrictions,i=t.sizeRestrictions;t.imageSize;var n=t.boundaries,s=t.positionRestrictions;t.imageRestriction;var o=C(C({},i),{minWidth:void 0!==i.minWidth?i.minWidth:0,minHeight:void 0!==i.minHeight?i.minHeight:0,maxWidth:void 0!==i.maxWidth?i.maxWidth:1/0,maxHeight:void 0!==i.maxHeight?i.maxHeight:1/0});void 0!==s.left&&void 0!==s.right&&(o.maxWidth=Math.min(o.maxWidth,s.right-s.left)),void 0!==s.bottom&&void 0!==s.top&&(o.maxHeight=Math.min(o.maxHeight,s.bottom-s.top));var r=bt(e),a=mt(n,r);return r.width<1/0&&(!o.maxWidth||o.maxWidth>a.width)&&(o.maxWidth=Math.min(o.maxWidth,a.width)),r.height<1/0&&(!o.maxHeight||o.maxHeight>a.height)&&(o.maxHeight=Math.min(o.maxHeight,a.height)),o.minWidth>o.maxWidth&&(o.minWidth=o.maxWidth,o.widthFrozen=!0),o.minHeight>o.maxHeight&&(o.minHeight=o.maxHeight,o.heightFrozen=!0),o}({sizeRestrictions:t,areaRestrictions:this.getAreaRestrictions({visibleArea:this.visibleArea,type:"resize"}),imageSize:this.imageSize,boundaries:this.boundaries,positionRestrictions:this.positionRestrictions,imageRestriction:this.imageRestriction,visibleArea:this.visibleArea,stencilSize:this.getStencilSize()}),this.visibleArea&&this.stencilSize){var e=this.getStencilSize(),i=bt(this.getAreaRestrictions({visibleArea:this.visibleArea,type:"resize"}));t.maxWidth=Math.min(t.maxWidth,i.width*e.width/this.boundaries.width),t.maxHeight=Math.min(t.maxHeight,i.height*e.height/this.boundaries.height),t.maxWidth<t.minWidth&&(t.minWidth=t.maxWidth),t.maxHeight<t.minHeight&&(t.minHeight=t.maxHeight);}return t}return {minWidth:0,minHeight:0,maxWidth:0,maxHeight:0}},positionRestrictions:function(){return this.positionRestrictionsAlgorithm({imageSize:this.imageSize,imageRestriction:this.imageRestriction})},classes:function(){return {cropper:ge(),image:A(ge("image"),this.imageClass),stencil:ge("stencil"),boundaries:A(ge("boundaries"),this.boundariesClass),stretcher:A(ge("stretcher")),background:A(ge("background"),this.backgroundClass),foreground:A(ge("foreground"),this.foregroundClass),imageWrapper:A(ge("image-wrapper")),cropperWrapper:A(ge("cropper-wrapper"))}},stencilCoordinates:function(){if(this.initialized){var t=this.coordinates,e=t.width,i=t.height,n=t.left,s=t.top;return {width:e/this.coefficient,height:i/this.coefficient,left:(n-this.visibleArea.left)/this.coefficient,top:(s-this.visibleArea.top)/this.coefficient}}return this.defaultCoordinates()},boundariesStyle:function(){var t={width:this.boundaries.width?"".concat(Math.round(this.boundaries.width),"px"):"auto",height:this.boundaries.height?"".concat(Math.round(this.boundaries.height),"px"):"auto",transition:"opacity ".concat(this.transitionTime,"ms"),pointerEvents:this.imageLoaded?"all":"none"};return this.imageLoaded||(t.opacity="0"),t},imageStyle:function(){var t=this.imageAttributes.width>this.imageAttributes.height?{width:Math.min(1024,this.imageAttributes.width),height:Math.min(1024,this.imageAttributes.width)/(this.imageAttributes.width/this.imageAttributes.height)}:{height:Math.min(1024,this.imageAttributes.height),width:Math.min(1024,this.imageAttributes.height)*(this.imageAttributes.width/this.imageAttributes.height)},e={left:(t.width-this.imageSize.width)/(2*this.coefficient),top:(t.height-this.imageSize.height)/(2*this.coefficient)},i={left:(1-1/this.coefficient)*t.width/2,top:(1-1/this.coefficient)*t.height/2},n=g(g({},this.imageTransforms),{},{scaleX:this.imageTransforms.scaleX*(this.imageAttributes.width/t.width),scaleY:this.imageTransforms.scaleY*(this.imageAttributes.height/t.height)}),s={width:"".concat(t.width,"px"),height:"".concat(t.height,"px"),left:"0px",top:"0px",transform:"translate(".concat(-e.left-i.left-this.imageTransforms.translateX,"px, ").concat(-e.top-i.top-this.imageTransforms.translateY,"px)")+te(n)};return this.transitionsOptions.enabled&&(s.transition="".concat(this.transitionsOptions.time,"ms ").concat(this.transitionsOptions.timingFunction)),s}},watch:{src:function(){this.onChangeImage();},stencilComponent:function(){var t=this;this.$nextTick((function(){t.resetCoordinates(),t.runAutoZoom("setCoordinates"),t.onChange();}));},minWidth:function(){this.onPropsChange();},maxWidth:function(){this.onPropsChange();},minHeight:function(){this.onPropsChange();},maxHeight:function(){this.onPropsChange();},imageRestriction:function(){this.reset();},stencilProps:function(t,e){["aspectRatio","minAspectRatio","maxAspectRatio"].find((function(i){return t[i]!==e[i]}))&&this.$nextTick(this.onPropsChange);}},created:function(){this.debouncedUpdate=x(this.update,this.debounce),this.debouncedDisableTransitions=x(this.disableTransitions,this.transitionsOptions.time),this.awaiting=!1;},mounted:function(){this.$refs.image.addEventListener("load",this.onSuccessLoadImage),this.$refs.image.addEventListener("error",this.onFailLoadImage),this.onChangeImage(),window.addEventListener("resize",this.refresh),window.addEventListener("orientationchange",this.refresh);},unmounted:function(){window.removeEventListener("resize",this.refresh),window.removeEventListener("orientationchange",this.refresh),this.imageAttributes.revoke&&this.imageAttributes.src&&URL.revokeObjectURL(this.imageAttributes.src),this.debouncedUpdate.clear(),this.debouncedDisableTransitions.clear();},methods:{getResult:function(){var t=this.initialized?this.prepareResult(g({},this.coordinates)):this.defaultCoordinates(),e={rotate:this.imageTransforms.rotate%360,flip:g({},this.imageTransforms.flip)};if(this.src&&this.imageLoaded){var i=this;return {image:this.image,coordinates:t,visibleArea:this.visibleArea?g({},this.visibleArea):null,imageTransforms:e,get canvas(){return i.canvas?i.getCanvas():void 0}}}return {image:this.image,coordinates:t,visibleArea:this.visibleArea?g({},this.visibleArea):null,canvas:void 0,imageTransforms:e}},zoom:function(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=i.transitions,s=void 0===n||n;this.onManipulateImage(new B({},{factor:1/t,center:e}),{normalize:!1,transitions:s});},move:function(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=i.transitions,s=void 0===n||n;this.onManipulateImage(new B({left:t||0,top:e||0}),{normalize:!1,transitions:s});},setCoordinates:function(t){var e=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=i.autoZoom,s=void 0===n||n,o=i.transitions,r=void 0===o||o;this.$nextTick((function(){e.imageLoaded?(e.transitionsActive||(r&&e.enableTransitions(),e.coordinates=e.applyTransform(t),s&&e.runAutoZoom("setCoordinates"),r&&e.debouncedDisableTransitions()),e.onChange()):e.delayedTransforms=t;}));},refresh:function(){var t=this,e=this.$refs.image;if(this.src&&e)return this.initialized?this.updateVisibleArea().then((function(){t.onChange();})):this.resetVisibleArea().then((function(){t.onChange();}))},reset:function(){var t=this;return this.resetVisibleArea().then((function(){t.onChange(!1);}))},awaitRender:function(t){var e=this;this.awaiting||(this.awaiting=!0,this.$nextTick((function(){t(),e.awaiting=!1;})));},prepareResult:function(t){return this.roundResult?function(t){var e=t.coordinates,i=t.sizeRestrictions,n=t.positionRestrictions,s={width:Math.round(e.width),height:Math.round(e.height),left:Math.round(e.left),top:Math.round(e.top)};return s.width>i.maxWidth?s.width=Math.floor(e.width):s.width<i.minWidth&&(s.width=Math.ceil(e.width)),s.height>i.maxHeight?s.height=Math.floor(e.height):s.height<i.minHeight&&(s.height=Math.ceil(e.height)),vt(s,n)}(g(g({},this.getPublicProperties()),{},{positionRestrictions:jt(this.positionRestrictions,this.visibleArea),coordinates:t})):t},processAutoZoom:function(t,e,i,n){var s=this.autoZoomAlgorithm;s||(s=this.stencilSize?Ct:this.autoZoom?Et:Wt);var o=s({event:{type:t,params:n},visibleArea:e,coordinates:i,boundaries:this.boundaries,aspectRatio:this.getAspectRatio(),positionRestrictions:this.positionRestrictions,getAreaRestrictions:this.getAreaRestrictions,sizeRestrictions:this.sizeRestrictions,stencilSize:this.getStencilSize()});return g(g({},o),{},{changed:!tt(o.visibleArea,e)||!tt(o.coordinates,i)})},runAutoZoom:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=e.transitions,n=void 0!==i&&i,s=v(e,pe),o=this.processAutoZoom(t,this.visibleArea,this.coordinates,s),r=o.visibleArea,a=o.coordinates,h=o.changed;n&&h&&this.enableTransitions(),this.visibleArea=r,this.coordinates=a,n&&h&&this.debouncedDisableTransitions();},normalizeEvent:function(t){return function(t){var e=t.event,i=t.visibleArea,n=t.coefficient;if("manipulateImage"===e.type)return C(C({},e),{move:{left:e.move&&e.move.left?n*e.move.left:0,top:e.move&&e.move.top?n*e.move.top:0},scale:{factor:e.scale&&e.scale.factor?e.scale.factor:1,center:e.scale&&e.scale.center?{left:e.scale.center.left*n+i.left,top:e.scale.center.top*n+i.top}:null}});if("resize"===e.type){var s=C(C({},e),{directions:C({},e.directions)});return V.forEach((function(t){s.directions[t]*=n;})),s}if("move"===e.type){var o=C(C({},e),{directions:C({},e.directions)});return Q.forEach((function(t){o.directions[t]*=n;})),o}return e}(g(g({},this.getPublicProperties()),{},{event:t}))},getCanvas:function(){if(this.$refs.canvas){var t=this.$refs.canvas,e=this.$refs.image,i=0!==this.imageTransforms.rotate||this.imageTransforms.flip.horizontal||this.imageTransforms.flip.vertical?function(t,e,i){var n=i.rotate,s=i.flip,o={width:e.naturalWidth,height:e.naturalHeight},r=pt(o,n),a=t.getContext("2d");t.height=r.height,t.width=r.width,a.save();var h=gt(nt(C({left:0,top:0},o)),n);return a.translate(-(h.left-r.width/2),-(h.top-r.height/2)),a.rotate(n*Math.PI/180),a.translate(s.horizontal?o.width:0,s.vertical?o.height:0),a.scale(s.horizontal?-1:1,s.vertical?-1:1),a.drawImage(e,0,0,o.width,o.height),a.restore(),t}(this.$refs.sourceCanvas,e,this.imageTransforms):e,n=g({minWidth:0,minHeight:0,maxWidth:1/0,maxHeight:1/0,maxArea:this.maxCanvasSize,imageSmoothingEnabled:!0,imageSmoothingQuality:"high",fillColor:"transparent"},this.canvas),s=function(t){return t.find((function(t){return e=t,!Number.isNaN(parseFloat(e))&&isFinite(e);var e;}))},o=Mt({sizeRestrictions:{minWidth:s([n.width,n.minWidth])||0,minHeight:s([n.height,n.minHeight])||0,maxWidth:s([n.width,n.maxWidth])||1/0,maxHeight:s([n.height,n.maxHeight])||1/0},width:this.coordinates.width,height:this.coordinates.height,aspectRatio:{minimum:this.coordinates.width/this.coordinates.height,maximum:this.coordinates.width/this.coordinates.height}});if(n.maxArea&&o.width*o.height>n.maxArea){var r=Math.sqrt(n.maxArea/(o.width*o.height));o={width:Math.round(r*o.width),height:Math.round(r*o.height)};}return function(t,e,i,n,s){t.width=n?n.width:i.width,t.height=n?n.height:i.height;var o=t.getContext("2d");o.clearRect(0,0,t.width,t.height),s&&(s.imageSmoothingEnabled&&(o.imageSmoothingEnabled=s.imageSmoothingEnabled),s.imageSmoothingQuality&&(o.imageSmoothingQuality=s.imageSmoothingQuality),s.fillColor&&(o.fillStyle=s.fillColor,o.fillRect(0,0,t.width,t.height),o.save()));var r=i.left<0?-i.left:0,a=i.top<0?-i.top:0;o.drawImage(e,i.left+r,i.top+a,i.width,i.height,r*(t.width/i.width),a*(t.height/i.height),t.width,t.height);}(t,i,this.coordinates,o,n),t}},update:function(){this.$emit("change",this.getResult());},applyTransform:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=this.visibleArea&&e?wt(this.sizeRestrictions,this.visibleArea):this.sizeRestrictions,n=this.visibleArea&&e?jt(this.positionRestrictions,this.visibleArea):this.positionRestrictions;return xt({transform:t,coordinates:this.coordinates,imageSize:this.imageSize,sizeRestrictions:i,positionRestrictions:n,aspectRatio:this.getAspectRatio(),visibleArea:this.visibleArea})},resetCoordinates:function(){var t=this;if(this.$refs.image){this.$refs.cropper,this.$refs.image;var e=this.defaultSize;e||(e=this.stencilSize?Dt:Ot);var i=this.sizeRestrictions;i.minWidth,i.minHeight,i.maxWidth,i.maxHeight;var n=O(e)?e({boundaries:this.boundaries,imageSize:this.imageSize,aspectRatio:this.getAspectRatio(),sizeRestrictions:this.sizeRestrictions,stencilSize:this.getStencilSize(),visibleArea:this.visibleArea}):e,s=this.defaultPosition||Tt,o=[n,function(e){var i=e.coordinates;return g({},O(s)?s({coordinates:i,imageSize:t.imageSize,visibleArea:t.visibleArea}):t.defaultPosition)}];this.delayedTransforms&&o.push.apply(o,b(Array.isArray(this.delayedTransforms)?this.delayedTransforms:[this.delayedTransforms])),this.coordinates=this.applyTransform(o,!0),this.delayedTransforms=null;}},clearImage:function(){var t=this;this.imageLoaded=!1,setTimeout((function(){var e=t.$refs.stretcher;e&&(e.style.height="auto",e.style.width="auto"),t.coordinates=t.defaultCoordinates(),t.boundaries={width:0,height:0};}),this.transitionTime);},enableTransitions:function(){this.transitions&&(this.transitionsActive=!0);},disableTransitions:function(){this.transitionsActive=!1;},updateBoundaries:function(){var t=this,e=this.$refs.stretcher,i=this.$refs.cropper;return this.initStretcher({cropper:i,stretcher:e,imageSize:this.imageSize}),this.$nextTick().then((function(){var e={cropper:i,imageSize:t.imageSize};if(O(t.defaultBoundaries)?t.boundaries=t.defaultBoundaries(e):"fit"===t.defaultBoundaries?t.boundaries=function(t){var e=t.cropper,i=t.imageSize,n=e.clientHeight,s=e.clientWidth,o=n,r=i.width*n/i.height;return r>s&&(r=s,o=i.height*s/i.width),{width:r,height:o}}(e):t.boundaries=function(t){var e=t.cropper;return {width:e.clientWidth,height:e.clientHeight}}(e),!t.boundaries.width||!t.boundaries.height)throw new Error("It's impossible to fit the cropper in the current container")}))},resetVisibleArea:function(){var t=this;return this.appliedImageTransforms=g(g({},this.defaultImageTransforms),{},{flip:g({},this.defaultImageTransforms.flip)}),this.updateBoundaries().then((function(){"visible-area"!==t.priority&&(t.visibleArea=null,t.resetCoordinates());var e,i,n,s,o,r,a=t.defaultVisibleArea||Ht;t.visibleArea=O(a)?a({imageSize:t.imageSize,boundaries:t.boundaries,coordinates:"visible-area"!==t.priority?t.coordinates:null,getAreaRestrictions:t.getAreaRestrictions,stencilSize:t.getStencilSize()}):t.defaultVisibleArea,t.visibleArea=(e={visibleArea:t.visibleArea,boundaries:t.boundaries,getAreaRestrictions:t.getAreaRestrictions},i=e.visibleArea,n=e.boundaries,s=e.getAreaRestrictions,o=C({},i),r=ct(n),o.width/o.height!==r&&(o.height=o.width/r),vt(o,s({visibleArea:o,type:"move"}))),"visible-area"===t.priority?t.resetCoordinates():t.coordinates=t.fitCoordinates({visibleArea:t.visibleArea,coordinates:t.coordinates,aspectRatio:t.getAspectRatio(),positionRestrictions:t.positionRestrictions,sizeRestrictions:t.sizeRestrictions}),t.runAutoZoom("resetVisibleArea");})).catch((function(){t.visibleArea=null;}))},updateVisibleArea:function(){var t=this;return this.updateBoundaries().then((function(){t.visibleArea=t.fitVisibleArea({imageSize:t.imageSize,boundaries:t.boundaries,visibleArea:t.visibleArea,coordinates:t.coordinates,getAreaRestrictions:t.getAreaRestrictions}),t.coordinates=t.fitCoordinates({visibleArea:t.visibleArea,coordinates:t.coordinates,aspectRatio:t.getAspectRatio(),positionRestrictions:t.positionRestrictions,sizeRestrictions:t.sizeRestrictions}),t.runAutoZoom("updateVisibleArea");})).catch((function(){t.visibleArea=null;}))},onChange:function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];t&&this.debounce?this.debouncedUpdate():this.update();},onChangeImage:function(){var t,e=this;if(this.imageLoaded=!1,this.delayedTransforms=null,this.src){if(function(t){if(T(t))return !1;var e=window.location,i=/(\w+:)?(?:\/\/)([\w.-]+)?(?::(\d+))?\/?/.exec(t)||[],n={protocol:i[1]||"",host:i[2]||"",port:i[3]||""},s=function(t){return t.port||("http"===(t.protocol||e.protocol)?80:433)};return !(!n.protocol&&!n.host&&!n.port||Boolean(n.protocol&&n.protocol==e.protocol&&n.host&&n.host==e.host&&n.host&&s(n)==s(e)))}(this.src)){var i=D(this.crossOrigin)?this.canvas:this.crossOrigin;!0===i&&(i="anonymous"),this.imageAttributes.crossOrigin=i||null;}if(this.checkOrientation){var n=(t=this.src,new Promise((function(e){Jt(t).then((function(i){var n=ee(i);e(i?{source:t,arrayBuffer:i,orientation:n}:{source:t,arrayBuffer:null,orientation:null});})).catch((function(i){console.warn(i),e({source:t,arrayBuffer:null,orientation:null});}));})));setTimeout((function(){n.then(e.onParseImage);}),this.transitionTime);}else setTimeout((function(){e.onParseImage({source:e.src});}),this.transitionTime);}else this.clearImage();},onFailLoadImage:function(){this.imageAttributes.src&&(this.clearImage(),this.$emit("error"));},onSuccessLoadImage:function(){var t=this,e=this.$refs.image;e&&!this.imageLoaded&&(this.imageAttributes.height=e.naturalHeight,this.imageAttributes.width=e.naturalWidth,this.imageLoaded=!0,this.resetVisibleArea().then((function(){t.$emit("ready"),t.onChange(!1);})));},onParseImage:function(t){var e=this,i=t.source,n=t.arrayBuffer,s=t.orientation;this.imageAttributes.revoke&&this.imageAttributes.src&&URL.revokeObjectURL(this.imageAttributes.src),this.imageAttributes.revoke=!1,n&&s&&s>1?W(i)||!T(i)?(this.imageAttributes.src=URL.createObjectURL(new Blob([n])),this.imageAttributes.revoke=!0):this.imageAttributes.src=function(t){for(var e=[],i=new Uint8Array(t);i.length>0;){var n=i.subarray(0,8192);e.push(String.fromCharCode.apply(null,Array.from?Array.from(n):n.slice())),i=i.subarray(8192);}return "data:image/jpeg;base64,"+btoa(e.join(""))}(n):this.imageAttributes.src=i,O(this.defaultTransforms)?this.appliedImageTransforms=Kt(this.defaultTransforms()):H(this.defaultTransforms)?this.appliedImageTransforms=Kt(this.defaultTransforms):this.appliedImageTransforms=function(t){var e=Kt({});if(t)switch(t){case 2:e.flip.horizontal=!0;break;case 3:e.rotate=-180;break;case 4:e.flip.vertical=!0;break;case 5:e.rotate=90,e.flip.vertical=!0;break;case 6:e.rotate=90;break;case 7:e.rotate=90,e.flip.horizontal=!0;break;case 8:e.rotate=-90;}return e}(s),this.defaultImageTransforms=g(g({},this.appliedImageTransforms),{},{flip:g({},this.appliedImageTransforms.flip)}),this.$nextTick((function(){var t=e.$refs.image;t&&t.complete&&(!function(t){return Boolean(t.naturalWidth)}(t)?e.onFailLoadImage():e.onSuccessLoadImage());}));},onResizeEnd:function(){this.runAutoZoom("resize",{transitions:!0});},onMoveEnd:function(){this.runAutoZoom("move",{transitions:!0});},onMove:function(t){var e=this;this.transitionsOptions.enabled||this.awaitRender((function(){e.coordinates=e.moveAlgorithm(g(g({},e.getPublicProperties()),{},{positionRestrictions:jt(e.positionRestrictions,e.visibleArea),coordinates:e.coordinates,event:e.normalizeEvent(t)})),e.onChange();}));},onResize:function(t){var e=this;this.transitionsOptions.enabled||this.stencilSize&&!this.autoZoom||this.awaitRender((function(){var i=e.sizeRestrictions,n=Math.min(e.coordinates.width,e.coordinates.height,20*e.coefficient);e.coordinates=e.resizeAlgorithm(g(g({},e.getPublicProperties()),{},{positionRestrictions:jt(e.positionRestrictions,e.visibleArea),sizeRestrictions:{maxWidth:Math.min(i.maxWidth,e.visibleArea.width),maxHeight:Math.min(i.maxHeight,e.visibleArea.height),minWidth:Math.max(i.minWidth,n),minHeight:Math.max(i.minHeight,n)},event:e.normalizeEvent(t)})),e.onChange(),e.ticking=!1;}));},onManipulateImage:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!this.transitionsOptions.enabled){var i=e.transitions,n=void 0!==i&&i,s=e.normalize,o=void 0===s||s;n&&this.enableTransitions();var r=Lt(g(g({},this.getPublicProperties()),{},{event:o?this.normalizeEvent(t):t,getAreaRestrictions:this.getAreaRestrictions,imageRestriction:this.imageRestriction,adjustStencil:!this.stencilSize&&this.settings.resizeImage.adjustStencil})),a=r.visibleArea,h=r.coordinates;this.visibleArea=a,this.coordinates=h,this.runAutoZoom("manipulateImage"),this.onChange(),n&&this.debouncedDisableTransitions();}},onPropsChange:function(){this.coordinates=this.applyTransform(this.coordinates,!0),this.onChange(!1);},getAreaRestrictions:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.visibleArea,i=t.type,n=void 0===i?"move":i;return this.areaRestrictionsAlgorithm({boundaries:this.boundaries,imageSize:this.imageSize,imageRestriction:this.imageRestriction,visibleArea:e,type:n})},getAspectRatio:function(t){var e,i,n=this.stencilProps,s=n.aspectRatio,o=n.minAspectRatio,r=n.maxAspectRatio;if(this.$refs.stencil&&this.$refs.stencil.aspectRatios){var a=this.$refs.stencil.aspectRatios();e=a.minimum,i=a.maximum;}if(D(e)&&(e=D(s)?o:s),D(i)&&(i=D(s)?r:s),!t&&(D(e)||D(i))){var h=this.getStencilSize(),c=h?ct(h):null;D(e)&&(e=P(c)?c:void 0),D(i)&&(i=P(c)?c:void 0);}return {minimum:e,maximum:i}},getStencilSize:function(){if(this.stencilSize)return t={currentStencilSize:{width:this.stencilCoordinates.width,height:this.stencilCoordinates.height},stencilSize:this.stencilSize,boundaries:this.boundaries,coefficient:this.coefficient,coordinates:this.coordinates,aspectRatio:this.getAspectRatio(!0)},e=t.boundaries,i=t.stencilSize,n=t.aspectRatio,dt(ct(s=O(i)?i({boundaries:e,aspectRatio:n}):i),n)&&(s=Mt({sizeRestrictions:{maxWidth:e.width,maxHeight:e.height,minWidth:0,minHeight:0},width:s.width,height:s.height,aspectRatio:{minimum:n.minimum,maximum:n.maximum}})),(s.width>e.width||s.height>e.height)&&(s=Mt({sizeRestrictions:{maxWidth:e.width,maxHeight:e.height,minWidth:0,minHeight:0},width:s.width,height:s.height,aspectRatio:{minimum:ct(s),maximum:ct(s)}})),s;var t,e,i,n,s;},getPublicProperties:function(){return {coefficient:this.coefficient,visibleArea:this.visibleArea,coordinates:this.coordinates,boundaries:this.boundaries,sizeRestrictions:this.sizeRestrictions,positionRestrictions:this.positionRestrictions,aspectRatio:this.getAspectRatio(),imageRestriction:this.imageRestriction}},defaultCoordinates:function(){return g({},J)},flip:function(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=i.transitions,s=void 0===n||n;if(!this.transitionsActive){s&&this.enableTransitions();var o=g({},this.imageTransforms.flip),r=$t({flip:{horizontal:t?!o.horizontal:o.horizontal,vertical:e?!o.vertical:o.vertical},previousFlip:o,rotate:this.imageTransforms.rotate,visibleArea:this.visibleArea,coordinates:this.coordinates,imageSize:this.imageSize,positionRestrictions:this.positionRestrictions,sizeRestrictions:this.sizeRestrictions,getAreaRestrictions:this.getAreaRestrictions,aspectRatio:this.getAspectRatio()}),a=r.visibleArea,h=r.coordinates;t&&(this.appliedImageTransforms.flip.horizontal=!this.appliedImageTransforms.flip.horizontal),e&&(this.appliedImageTransforms.flip.vertical=!this.appliedImageTransforms.flip.vertical),this.visibleArea=a,this.coordinates=h,this.onChange(),s&&this.debouncedDisableTransitions();}},rotate:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=e.transitions,n=void 0===i||i;if(!this.transitionsActive){n&&this.enableTransitions();var s=g({},this.imageSize);this.appliedImageTransforms.rotate+=t;var o=Pt({visibleArea:this.visibleArea,coordinates:this.coordinates,previousImageSize:s,imageSize:this.imageSize,angle:t,positionRestrictions:this.positionRestrictions,sizeRestrictions:this.sizeRestrictions,getAreaRestrictions:this.getAreaRestrictions,aspectRatio:this.getAspectRatio()}),r=o.visibleArea,a=o.coordinates,h=this.processAutoZoom("rotateImage",r,a);r=h.visibleArea,a=h.coordinates,this.visibleArea=r,this.coordinates=a,this.onChange(),n&&this.debouncedDisableTransitions();}}},emits:["change","error","ready"]},ve={key:0,ref:"canvas",style:{display:"none"}},be={key:1,ref:"sourceCanvas",style:{display:"none"}};fe.render=function(i,n,r,a,p,g){return openBlock(),createBlock("div",{ref:"cropper",class:g.classes.cropper},[createVNode("div",{ref:"stretcher",class:g.classes.stretcher},null,2),createVNode("div",{class:g.classes.boundaries,style:g.boundariesStyle},[(openBlock(),createBlock(resolveDynamicComponent(r.backgroundWrapperComponent),{class:g.classes.cropperWrapper,"wheel-resize":g.settings.resizeImage.wheel,"touch-resize":g.settings.resizeImage.touch,"touch-move":g.settings.moveImage.touch,"mouse-move":g.settings.moveImage.mouse,onMove:g.onManipulateImage,onResize:g.onManipulateImage},{default:withCtx((function(){return [createVNode("div",{class:g.classes.background,style:g.boundariesStyle},null,6),createVNode("div",{class:g.classes.imageWrapper},[createVNode("img",{ref:"image",crossorigin:p.imageAttributes.crossOrigin,src:p.imageAttributes.src,class:g.classes.image,style:g.imageStyle,onMousedown:n[1]||(n[1]=withModifiers((function(){}),["prevent"]))},null,46,["crossorigin","src"])],2),createVNode("div",{class:g.classes.foreground,style:g.boundariesStyle},null,6),withDirectives((openBlock(),createBlock(resolveDynamicComponent(r.stencilComponent),mergeProps({ref:"stencil",image:g.image,coordinates:p.coordinates,"stencil-coordinates":g.stencilCoordinates,transitions:g.transitionsOptions},r.stencilProps,{onResize:g.onResize,onResizeEnd:g.onResizeEnd,onMove:g.onMove,onMoveEnd:g.onMoveEnd}),null,16,["image","coordinates","stencil-coordinates","transitions","onResize","onResizeEnd","onMove","onMoveEnd"])),[[vShow,p.imageLoaded]]),r.canvas?(openBlock(),createBlock("canvas",ve,null,512)):createCommentVNode("",!0),r.canvas?(openBlock(),createBlock("canvas",be,null,512)):createCommentVNode("",!0)]})),_:1},8,["class","wheel-resize","touch-resize","touch-move","mouse-move","onMove","onResize"]))],6)],2)};

var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

var css$6 = ".vue-advanced-cropper {\n  text-align: center;\n  position: relative;\n  user-select: none;\n  max-height: 100%;\n  max-width: 100%;\n  direction: ltr;\n}\n.vue-advanced-cropper__stretcher {\n  pointer-events: none;\n  position: relative;\n  max-width: 100%;\n  max-height: 100%;\n}\n.vue-advanced-cropper__image {\n  user-select: none;\n  position: absolute;\n  transform-origin: center;\n  max-width: none !important;\n}\n.vue-advanced-cropper__background, .vue-advanced-cropper__foreground {\n  opacity: 1;\n  background: black;\n  transform: translate(-50%, -50%);\n  position: absolute;\n  top: 50%;\n  left: 50%;\n}\n.vue-advanced-cropper__foreground {\n  opacity: 0.5;\n}\n.vue-advanced-cropper__boundaries {\n  opacity: 1;\n  transform: translate(-50%, -50%);\n  position: absolute;\n  left: 50%;\n  top: 50%;\n}\n.vue-advanced-cropper__cropper-wrapper {\n  width: 100%;\n  height: 100%;\n}\n.vue-advanced-cropper__image-wrapper {\n  overflow: hidden;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n.vue-advanced-cropper__stencil-wrapper {\n  position: absolute;\n}\n\n.vue-simple-handler {\n  display: block;\n  background: white;\n  height: 10px;\n  width: 10px;\n}\n\n.vue-handler-wrapper {\n  position: absolute;\n  transform: translate(-50%, -50%);\n  width: 30px;\n  height: 30px;\n}\n.vue-handler-wrapper__draggable {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.vue-handler-wrapper--west-north {\n  cursor: nw-resize;\n}\n.vue-handler-wrapper--north {\n  cursor: n-resize;\n}\n.vue-handler-wrapper--east-north {\n  cursor: ne-resize;\n}\n.vue-handler-wrapper--east {\n  cursor: e-resize;\n}\n.vue-handler-wrapper--east-south {\n  cursor: se-resize;\n}\n.vue-handler-wrapper--south {\n  cursor: s-resize;\n}\n.vue-handler-wrapper--west-south {\n  cursor: sw-resize;\n}\n.vue-handler-wrapper--west {\n  cursor: w-resize;\n}\n.vue-handler-wrapper--disabled {\n  cursor: auto;\n}\n\n.vue-line-wrapper {\n  background: none;\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.vue-line-wrapper--north, .vue-line-wrapper--south {\n  height: 12px;\n  width: 100%;\n  left: 0;\n  transform: translateY(-50%);\n}\n.vue-line-wrapper--north {\n  top: 0;\n  cursor: n-resize;\n}\n.vue-line-wrapper--south {\n  top: 100%;\n  cursor: s-resize;\n}\n.vue-line-wrapper--east, .vue-line-wrapper--west {\n  width: 12px;\n  height: 100%;\n  transform: translateX(-50%);\n  top: 0;\n}\n.vue-line-wrapper--east {\n  left: 100%;\n  cursor: e-resize;\n}\n.vue-line-wrapper--west {\n  left: 0;\n  cursor: w-resize;\n}\n.vue-line-wrapper--disabled {\n  cursor: auto;\n}\n\n.vue-bounding-box {\n  position: relative;\n  height: 100%;\n  width: 100%;\n}\n.vue-bounding-box__handler {\n  position: absolute;\n}\n.vue-bounding-box__handler--west-north {\n  left: 0;\n  top: 0;\n}\n.vue-bounding-box__handler--north {\n  left: 50%;\n  top: 0;\n}\n.vue-bounding-box__handler--east-north {\n  left: 100%;\n  top: 0;\n}\n.vue-bounding-box__handler--east {\n  left: 100%;\n  top: 50%;\n}\n.vue-bounding-box__handler--east-south {\n  left: 100%;\n  top: 100%;\n}\n.vue-bounding-box__handler--south {\n  left: 50%;\n  top: 100%;\n}\n.vue-bounding-box__handler--west-south {\n  left: 0;\n  top: 100%;\n}\n.vue-bounding-box__handler--west {\n  left: 0;\n  top: 50%;\n}\n\n.vue-draggable-area {\n  position: relative;\n}\n\n.vue-preview-result {\n  overflow: hidden;\n  box-sizing: border-box;\n  position: absolute;\n  height: 100%;\n  width: 100%;\n}\n.vue-preview-result__wrapper {\n  position: absolute;\n}\n.vue-preview-result__image {\n  pointer-events: none;\n  position: relative;\n  user-select: none;\n  transform-origin: center;\n  max-width: none !important;\n}\n\n.vue-rectangle-stencil {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  box-sizing: border-box;\n}\n.vue-rectangle-stencil__preview {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n.vue-rectangle-stencil--movable {\n  cursor: move;\n}\n\n.vue-circle-stencil {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  box-sizing: content-box;\n  cursor: move;\n}\n.vue-circle-stencil__preview {\n  border-radius: 50%;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n.vue-circle-stencil--movable {\n  cursor: move;\n}\n\n.vue-preview {\n  overflow: hidden;\n  box-sizing: border-box;\n  position: relative;\n}\n.vue-preview--fill {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n}\n.vue-preview__wrapper {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n}\n.vue-preview__image {\n  pointer-events: none;\n  position: absolute;\n  user-select: none;\n  transform-origin: center;\n  max-width: none !important;\n}\n\n.vue-simple-line {\n  background: none;\n  transition: border 0.5s;\n  border-color: rgba(255, 255, 255, 0.3);\n  border-width: 0;\n  border-style: solid;\n}\n.vue-simple-line--south, .vue-simple-line--north {\n  height: 0;\n  width: 100%;\n}\n.vue-simple-line--east, .vue-simple-line--west {\n  height: 100%;\n  width: 0;\n}\n.vue-simple-line--east {\n  border-right-width: 1px;\n}\n.vue-simple-line--west {\n  border-left-width: 1px;\n}\n.vue-simple-line--south {\n  border-bottom-width: 1px;\n}\n.vue-simple-line--north {\n  border-top-width: 1px;\n}\n.vue-simple-line--hover {\n  opacity: 1;\n  border-color: white;\n}";
n(css$6,{});

var css$5 = ".vue-advanced-cropper__foreground {\n  opacity: 0.7;\n}\n\n.vue-circle-stencil__preview:after, .vue-circle-stencil__preview:before,\n.vue-rectangle-stencil__preview:after,\n.vue-rectangle-stencil__preview:before {\n  content: \"\";\n  opacity: 0;\n  -webkit-transition: opacity 0.25s;\n  transition: opacity 0.25s;\n  position: absolute;\n  pointer-events: none;\n  z-index: 1;\n}\n.vue-circle-stencil__preview:after,\n.vue-rectangle-stencil__preview:after {\n  border-left: solid 1px white;\n  border-right: solid 1px white;\n  width: 33%;\n  height: 100%;\n  -webkit-transform: translateX(-50%);\n          transform: translateX(-50%);\n  left: 50%;\n  top: 0;\n}\n.vue-circle-stencil__preview:before,\n.vue-rectangle-stencil__preview:before {\n  border-top: solid 1px white;\n  border-bottom: solid 1px white;\n  height: 33%;\n  width: 100%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n  top: 50%;\n  left: 0;\n}\n.vue-circle-stencil--moving .vue-rectangle-stencil__preview:after, .vue-circle-stencil--moving .vue-rectangle-stencil__preview:before,\n.vue-circle-stencil--moving .vue-circle-stencil__preview:after,\n.vue-circle-stencil--moving .vue-circle-stencil__preview:before, .vue-circle-stencil--resizing .vue-rectangle-stencil__preview:after, .vue-circle-stencil--resizing .vue-rectangle-stencil__preview:before,\n.vue-circle-stencil--resizing .vue-circle-stencil__preview:after,\n.vue-circle-stencil--resizing .vue-circle-stencil__preview:before,\n.vue-rectangle-stencil--moving .vue-rectangle-stencil__preview:after,\n.vue-rectangle-stencil--moving .vue-rectangle-stencil__preview:before,\n.vue-rectangle-stencil--moving .vue-circle-stencil__preview:after,\n.vue-rectangle-stencil--moving .vue-circle-stencil__preview:before,\n.vue-rectangle-stencil--resizing .vue-rectangle-stencil__preview:after,\n.vue-rectangle-stencil--resizing .vue-rectangle-stencil__preview:before,\n.vue-rectangle-stencil--resizing .vue-circle-stencil__preview:after,\n.vue-rectangle-stencil--resizing .vue-circle-stencil__preview:before {\n  opacity: 0.7;\n}\n\n.vue-simple-line {\n  border-color: rgba(255, 255, 255, 0.8);\n}\n\n.vue-simple-handler-wrapper {\n  width: 24px;\n  height: 24px;\n}\n.vue-simple-handler-wrapper--west-north {\n  -webkit-transform: translate(0, 0);\n          transform: translate(0, 0);\n}\n.vue-simple-handler-wrapper--east-south {\n  -webkit-transform: translate(-100%, -100%);\n          transform: translate(-100%, -100%);\n}\n.vue-simple-handler-wrapper--west-south {\n  -webkit-transform: translate(0, -100%);\n          transform: translate(0, -100%);\n}\n.vue-simple-handler-wrapper--east-north {\n  -webkit-transform: translate(-100%, 0);\n          transform: translate(-100%, 0);\n}\n\n.vue-simple-handler {\n  display: block;\n  position: relative;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -webkit-transition: opacity 0.5s;\n  transition: opacity 0.5s;\n  border: none;\n  background: white;\n  top: auto;\n  left: auto;\n  height: 4px;\n  width: 4px;\n  opacity: 0;\n}\n.vue-simple-handler--west-north, .vue-simple-handler--east-south, .vue-simple-handler--west-south, .vue-simple-handler--east-north {\n  display: block;\n  height: 16px;\n  width: 16px;\n  background: none;\n  opacity: 0.7;\n}\n.vue-simple-handler--west-north {\n  border-left: solid 2px white;\n  border-top: solid 2px white;\n}\n.vue-simple-handler--east-south {\n  border-right: solid 2px white;\n  border-bottom: solid 2px white;\n}\n.vue-simple-handler--west-south {\n  border-left: solid 2px white;\n  border-bottom: solid 2px white;\n}\n.vue-simple-handler--east-north {\n  border-right: solid 2px white;\n  border-top: solid 2px white;\n}\n.vue-simple-handler--hover {\n  opacity: 1;\n}\n\n.vue-circle-stencil__preview {\n  border: solid 2px rgba(255, 255, 255, 0.8);\n}\n.vue-circle-stencil .vue-simple-line {\n  border-color: rgba(255, 255, 255, 0.3);\n}\n.vue-circle-stencil .vue-simple-handler--west-north, .vue-circle-stencil .vue-simple-handler--east-south, .vue-circle-stencil .vue-simple-handler--west-south, .vue-circle-stencil .vue-simple-handler--east-north {\n  opacity: 0.4;\n}\n.vue-circle-stencil .vue-simple-handler--hover {\n  opacity: 1;\n}";
n(css$5,{});

var css$4 = "\n.exceeds-the-limit {\n  color: red;\n}\n.ml-1 {\n  margin-left: 0.5rem;\n}\n#sfx-modal .filerobot-Provider-ItemCategory-wrapper .filerobot-u-reset {\n  top: 0;\n}\n.modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n}\n.modal {\n  background: white;\n  border-radius: 8px;\n  padding: 1rem;\n  width: 80%;\n  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);\n  overflow-y: auto;\n  max-height: 80vh;\n  margin: 1.75rem auto;\n}\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.modal-close-btn {\n  background: transparent;\n  border: none;\n  font-size: 1.5rem;\n  cursor: pointer;\n}\n.modal-body {\n  margin: 1rem 0;\n}\n.modal-footer {\n  text-align: right;\n}\n.sfx-media-icon {\n  width: 34px;\n  height: 34px;\n  border-radius: 25%;\n  position: relative; /* Ensure the pseudo-element is positioned relative to this container */\n  overflow: hidden;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.media-item-icon {\n  position: absolute !important;\n  top: 7px;\n  left: 5px;\n  opacity: 0;\n  transition: opacity 0.3s ease;\n  z-index: 9999;\n}\n.sfx-media-icon::after {\n  content: ''; /* Empty content to create the pseudo-element */\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  z-index: 100;\n  height: 100%;\n  background-color: #0c3745;\n  opacity: 0; /* Start with no visibility */\n  transition: opacity 0.3s ease; /* Smooth fade in/out effect */\n  backdrop-filter: blur(5px); /* Apply blur effect */\n}\n.sfx-media-icon:hover .media-item-icon {\n  opacity: 1;\n}\n.sfx-media-icon:hover::after {\n  opacity: 0.85; /* Show the white blur overlay on hover */\n}\n.sfx-media-icon img {\n  width: 34px;\n  height: 34px;\n  display: block;\n  margin: 0 auto;\n  object-fit: cover;\n  border-radius: 25%;\n}\n.sfx-item .item-info {\n  margin-left: 12px;\n}\n.sfx-item .item-info a {\n  color: var(--theme--primary);\n}\n.sfx-item-inner {\n  display: flex;\n  align-items: center;\n}\n.bottom-message {\n  display: flex;\n  align-items: center;\n  justify-content: end;\n  margin-top: var(--v-list-item-margin, 4px);\n}\n.sfx-item {\n  padding: 6px;\n  border: var(--theme--border-width) solid var(--v-list-item-border-color, var(--theme--form--field--input--border-color));\n  border-radius: var(--theme--border-radius);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  color: var(--v-list-item-color, var(--v-list-color, var(--theme--foreground)));\n  margin-top: var(--v-list-item-margin, 4px);\n  cursor: pointer;\n  transition: border-color 500ms ease;\n}\n.sfx-item:hover {\n  border: var(--theme--border-width) solid var(--v-list-item-border-color-hover, var(--theme--form--field--input--border-color-hover));\n}\n.sfx-media-icon .icon {\n  width: 80px;\n  height: 80px;\n  position: relative;\n}\n.btn-delete-item:hover {\n  color: var(--theme--danger);\n}\n.sfx-media-icon .icon i {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(50%, 50%);\n  font-size: 35px;\n}\n.item-icon {\n  width: 34px !important;\n  text-align: center;\n  padding: 0 var(--v-list-item-margin, 4px);\n}\n.remove-all span {\n  color: red;\n  font-size: 12px;\n  border: none;\n  background: none;\n  width: 100%;\n}\n.remove-all span:hover {\n  cursor: pointer;\n  color: rgb(185, 37, 37);\n}\n.asset-content {\n  max-height: 545px;\n  overflow-y: scroll;\n}\n.btn-drag-item {\n  margin-right: 8px;\n  cursor: move;\n  cursor: grab;\n}\n.btn-drag-item:active {\n  cursor: grabbing;\n}\n.asset-content::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 6px rgba(174, 174, 174, 0.3);\n  border-radius: 10px;\n  background-color: #F5F5F5;\n}\n.toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: var(--v-list-item-margin, 4px);\n}\n.container .v-card {\n  max-width: 80%;\n}\n.toolbar-item {\n  margin-top: 10px;\n  cursor: pointer;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: var(--v-list-item-margin, 4px);\n  transition: background-color 500ms ease, text-color 500ms ease;\n  border-radius: var(--v-list-item-border-radius, var(--theme--border-radius));\n}\n.toolbar_item_active {\n  background: var(--theme--primary);\n  color: white;\n}\n.toolbar-item:hover {\n  background: var(--theme--primary);\n  color: white;\n}\n.grid-bg{\n  margin: 0;\n  background-color: #fff; /* White background */\n  background-image:\n      linear-gradient(to right, rgba(204, 204, 204, 0.29) 1px, transparent 1px), /* Vertical lines */\n      linear-gradient(to bottom, rgba(204, 204, 204, 0.29) 1px, transparent 1px); /* Horizontal lines */\n  background-size: 5px 5px; /* Size of the grid cell */\n}\n.cropper {\n  height: 600px;\n  width: 600px;\n  background: transparent;\n}\n\n";
n(css$4,{});

var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _sfc_main$4 = {
  components: {
    draggable: VueDraggableNext,
    Cropper: fe,
  },
  props: {
    value: {
      type: String,
      default: null,
    },
    collection: {type: String, default: 'scaleflex_dam_settings'},
    id: {type: Number, default: 1},
    title: {
      type: String,
      default: 'Scaleflex DAM',
    },
    custom: {type: Boolean, default: false},
    limit: {type: Number, default: 0},
    limitTypes: {type: String, default: null},
    attributes: {type: String, default: null},
    config: {type: Object, default: null},
  },
  watch: {
    currentVariantConfigs: {
      handler(newConfigs, oldConfigs) {
        this.updateCurrentVariantShow();
      },
      deep: true,
    }
  },
  methods: {
    showVariants(itemUUID) {
      const index = this.showVariantsList.indexOf(itemUUID);
      if (index > -1) {
        this.showVariantsList.splice(index, 1);
      } else {
        this.showVariantsList.push(itemUUID);
      }
    },
    updateVariantByCrop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult();
      this.showCrop = false;
      this.currentVariantConfigs.width = coordinates.width;
      this.currentVariantConfigs.height = coordinates.height;
      const tl_px = `${coordinates.left},${coordinates.top}`;
      const br_px = `${coordinates.left + coordinates.width},${coordinates.top + coordinates.height}`;
      this.currentVariantConfigs.tl_px = tl_px;
      this.currentVariantConfigs.br_px = br_px;
    },
    updateVariantConfigByCrop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult();
      this.currentVariantConfigs.width = coordinates.width;
      this.currentVariantConfigs.height = coordinates.height;
      const tl_px = `${coordinates.left},${coordinates.top}`;
      const br_px = `${coordinates.left + coordinates.width},${coordinates.top + coordinates.height}`;
      this.currentVariantConfigs.tl_px = tl_px;
      this.currentVariantConfigs.br_px = br_px;
    },
    toggleCrop() {
      this.showCrop = !this.showCrop;
    },
    isImage(type) {
      return type.startsWith("image");
    },
    isVideo(type) {
      return type.startsWith("video");
    },
    isAudio(type) {
      return type.startsWith("audio");
    },
    hasQueryString(url) {
      try {
        const urlObject = new URL(url);
        return urlObject.search.length > 0;
      } catch (error) {
        return false;
      }
    },
    createThumbnail(url) {
      if (!this.hasQueryString(url)) return url + '?width=100&height=100'
      else return url + '&width=100&height=100'
    },
    trimText(filename) {
      const maxLength = 50;
      if (filename.length <= maxLength) {
        return filename;
      }
      const lastDotIndex = filename.lastIndexOf(".");
      const baseName = lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
      const extension = lastDotIndex !== -1 ? filename.substring(lastDotIndex) : "";
      const baseMaxLength = maxLength - extension.length - 3; // 3 for "..."
      const truncatedBaseName = baseName.substring(0, Math.max(baseMaxLength, 0));
      return truncatedBaseName + "..." + extension;
    },
    updateCurrentVariantShow() {
      const baseUrl = this.currentVariantShow.split("?")[0];
      const query = new URLSearchParams(this.currentVariantConfigs).toString();
      this.currentVariantShow = `${baseUrl}?${query}`;
    }
  },
  emits: ['input', 'close'],
  setup(props, {emit}) {
    const isOpen = ref(false);

    const api = useApi();
    const loadConfigDone = ref(false);
    const isLoading = ref(true);
    const token = ref('');
    const sec = ref('');
    const directory = ref('');
    const limit = ref(null);
    const attributes = ref([]);
    const limitType = ref([]);
    const isOverLimit = ref(false);
    const endpoint = ref('');
    const dialogVisible = ref(false);
    const isTokenAndSecExists = ref(false);
    const configVariantsExist = ref(false);
    const isShowVariantDialog = ref(false);
    const currentVariantShow = ref(null);
    const currentVariantOrigin = ref(null);
    const showCrop = ref(false);
    const currentToolbar = ref("size");
    const showVariantsList = ref([]);
    const currentVariantConfigs = ref({
      width: null,
      height: null,
      org_if_sml: false,
    });

    onMounted(() => {
      init();
    });

    function closeVariantDialog() {
      isShowVariantDialog.value = false;
      currentVariantShow.value = null;
    }

    function showVariantDialog(item, variant) {
      isShowVariantDialog.value = true;
      currentVariantShow.value = variant.img_url;
      currentVariantOrigin.value = item.cdn;

      const url = new URL(variant.img_url);
      const width = url.searchParams.get("width");
      const height = url.searchParams.get("height");

      currentVariantConfigs.value = {
        width: width,
        height: height,
      };

      console.log(`${variant.img_url} Width: ${width}, Height: ${height}`);
    }


    function toDamSetting() {
      const damButton = document.querySelector('a[href="/admin/scaleflex-dam-setting"]');
      if (damButton) {
        damButton.click();
      }
    }

    function changeToolbar(toolbar) {
      currentToolbar.value = toolbar;
    }

    return {
      openModal,
      closeModal,
      deleteItem,
      limitFiles,
      getIsOverLimit,
      getTotalAssets,
      addAssetsDisabled,
      refreshAssets,
      getIsLoading,
      removeAllAssets,
      log,
      closeDialog,
      clickRemoveAllAssets,
      dialogVisible,
      isTokenAndSecExists,
      configVariantsExist,
      toDamSetting,
      closeVariantDialog,
      showVariantDialog,
      isShowVariantDialog,
      currentVariantShow,
      currentToolbar,
      changeToolbar,
      currentVariantConfigs,
      showVariantsList,
      currentVariantOrigin,
      showCrop
    };

    function log() {
      emit('input', toRaw(props.value));
    }

    function addAssetsDisabled() {
      if (limit.value === getTotalAssets() && getTotalAssets() > 0) return true;
      return isLoading.value;
    }

    function getIsLoading() {
      return isLoading.value;
    }

    function deleteItem(index) {
      let value = props.value;
      value.splice(index, 1);
      checkLimit(value);
      emit('input', value);
    }

    function closeModal() {
      document.getElementById("sfx-modal").setAttribute("style", "display: none");
      emit('close');
      isOpen.value = false;
    }

    function openModal() {
      document.getElementById("sfx-modal").setAttribute("style", "display: block");
      isOpen.value = true;
      openSfxDAM();
    }

    async function openSfxDAM() {
      const frConfig = {
        token: token.value,
        sec: sec.value,
        directory: directory.value,
        limitType: limitType.value,
      };
      renderWidget(frConfig);
    }

    async function init() {
      await loadData().then(function () {
        isLoading.value = false;
        loadConfigDone.value = true;
      });
    }

    async function loadData() {
      try {
        const response = await api.get(`/items/scaleflex_dam_settings/${props.id}`);
        const data = response.data.data;

        if (!data) throw new Error('Data not found');
        if (data.token && data.sec) {
          endpoint.value = `https://api.filerobot.com/${data.token}/v5`;
          token.value = data.token || '';
          sec.value = data.sec || '';
          directory.value = data.directory || '';
          isTokenAndSecExists.value = true;
        } else {
          isTokenAndSecExists.value = false;
        }

        if (props.custom) {
          limit.value = props.limit || null;
          limitType.value = props.limitTypes ? props.limitTypes : [];
          attributes.value = props.attributes ? props.attributes : [];
        } else {
          limit.value = data.limit || null;
          limitType.value = data.limitType ? data.limitType.split(",") : [];
          attributes.value = data.attributes ? data.attributes.split(",") : [];
        }

        if (props.config && 'variants' in props.config) configVariantsExist.value = true;

      } catch (error) {

      }
    }

    function getAttributesData(file) {
      let r = {};
      if (attributes.value.length > 0) {
        let arr = attributes.value;
        for (let value of arr) {
          let valueTrim = value.trim();
          r[valueTrim] = file[valueTrim];
        }
        return r
      }
    }

    function checkLimit(updatedFiles) {
      if (limitFiles() > 0 && updatedFiles.length > limitFiles()) {
        isOverLimit.value = true;
      } else {
        isOverLimit.value = false;
      }
    }

    function getTypeAssets(type) {
      let arr = type.split("/");
      return arr[0]
    }

    function getFilesByLimitType(updatedFiles, limitType) {
      const limitTypeArr = limitType;
      if (limitTypeArr.includes('document')) return updatedFiles.filter((file) => limitTypeArr.includes(getTypeAssets(file.type)) || !['image', 'video', 'audio'].includes(getTypeAssets(file.type)))
      else return updatedFiles.filter((file) => limitTypeArr.includes(getTypeAssets(file.type)))
    }

    function getFileUuid(file) {
      const uuidArray = file.uuid.split("_");
      return uuidArray[0];
    }

    function replaceURLParameters(oldUrl, newUrl) {
      // Function to get all param from URL convert to object
      function getURLParameters(url) {
        const queryString = url.split('?')[1];
        if (!queryString) return {};
        const params = queryString.split('&');
        const result = {};
        params.forEach(param => {
          const [key, value] = param.split('=');
          result[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
        return result;
      }

      // Function create the new URL with the new param
      function buildURLWithParameters(baseUrl, params) {
        const queryString = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        return baseUrl.split('?')[0] + '?' + queryString;
      }

      // get param from old url
      const oldParams = getURLParameters(oldUrl);
      // build the new url
      return buildURLWithParameters(newUrl, oldParams);
    }

    async function updateFiles(updatedFiles, isRefresh = false) {
      isLoading.value = true;

      const fetchPromises = updatedFiles.map(async (file, index) => {
        try {
          // Call fetchfileData for each file's uuid (assuming file has a 'uuid' property)
          let uuid = '';

          if (isRefresh) uuid = getFileUuid(file);
          else uuid = file.file.uuid;

          const response = await fetchfileData(uuid);
          let cdnLink = '';

          cdnLink = response?.file?.url.cdn;
          if (file.file?.url.download !== undefined) {
            cdnLink = file.file?.url.download;
          }

          if (isRefresh) {
            cdnLink = replaceURLParameters(file.cdn, cdnLink);
          }

          const tempFile = {
            uuid: response?.file?.uuid + '_' + makeIndexFiles(index),
            name: response?.file?.name,
            cdn: removeURLParameter(cdnLink, 'vh'),
            extension: response?.file?.extension,
            source: 'filerobot',
            type: response?.file?.type,
            ownerName: response?.file?.owner?.name,
          };

          if (configVariantsExist && tempFile.type.startsWith("image")) {
            const imageUrls = [];
            const variants = props.config.variants;
            for (let value of variants) {
              const params = new URLSearchParams(value.preset);
              const updatedUrl = `${tempFile.cdn}?${params.toString()}`;
              imageUrls.push({
                "code": value.code,
                "name": value.name,
                "img_url": updatedUrl
              });
            }
            tempFile['variants'] = imageUrls;
          }

          if (attributes.value.length > 0) {
            tempFile.attributes = getAttributesData(response?.file);
          }

          return tempFile; // Return the data for each file
        } catch (err) {
          return null; // Return null in case of error for this file
        }
      });

      // Wait for all fetch operations to complete and collect all results
      try {
        const results = await Promise.all(fetchPromises);

        const tempFiles = results.filter(file => file);
        let updatedFiles = null;

        if (isRefresh || !props.value) updatedFiles = [...tempFiles];
        else updatedFiles = [...props.value, ...tempFiles];


        checkLimit(updatedFiles);

        if (limitFiles() > 0) updatedFiles = updatedFiles.slice(0, limitFiles());

        if (limitType.value.length > 0) {
          updatedFiles = getFilesByLimitType(updatedFiles, limitType.value);
        }

        emit('input', updatedFiles);
        // Handle the results (e.g., store them or update UI)
      } catch (err) {
        console.error('Error fetching files:', err);
      } finally {
        // Set loading state to false after all fetches are done
        isLoading.value = false;
      }
    }

    function limitFiles() {
      if (limit.value && limit.value > 0) return Number(limit.value)
      return -1
    }

    function makeIndexFiles(index) {
      if (props.value) return index + props.value.length
      else return index
    }

    async function fetchfileData(uuid) {
      isLoading.value = true;
      const url = endpoint.value + '/files/' + uuid + '?format=select:human';

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        return result; // Return the result to be collected in the parent function
      } catch (err) {
        return null; // Return null in case of error
      } finally {
        isLoading.value = false;
      }
    }
    function clickRemoveAllAssets() {
      dialogVisible.value = true;
    }
    function removeAllAssets() {
      emit('input', []);
      isOverLimit.value = false;
      dialogVisible.value = false;
    }
    function removeURLParameter(url, parameter) {
      //prefer to use l.search if you have a location/link object
      var urlparts = url.split('?');
      if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0;) {
          //idiom for string.startsWith
          if (pars[i].lastIndexOf(prefix, 0) !== -1) {
            pars.splice(i, 1);
          }
        }

        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
      }
      return url;
    }

    async function refreshAssets() {
      if (isProxy(props.value)) await updateFiles(toRaw(props.value), true);
      else await updateFiles(props.value, true);
    }
    function getIsOverLimit() {
      return isOverLimit.value
    }

    function getTotalAssets() {
      return props.value ? props.value.length : 0;
    }

    function closeDialog() {
      dialogVisible.value = false;
    }

    function renderWidget(frConfig) {
      if (!window.Filerobot) {
        return;
      }

      let Filerobot = window.Filerobot;

      let filerobot = null;

      filerobot = Filerobot.Core({
        securityTemplateID: frConfig.sec,
        container: frConfig.token
      });

      let frUploadDirectory = frConfig.directory;

      // Plugins
      let Explorer = Filerobot.Explorer;
      let XHRUpload = Filerobot.XHRUpload;

      filerobot
          .use(Explorer, {
            config: {
              rootFolderPath: frUploadDirectory
            },
            target: '#sfx-dam-widget',
            inline: true,
            width: "100%",
            height: "100%",
            disableExportButton: false,
            hideExportButtonIcon: true,
            preventExportDefaultBehavior: true,
            dismissUrlPathQueryUpdate: true,
            disableDownloadButton: false,
            hideDownloadButtonIcon: true,
            preventDownloadDefaultBehavior: true,
            locale: {
              strings: {
                mutualizedExportButtonLabel: 'Add assets',
                mutualizedDownloadButton: 'Add assets'
              }
            },
            filters: {
              mimeTypes: limitType.value, // Replace with an array of MIME types if needed
            }
          })
          .use(XHRUpload)
          .on('export', async (files, popupExportSuccessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
            await updateFiles(files);
            closeModal();
          })
          .on('complete', ({failed, uploadID, successful}) => {
            if (failed) {
              console.dir(failed);
            }

            if (successful) {
              // console.dir(successful);
              successful.forEach((item, key) => {
                // do something
              });
            }
          });
    }
  }
};

const _hoisted_1$4 = ["value"];
const _hoisted_2$4 = { id: "sfx-result" };
const _hoisted_3$4 = { class: "sfx-item" };
const _hoisted_4$4 = { class: "sfx-item-inner" };
const _hoisted_5$3 = { class: "btn-drag-item" };
const _hoisted_6$3 = {
  class: "sfx-media-icon",
  target: "_blank"
};
const _hoisted_7$2 = ["href"];
const _hoisted_8$1 = ["src", "alt"];
const _hoisted_9$1 = { class: "item-info" };
const _hoisted_10$1 = { style: {"display":"flex","align-items":"center","justify-content":"end"} };
const _hoisted_11$1 = ["onClick"];
const _hoisted_12$1 = { key: 2 };
const _hoisted_13$1 = { key: 3 };
const _hoisted_14$1 = ["onClick"];
const _hoisted_15 = {
  key: 0,
  style: {"display":"flex","flex-direction":"column","justify-content":"start","margin-top":"5px"}
};
const _hoisted_16 = ["onClick"];
const _hoisted_17 = { style: {"display":"flex","justify-content":"start","align-items":"center"} };
const _hoisted_18 = ["src", "alt"];
const _hoisted_19 = { style: {"margin-left":"10px"} };
const _hoisted_20 = { style: {"display":"flex","justify-content":"end","align-items":"center"} };
const _hoisted_21 = {
  key: 1,
  class: "sfx-item"
};
const _hoisted_22 = { class: "sfx-item-inner" };
const _hoisted_23 = { class: "btn-drag-item" };
const _hoisted_24 = {
  class: "sfx-media-icon",
  target: "_blank"
};
const _hoisted_25 = ["href"];
const _hoisted_26 = { class: "item-info" };
const _hoisted_27 = ["onClick"];
const _hoisted_28 = {
  key: 2,
  class: "sfx-item"
};
const _hoisted_29 = { class: "sfx-item-inner" };
const _hoisted_30 = { class: "btn-drag-item" };
const _hoisted_31 = {
  class: "sfx-media-icon",
  target: "_blank"
};
const _hoisted_32 = ["href"];
const _hoisted_33 = { class: "item-info" };
const _hoisted_34 = ["onClick"];
const _hoisted_35 = {
  key: 3,
  class: "sfx-item"
};
const _hoisted_36 = { class: "sfx-item-inner" };
const _hoisted_37 = { class: "btn-drag-item" };
const _hoisted_38 = {
  class: "sfx-media-icon",
  target: "_blank"
};
const _hoisted_39 = ["href"];
const _hoisted_40 = { class: "item-info" };
const _hoisted_41 = ["onClick"];
const _hoisted_42 = { class: "bottom-message" };
const _hoisted_43 = {
  key: 0,
  class: "column align-left"
};
const _hoisted_44 = { key: 0 };
const _hoisted_45 = {
  key: 0,
  style: {"display":"flex","align-items":"center","justify-content":"end"},
  class: "exceeds-the-limit"
};
const _hoisted_46 = { style: {"display":"flex","justify-content":"space-between","border":"1px solid lightgray","height":"500px"} };
const _hoisted_47 = {
  id: "variants-toolbar",
  style: {"width":"50px","padding":"5px","display":"flex","align-items":"center","justify-content":"start","flex-direction":"column","border-right":"1px solid lightgray"}
};
const _hoisted_48 = {
  id: "variants-toolbar-config",
  style: {"width":"300px","border-right":"1px solid lightgray","padding":"10px","display":"flex","flex-direction":"column"}
};
const _hoisted_49 = {
  key: 0,
  id: "variants-toolbar-config-size"
};
const _hoisted_50 = { style: {"margin-top":"15px"} };
const _hoisted_51 = {
  key: 1,
  id: "variants-toolbar-config-enlargement"
};
const _hoisted_52 = { style: {"display":"flex","justify-content":"start"} };
const _hoisted_53 = {
  key: 2,
  id: "variants-toolbar-config-crop"
};
const _hoisted_54 = {
  key: 3,
  id: "variants-toolbar-config-addition"
};
const _hoisted_55 = {
  id: "variants-toolbar-image",
  class: "grid-bg",
  style: {"width":"100%","display":"flex","justify-content":"center","align-items":"center","overflow":"hidden","max-height":"100%","position":"relative","padding":"30px"}
};
const _hoisted_56 = { style: {"position":"absolute","top":"5px","right":"5px","display":"flex","justify-content":"end","align-items":"center"} };
const _hoisted_57 = ["src"];
const _hoisted_58 = { key: 1 };
const _hoisted_59 = {
  key: 0,
  class: "toolbar"
};
const _hoisted_60 = { key: 1 };
const _hoisted_61 = { class: "modal" };
const _hoisted_62 = { class: "modal-header" };
const _hoisted_63 = { class: "modal-body" };
const _hoisted_64 = { class: "modal-footer" };

function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VIcon = resolveComponent("VIcon");
  const _component_VButton = resolveComponent("VButton");
  const _component_draggable = resolveComponent("draggable");
  const _component_v_card_title = resolveComponent("v-card-title");
  const _component_v_card_text = resolveComponent("v-card-text");
  const _component_v_card_actions = resolveComponent("v-card-actions");
  const _component_v_card = resolveComponent("v-card");
  const _component_VDialog = resolveComponent("VDialog");
  const _component_VCardTitle = resolveComponent("VCardTitle");
  const _component_VInput = resolveComponent("VInput");
  const _component_VCheckbox = resolveComponent("VCheckbox");
  const _component_cropper = resolveComponent("cropper");
  const _component_VCardText = resolveComponent("VCardText");
  const _component_VCard = resolveComponent("VCard");

  return (openBlock(), createElementBlock(Fragment, null, [
    _cache[36] || (_cache[36] = createElementVNode("link", {
      rel: "stylesheet",
      type: "text/css",
      href: "https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css"
    }, null, -1 /* HOISTED */)),
    createElementVNode("input", {
      value: JSON.stringify($props.value),
      type: "hidden",
      id: "sfx_value"
    }, null, 8 /* PROPS */, _hoisted_1$4),
    createElementVNode("div", _hoisted_2$4, [
      createVNode(_component_draggable, {
        class: "asset-content",
        list: $props.value,
        onChange: $setup.log
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.value, (item, index) => {
            return (openBlock(), createElementBlock("div", {
              key: index,
              class: "media-container"
            }, [
              createCommentVNode(" Kiểm tra loại file và hiển thị phù hợp "),
              ($options.isImage(item.type))
                ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                    createElementVNode("div", _hoisted_3$4, [
                      createElementVNode("div", _hoisted_4$4, [
                        createElementVNode("div", _hoisted_5$3, [
                          createVNode(_component_VIcon, { name: "drag_handle" })
                        ]),
                        createElementVNode("div", _hoisted_6$3, [
                          createElementVNode("a", {
                            href: item.cdn,
                            target: "_blank"
                          }, [
                            createElementVNode("img", {
                              src: $options.createThumbnail(item.cdn),
                              alt: item.name,
                              class: "media-item"
                            }, null, 8 /* PROPS */, _hoisted_8$1),
                            createVNode(_component_VIcon, {
                              color: "white",
                              name: "visibility",
                              xsmall: true,
                              class: "media-item-icon"
                            })
                          ], 8 /* PROPS */, _hoisted_7$2)
                        ]),
                        createElementVNode("div", _hoisted_9$1, [
                          createElementVNode("span", null, toDisplayString($options.trimText(item.name)), 1 /* TEXT */)
                        ])
                      ]),
                      createElementVNode("div", _hoisted_10$1, [
                        ($setup.configVariantsExist)
                          ? (openBlock(), createElementBlock("div", {
                              key: 0,
                              style: {"color":"#285c72","margin-right":"20px"},
                              onClick: $event => ($options.showVariants(item.uuid))
                            }, [
                              createVNode(_component_VButton, {
                                style: {"margin-right":"10px","display":"flex","justify-content":"center","align-items":"center"},
                                xSmall: true,
                                warning: $setup.showVariantsList.indexOf(item.uuid) > -1,
                                outlined: true
                              }, {
                                default: withCtx(() => [
                                  ($setup.showVariantsList.indexOf(item.uuid) === -1)
                                    ? (openBlock(), createBlock(_component_VIcon, {
                                        key: 0,
                                        style: {"margin-right":"5px"},
                                        name: "visibility",
                                        xSmall: true
                                      }))
                                    : createCommentVNode("v-if", true),
                                  ($setup.showVariantsList.indexOf(item.uuid) > -1)
                                    ? (openBlock(), createBlock(_component_VIcon, {
                                        key: 1,
                                        style: {"margin-right":"5px"},
                                        name: "visibility_off",
                                        xSmall: true
                                      }))
                                    : createCommentVNode("v-if", true),
                                  ($setup.showVariantsList.indexOf(item.uuid) === -1)
                                    ? (openBlock(), createElementBlock("span", _hoisted_12$1, "Show variants"))
                                    : createCommentVNode("v-if", true),
                                  ($setup.showVariantsList.indexOf(item.uuid) > -1)
                                    ? (openBlock(), createElementBlock("span", _hoisted_13$1, "Hide variants"))
                                    : createCommentVNode("v-if", true)
                                ]),
                                _: 2 /* DYNAMIC */
                              }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["warning"])
                            ], 8 /* PROPS */, _hoisted_11$1))
                          : createCommentVNode("v-if", true),
                        createElementVNode("div", {
                          class: "btn-delete-item",
                          onClick: $event => ($setup.deleteItem(index))
                        }, [
                          createVNode(_component_VIcon, { name: "close" })
                        ], 8 /* PROPS */, _hoisted_14$1)
                      ])
                    ]),
                    ($setup.configVariantsExist && $setup.showVariantsList.indexOf(item.uuid) > -1)
                      ? (openBlock(), createElementBlock("div", _hoisted_15, [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(item.variants, (variant, index) => {
                            return (openBlock(), createElementBlock("div", {
                              class: "sfx-item",
                              style: {"margin-left":"30px","padding":"3px 10px","display":"flex","justify-content":"space-between","align-items":"center"},
                              onClick: $event => ($setup.showVariantsList.indexOf(item.uuid) > -1),
                              small: true,
                              key: index
                            }, [
                              createElementVNode("div", _hoisted_17, [
                                createElementVNode("img", {
                                  src: variant.img_url,
                                  alt: item.name,
                                  style: {"border-radius":"25%","border":"1px solid lightgray"},
                                  class: "media-item",
                                  width: "30",
                                  height: "30"
                                }, null, 8 /* PROPS */, _hoisted_18),
                                createElementVNode("span", _hoisted_19, toDisplayString(variant.name), 1 /* TEXT */)
                              ]),
                              createElementVNode("div", _hoisted_20, [
                                createVNode(_component_VButton, {
                                  style: {"margin-right":"10px"},
                                  xSmall: true,
                                  outlined: true,
                                  onClick: $event => ($setup.showVariantDialog(item, variant))
                                }, {
                                  default: withCtx(() => _cache[14] || (_cache[14] = [
                                    createTextVNode(" Edit ")
                                  ])),
                                  _: 2 /* DYNAMIC */
                                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["onClick"]),
                                createVNode(_component_VButton, {
                                  xSmall: true,
                                  secondary: true,
                                  onClick: $event => ($setup.showVariantDialog(item, variant))
                                }, {
                                  default: withCtx(() => _cache[15] || (_cache[15] = [
                                    createTextVNode(" Replace ")
                                  ])),
                                  _: 2 /* DYNAMIC */
                                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["onClick"])
                              ])
                            ], 8 /* PROPS */, _hoisted_16))
                          }), 128 /* KEYED_FRAGMENT */))
                        ]))
                      : createCommentVNode("v-if", true)
                  ], 64 /* STABLE_FRAGMENT */))
                : ($options.isVideo(item.type))
                  ? (openBlock(), createElementBlock("div", _hoisted_21, [
                      createElementVNode("div", _hoisted_22, [
                        createElementVNode("div", _hoisted_23, [
                          createVNode(_component_VIcon, { name: "drag_handle" })
                        ]),
                        createElementVNode("div", _hoisted_24, [
                          createElementVNode("a", {
                            href: item.cdn,
                            target: "_blank"
                          }, [
                            createVNode(_component_VIcon, {
                              class: "item-icon",
                              name: "videocam"
                            }),
                            createVNode(_component_VIcon, {
                              color: "white",
                              name: "visibility",
                              xsmall: true,
                              class: "media-item-icon"
                            })
                          ], 8 /* PROPS */, _hoisted_25)
                        ]),
                        createElementVNode("div", _hoisted_26, [
                          createElementVNode("span", null, toDisplayString($options.trimText(item.name)), 1 /* TEXT */)
                        ])
                      ]),
                      createElementVNode("div", {
                        class: "btn-delete-item",
                        onClick: $event => ($setup.deleteItem(index))
                      }, [
                        createVNode(_component_VIcon, { name: "close" })
                      ], 8 /* PROPS */, _hoisted_27)
                    ]))
                  : ($options.isAudio(item.type))
                    ? (openBlock(), createElementBlock("div", _hoisted_28, [
                        createElementVNode("div", _hoisted_29, [
                          createElementVNode("div", _hoisted_30, [
                            createVNode(_component_VIcon, { name: "drag_handle" })
                          ]),
                          createElementVNode("div", _hoisted_31, [
                            createElementVNode("a", {
                              href: item.cdn,
                              target: "_blank"
                            }, [
                              createVNode(_component_VIcon, {
                                class: "item-icon",
                                name: "play_circle"
                              }),
                              createVNode(_component_VIcon, {
                                color: "white",
                                name: "visibility",
                                xsmall: true,
                                class: "media-item-icon"
                              })
                            ], 8 /* PROPS */, _hoisted_32)
                          ]),
                          createElementVNode("div", _hoisted_33, [
                            createElementVNode("span", null, toDisplayString($options.trimText(item.name)), 1 /* TEXT */)
                          ])
                        ]),
                        createElementVNode("div", {
                          class: "btn-delete-item",
                          onClick: $event => ($setup.deleteItem(index))
                        }, [
                          createVNode(_component_VIcon, { name: "close" })
                        ], 8 /* PROPS */, _hoisted_34)
                      ]))
                    : (openBlock(), createElementBlock("div", _hoisted_35, [
                        createElementVNode("div", _hoisted_36, [
                          createElementVNode("div", _hoisted_37, [
                            createVNode(_component_VIcon, { name: "drag_handle" })
                          ]),
                          createElementVNode("div", _hoisted_38, [
                            createElementVNode("a", {
                              href: item.cdn,
                              target: "_blank"
                            }, [
                              createVNode(_component_VIcon, {
                                class: "item-icon",
                                name: "draft"
                              }),
                              createVNode(_component_VIcon, {
                                color: "white",
                                name: "visibility",
                                xsmall: true,
                                class: "media-item-icon"
                              })
                            ], 8 /* PROPS */, _hoisted_39)
                          ]),
                          createElementVNode("div", _hoisted_40, [
                            createElementVNode("span", null, toDisplayString($options.trimText(item.name)), 1 /* TEXT */)
                          ])
                        ]),
                        createElementVNode("div", {
                          class: "btn-delete-item",
                          onClick: $event => ($setup.deleteItem(index))
                        }, [
                          createVNode(_component_VIcon, { name: "close" })
                        ], 8 /* PROPS */, _hoisted_41)
                      ]))
            ]))
          }), 128 /* KEYED_FRAGMENT */))
        ]),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["list", "onChange"]),
      createElementVNode("div", _hoisted_42, [
        ($setup.getTotalAssets() > 0)
          ? (openBlock(), createElementBlock("div", _hoisted_43, [
              createElementVNode("span", null, "Total: " + toDisplayString($setup.getTotalAssets()), 1 /* TEXT */),
              ($setup.limitFiles() > 0)
                ? (openBlock(), createElementBlock("span", _hoisted_44, " / Limit " + toDisplayString($setup.limitFiles()), 1 /* TEXT */))
                : createCommentVNode("v-if", true)
            ]))
          : createCommentVNode("v-if", true)
      ]),
      ($setup.getIsOverLimit())
        ? (openBlock(), createElementBlock("div", _hoisted_45, _cache[16] || (_cache[16] = [
            createElementVNode("span", { class: "ml-1" }, "Exceeded maximum number of assets", -1 /* HOISTED */)
          ])))
        : createCommentVNode("v-if", true),
      createVNode(_component_VDialog, {
        modelValue: $setup.dialogVisible,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (($setup.dialogVisible) = $event))
      }, {
        default: withCtx(() => [
          createVNode(_component_v_card, { class: "dialog-content" }, {
            default: withCtx(() => [
              createVNode(_component_v_card_title, null, {
                default: withCtx(() => _cache[17] || (_cache[17] = [
                  createTextVNode("Scaleflex DAM")
                ])),
                _: 1 /* STABLE */
              }),
              createVNode(_component_v_card_text, null, {
                default: withCtx(() => _cache[18] || (_cache[18] = [
                  createTextVNode("Are you sure you want to delete everything? Please confirm to proceed.")
                ])),
                _: 1 /* STABLE */
              }),
              createVNode(_component_v_card_actions, null, {
                default: withCtx(() => [
                  createVNode(_component_VButton, {
                    onClick: $setup.removeAllAssets,
                    warning: true
                  }, {
                    default: withCtx(() => _cache[19] || (_cache[19] = [
                      createTextVNode(" Yes ")
                    ])),
                    _: 1 /* STABLE */
                  }, 8 /* PROPS */, ["onClick"]),
                  createVNode(_component_VButton, {
                    onClick: $setup.closeDialog,
                    secondary: true
                  }, {
                    default: withCtx(() => _cache[20] || (_cache[20] = [
                      createTextVNode(" No ")
                    ])),
                    _: 1 /* STABLE */
                  }, 8 /* PROPS */, ["onClick"])
                ]),
                _: 1 /* STABLE */
              })
            ]),
            _: 1 /* STABLE */
          })
        ]),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["modelValue"]),
      createVNode(_component_VDialog, {
        modelValue: $setup.isShowVariantDialog,
        "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => (($setup.isShowVariantDialog) = $event))
      }, {
        default: withCtx(() => [
          createVNode(_component_VCard, {
            style: {"width":"70%"},
            class: "dialog-content"
          }, {
            default: withCtx(() => [
              createVNode(_component_VCardTitle, null, {
                default: withCtx(() => _cache[21] || (_cache[21] = [
                  createTextVNode(" Edit Image Variants ")
                ])),
                _: 1 /* STABLE */
              }),
              createVNode(_component_VCardText, null, {
                default: withCtx(() => [
                  createElementVNode("div", _hoisted_46, [
                    createElementVNode("div", _hoisted_47, [
                      createElementVNode("div", {
                        onClick: _cache[1] || (_cache[1] = $event => ($setup.changeToolbar('size'))),
                        class: normalizeClass([{ toolbar_item_active: $setup.currentToolbar === 'size'}, "toolbar-item"])
                      }, [
                        createVNode(_component_VIcon, {
                          small: true,
                          name: "width_wide"
                        })
                      ], 2 /* CLASS */),
                      createElementVNode("div", {
                        onClick: _cache[2] || (_cache[2] = $event => ($setup.changeToolbar('enlargement'))),
                        class: normalizeClass([{ toolbar_item_active: $setup.currentToolbar === 'enlargement'}, "toolbar-item"])
                      }, [
                        createVNode(_component_VIcon, {
                          small: true,
                          name: "photo_library"
                        })
                      ], 2 /* CLASS */),
                      createElementVNode("div", {
                        onClick: _cache[3] || (_cache[3] = $event => ($setup.changeToolbar('crop'))),
                        class: normalizeClass([{ toolbar_item_active: $setup.currentToolbar === 'crop'}, "toolbar-item"])
                      }, [
                        createVNode(_component_VIcon, {
                          small: true,
                          name: "crop"
                        })
                      ], 2 /* CLASS */),
                      createElementVNode("div", {
                        onClick: _cache[4] || (_cache[4] = $event => ($setup.changeToolbar('addition'))),
                        class: normalizeClass([{ toolbar_item_active: $setup.currentToolbar === 'addition'}, "toolbar-item"])
                      }, [
                        createVNode(_component_VIcon, {
                          small: true,
                          name: "flip"
                        })
                      ], 2 /* CLASS */)
                    ]),
                    createElementVNode("div", _hoisted_48, [
                      ($setup.currentToolbar === 'size')
                        ? (openBlock(), createElementBlock("div", _hoisted_49, [
                            _cache[24] || (_cache[24] = createElementVNode("div", { style: {"margin-bottom":"15px"} }, [
                              createElementVNode("span", { style: {"font-size":"16px"} }, "Size"),
                              createElementVNode("p", { style: {"font-size":"12px","text-align":"justify","hyphens":"auto"} }, "Change width and height of the image")
                            ], -1 /* HOISTED */)),
                            createElementVNode("div", null, [
                              _cache[22] || (_cache[22] = createElementVNode("span", null, "Width", -1 /* HOISTED */)),
                              createVNode(_component_VInput, {
                                small: true,
                                modelValue: $setup.currentVariantConfigs['width'],
                                "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => (($setup.currentVariantConfigs['width']) = $event))
                              }, null, 8 /* PROPS */, ["modelValue"])
                            ]),
                            createElementVNode("div", _hoisted_50, [
                              _cache[23] || (_cache[23] = createElementVNode("span", null, "Height", -1 /* HOISTED */)),
                              createVNode(_component_VInput, {
                                small: true,
                                modelValue: $setup.currentVariantConfigs['height'],
                                "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => (($setup.currentVariantConfigs['height']) = $event))
                              }, null, 8 /* PROPS */, ["modelValue"])
                            ])
                          ]))
                        : createCommentVNode("v-if", true),
                      ($setup.currentToolbar === 'enlargement')
                        ? (openBlock(), createElementBlock("div", _hoisted_51, [
                            _cache[26] || (_cache[26] = createElementVNode("div", { style: {"margin-bottom":"15px"} }, [
                              createElementVNode("span", { style: {"font-size":"16px"} }, "Enlargement"),
                              createElementVNode("p", { style: {"font-size":"12px","text-align":"justify","hyphens":"auto"} }, "When resizing with width or height operation, Scaleflex Dam either reduces or increases the dimensions of the image to keep proportions.")
                            ], -1 /* HOISTED */)),
                            createElementVNode("div", _hoisted_52, [
                              createVNode(_component_VCheckbox, {
                                small: true,
                                modelValue: $setup.currentVariantConfigs['org_if_sml'],
                                "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => (($setup.currentVariantConfigs['org_if_sml']) = $event))
                              }, null, 8 /* PROPS */, ["modelValue"]),
                              _cache[25] || (_cache[25] = createElementVNode("span", null, "No enlargement", -1 /* HOISTED */))
                            ])
                          ]))
                        : createCommentVNode("v-if", true),
                      ($setup.currentToolbar === 'crop')
                        ? (openBlock(), createElementBlock("div", _hoisted_53, _cache[27] || (_cache[27] = [
                            createElementVNode("div", { style: {"margin-bottom":"15px"} }, [
                              createElementVNode("span", { style: {"font-size":"16px"} }, "Crop image"),
                              createElementVNode("p", { style: {"font-size":"12px","text-align":"justify","hyphens":"auto"} }, "Resize and crop to achieve the desired width and heigh")
                            ], -1 /* HOISTED */),
                            createElementVNode("div", { style: {"display":"flex","justify-content":"start"} }, null, -1 /* HOISTED */)
                          ])))
                        : createCommentVNode("v-if", true),
                      ($setup.currentToolbar === 'addition')
                        ? (openBlock(), createElementBlock("div", _hoisted_54, " Addition "))
                        : createCommentVNode("v-if", true)
                    ]),
                    createElementVNode("div", _hoisted_55, [
                      createElementVNode("div", _hoisted_56, [
                        createVNode(_component_VButton, {
                          onClick: $options.toggleCrop,
                          icon: true,
                          xSmall: true,
                          secondary: true
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_VIcon, {
                              name: "crop",
                              xSmall: true
                            })
                          ]),
                          _: 1 /* STABLE */
                        }, 8 /* PROPS */, ["onClick"]),
                        ($setup.showCrop)
                          ? (openBlock(), createBlock(_component_VButton, {
                              key: 0,
                              onClick: $options.updateVariantByCrop,
                              xSmall: true,
                              style: {"margin-left":"8px"}
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_VIcon, {
                                  name: "save",
                                  xSmall: true
                                }),
                                _cache[28] || (_cache[28] = createElementVNode("span", null, "Update", -1 /* HOISTED */))
                              ]),
                              _: 1 /* STABLE */
                            }, 8 /* PROPS */, ["onClick"]))
                          : createCommentVNode("v-if", true)
                      ]),
                      (!$setup.showCrop)
                        ? (openBlock(), createElementBlock("img", {
                            key: 0,
                            style: {"height":"80%","width":"auto"},
                            src: $setup.currentVariantShow
                          }, null, 8 /* PROPS */, _hoisted_57))
                        : createCommentVNode("v-if", true),
                      ($setup.showCrop)
                        ? (openBlock(), createElementBlock("div", _hoisted_58, [
                            createVNode(_component_cropper, {
                              onChange: $options.updateVariantConfigByCrop,
                              class: "cropper",
                              ref: "cropper",
                              src: $setup.currentVariantOrigin
                            }, null, 8 /* PROPS */, ["onChange", "src"])
                          ]))
                        : createCommentVNode("v-if", true)
                    ])
                  ])
                ]),
                _: 1 /* STABLE */
              })
            ]),
            _: 1 /* STABLE */
          })
        ]),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["modelValue"])
    ]),
    ($setup.isTokenAndSecExists)
      ? (openBlock(), createElementBlock("div", _hoisted_59, [
          createVNode(_component_VButton, {
            onClick: $setup.openModal,
            disabled: $setup.addAssetsDisabled()
          }, {
            default: withCtx(() => [
              createVNode(_component_VIcon, { name: "image" }),
              _cache[29] || (_cache[29] = createElementVNode("span", { style: {"margin-left":"5px"} }, "Browse assets", -1 /* HOISTED */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ["onClick", "disabled"]),
          createElementVNode("div", null, [
            ($setup.getTotalAssets() > 0)
              ? (openBlock(), createBlock(_component_VButton, {
                  key: 0,
                  type: "button",
                  onClick: _cache[9] || (_cache[9] = $event => ($setup.refreshAssets())),
                  loading: $setup.getIsLoading(),
                  outlined: true
                }, {
                  default: withCtx(() => [
                    createVNode(_component_VIcon, { name: "refresh" }),
                    _cache[30] || (_cache[30] = createElementVNode("span", { style: {"margin-left":"5px"} }, "Refresh", -1 /* HOISTED */))
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["loading"]))
              : createCommentVNode("v-if", true),
            ($setup.getTotalAssets() > 0)
              ? (openBlock(), createBlock(_component_VButton, {
                  key: 1,
                  style: {"margin-left":"5px"},
                  type: "button",
                  onClick: _cache[10] || (_cache[10] = $event => ($setup.clickRemoveAllAssets())),
                  danger: true
                }, {
                  default: withCtx(() => [
                    createVNode(_component_VIcon, { name: "delete" }),
                    _cache[31] || (_cache[31] = createElementVNode("span", { style: {"margin-left":"5px"} }, "Remove all", -1 /* HOISTED */))
                  ]),
                  _: 1 /* STABLE */
                }))
              : createCommentVNode("v-if", true)
          ])
        ]))
      : (openBlock(), createElementBlock("div", _hoisted_60, [
          createVNode(_component_VCard, { style: {"max-width":"100%","margin-top":"20px"} }, {
            default: withCtx(() => [
              createVNode(_component_VCardTitle, { style: {"color":"tomato","display":"flex","align-items":"center"} }, {
                default: withCtx(() => [
                  createVNode(_component_VIcon, { name: "report" }),
                  _cache[32] || (_cache[32] = createElementVNode("span", { style: {"font-size":"14px","margin-left":"5px"} }, "Scaleflex DAM Notice", -1 /* HOISTED */))
                ]),
                _: 1 /* STABLE */
              }),
              createVNode(_component_VCardText, { style: {"max-width":"100%","padding-bottom":"25px"} }, {
                default: withCtx(() => [
                  _cache[33] || (_cache[33] = createTextVNode(" Please visit the ")),
                  createElementVNode("span", {
                    style: {"text-decoration":"underline","color":"dodgerblue","cursor":"pointer"},
                    onClick: _cache[11] || (_cache[11] = (...args) => ($setup.toDamSetting && $setup.toDamSetting(...args))),
                    target: "_blank"
                  }, "Scaleflex DAM Configuration"),
                  _cache[34] || (_cache[34] = createTextVNode(" to add your Token and Template ID before browsing assets. "))
                ]),
                _: 1 /* STABLE */
              })
            ]),
            _: 1 /* STABLE */
          })
        ])),
    createElementVNode("div", {
      style: normalizeStyle({ display: _ctx.isOpen ? 'block' : 'none' }),
      class: "modal-overlay",
      id: "sfx-modal"
    }, [
      createElementVNode("div", _hoisted_61, [
        createElementVNode("div", _hoisted_62, [
          createElementVNode("h3", null, toDisplayString($props.title), 1 /* TEXT */),
          createElementVNode("button", {
            onClick: _cache[12] || (_cache[12] = (...args) => ($setup.closeModal && $setup.closeModal(...args))),
            class: "modal-close-btn"
          }, "×")
        ]),
        createElementVNode("div", _hoisted_63, [
          renderSlot(_ctx.$slots, "default", {}, () => [
            _cache[35] || (_cache[35] = createElementVNode("div", { id: "sfx-dam-widget" }, null, -1 /* HOISTED */))
          ])
        ]),
        createElementVNode("div", _hoisted_64, [
          createElementVNode("button", {
            onClick: _cache[13] || (_cache[13] = (...args) => ($setup.closeModal && $setup.closeModal(...args))),
            class: "btn"
          }, "Close")
        ])
      ])
    ], 4 /* STYLE */)
  ], 64 /* STABLE_FRAGMENT */))
}
var InterfaceComponent$1 = /*#__PURE__*/_export_sfc(_sfc_main$4, [['render',_sfc_render$4],['__file',"interface.vue"]]);

var e0 = {
    id: 'scaleflex-dam',
    name: 'Scaleflex DAM',
    icon: 'image',
    description: '',
    component: InterfaceComponent$1,
    options: [
		{
			field: 'custom',
			type: 'boolean',
			name: 'Use custom setting',
			recommendedDisplays: ["scaleflex-dam-display"],
			schema: {
				default_value: false,
			},
			meta: {
				interface: 'toggle',
				width: 'half',
			},
		},
		{
			field: 'limit',
			type: 'integer',
			name: 'Limit',
			schema: {
				default_value: 0,
			},
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					min: 0
				}
			},
		},
		{
			field: 'limitTypes',
			type: 'string',
			name: 'Limit Types',
			meta: {
				interface: 'select-multiple-dropdown',
				options: {
					choices: [
						{
							text: 'Image',
							value: 'image',
						},
						{
							text: 'Document',
							value: 'document',
						},
						{
							text: 'Video',
							value: 'video',
						},
						{
							text: 'Audio',
							value: 'audio',
						},
					],
				},
				width: 'half',
			},
		},
		{
			field: 'attributes',
			type: 'string',
			name: 'Attributes',
			meta: {
				interface: 'select-multiple-dropdown',
				options: {
					choices: [
						{
							text: 'Meta',
							value: 'meta',
						},
						{
							text: 'Tags',
							value: 'tags',
						},
						{
							text: 'Info',
							value: 'info',
						},
					],
				},
				width: 'half',
			},
		},
		{
			field: 'config',
			type: 'json',
			name: 'Configuration',
			meta: {
				interface: 'input-code',
				width: 'full',
			}
		}
	],
    types: ['json'],
};

var css$3 = "\n.sfx-padding-box {\n  padding: 0 32px 32px;\n}\n.guide-text {\n  font-size: 13px;\n  margin-top: 5px;\n  color: #285c72;\n}\n.homepage{\n  margin-top: 10px;\n  display: flex;\n  transition: color 500ms ease;\n  cursor: pointer;\n}\n.homepage:hover{\n  color: #285c72;\n}\n.external-link{\n  display: flex;\n  padding: 5px 8px;\n  border-radius: 4px;\n  transition: background 500ms ease;\n  align-items: center;\n  cursor: pointer;\n}\n.external-link:hover{\n  background: var(--theme--navigation--project--background);\n}\n";
n(css$3,{});

const _sfc_main$3 = {
  props: {
    collection: {type: String, default: 'scaleflex_dam_settings'},
    id: {type: Number, default: 1},
  },
  setup(props) {
    const {useCollectionsStore} = useStores();
    const api = useApi();
    const collectionsStore = useCollectionsStore();

    const token = ref('');
    const sec = ref('');
    const directory = ref('');
    const limit = ref('');
    const attributes = ref([]);
    const limitType = ref([]);
    const isValid = ref(true);
    const loading = ref(false);
    const collectionExists = ref(false);
    const dialogVisible = ref(false);
    const dialogType = ref("info");
    const dialogTitle = ref(null);
    const dialogText = ref(null);
    const dialogReset = ref(false);


    async function ensureCollectionExists() {
      loading.value = true;
      const collectionName = props.collection;

      try {
        // Kiểm tra xem collection đã tồn tại chưa
        const scaleflexCollection = await collectionsStore.getCollection(collectionName);

        if (!scaleflexCollection) {
          // Tạo collection mới nếu chưa tồn tại
          await collectionsStore.upsertCollection(collectionName, {
            collection: collectionName,
            meta: {note: 'Scaleflex DAM'},
            schema: {
              fields: [
                {
                  field: 'id',
                  type: 'uuid',
                  meta: {
                    primary_key: true,
                  },
                }
              ],
            },
          });


          // Sau khi tạo collection xong, hidden collection
          await hiddenCollection();

          // Sau khi tạo collection xong, tạo các fields
          await createFields();

          collectionExists.value = false; // Đánh dấu rằng collection vừa được tạo
        } else {
          collectionExists.value = true;
        }
      } catch (error) {
        // Nothing to handle
      } finally {
        loading.value = false;
      }
    }

    async function hiddenCollection() {
      try {
        let meta = {
          "meta": {
            "hidden": true
          }
        };
        await api.patch(`/collections/${props.collection}`, meta);
      } catch (error) {
        console.error(`Failed to hidden collection: ${error.message}`);
      }
    }

    async function createFields() {
      const fieldsPayload = [
        {
          type: 'string',
          meta: {interface: 'input', special: null},
          field: 'token',
        },
        {
          type: 'string',
          meta: {interface: 'input', special: null},
          field: 'sec',
        },
        {
          type: 'string',
          meta: {interface: 'input', special: null},
          field: 'directory',
        },
        {
          type: 'integer',
          meta: {interface: 'input', special: null},
          field: 'limit',
        },
        {
          type: 'string',
          meta: {interface: 'input', special: null},
          field: 'attributes',
        },
        {
          type: 'string',
          meta: {interface: 'input', special: null},
          field: 'limitType',
        },
      ];

      try {
        // Tạo từng field
        for (const field of fieldsPayload) {
          await api.post(`/fields/${props.collection}`, field);
          console.log(`Field ${field.field} created.`);
        }

        // Sau khi tạo fields xong, tạo dữ liệu mới
        await createFirstData();

      } catch (error) {
        console.error(`Failed to create fields: ${error.message}`);
      }
    }

    async function createFirstData() {
      const payload = {token: '', sec: '', directory: '/', limit: null, limitType: '', attributes: ''};
      try {
        await api.post(`/items/${props.collection}`, payload);
      } catch (error) {
        console.error(`Failed to create data: ${error.message}`);
      }
    }

    function isNull(value) {
      return value === '' || value === null
    }

    async function loadData() {
      try {
        if (collectionExists) {
          const response = await api.get(`/items/${props.collection}/${props.id}`);
          const data = response.data.data;
          token.value = data.token || '';
          sec.value = data.sec || '';
          directory.value = data.directory || '';
          limit.value = data.limit || 0;
          attributes.value = isNull(data.attributes) ? [] : data.attributes.split(",");
          limitType.value = isNull(data.limitType) ? [] : data.limitType.split(",");
        }
      } catch (error) {
        console.error(`Error loading data: ${error.message}`);
      }
    }

    async function resetAllSettings() {
      loading.value = true;
      try {
        const payload = {
          token: '',
          sec: '',
          directory: '/',
          limit: null,
          attributes: null,
          limitType: null
        };
        await api.patch(`/items/${props.collection}/${props.id}`, payload);
        dialogType.value = 'success';
        dialogTitle.value = 'Settings Reset Successfully';
        dialogText.value = 'All settings have been reset to their defaults. ' +
            'To continue using Scaleflex DAM with your model, please reconfigure your settings and verify them for seamless functionality.';
      } catch (error) {
        dialogType.value = 'danger';
        dialogTitle.value = 'System Error';
        dialogText.value = 'Failed to save settings. Please refresh the Page and try again.';
      } finally {
        loading.value = false;
        dialogReset.value = false;
        token.value = '';
        sec.value = '';
        directory.value = '';
        limit.value = '';
        attributes.value = [];
        limitType.value = [];
      }
    }


    async function confirmResetAllSettings() {
      dialogType.value = 'danger';
      dialogTitle.value = 'Reset All Settings';
      dialogText.value = 'Are you sure you want to reset all settings to their default values? This action cannot be undone and may affect your current configuration.';
      dialogVisible.value = true;
      dialogReset.value = true;
    }

    async function saveSfxToken() {
      loading.value = true;
      isValid.value = await checkToken();
      dialogVisible.value = true;
      if (!isValid.value) {
        dialogType.value = 'warning';
        dialogTitle.value = 'Invalid Settings';
        dialogText.value = 'Please verify your token and security template. The current configuration is incorrect and requires adjustment.';
      } else {
        try {
          let limitTypeString = limitType.value ? limitType.value.toString() : null;
          let attributesString = attributes.value ? attributes.value.toString() : null;

          const payload = {
            token: token.value,
            sec: sec.value,
            directory: directory.value,
            limit: limit.value,
            attributes: attributesString,
            limitType: limitTypeString
          };
          await api.patch(`/items/${props.collection}/${props.id}`, payload);
          dialogType.value = 'success';
          dialogTitle.value = 'Successfully Saved';
          dialogText.value = 'Your updates have been saved and are now active. You can now add the Scaleflex DAM Field to your schema and begin using it immediately.';
        } catch (error) {
          dialogType.value = 'danger';
          dialogTitle.value = 'System Error';
          dialogText.value = 'Failed to save settings. Please refresh the Page and try again.';
        } finally {
          loading.value = false;
        }
      }
      loading.value = false;
    }

    async function checkToken() {
      const url = `https://api.filerobot.com/${token.value}/v4/key/${sec.value}`;
      try {
        const response = await fetch(url);
        return response.status === 200;
      } catch (err) {
        return false
      }
    }

    function closeDialog () {
      dialogVisible.value = false;
    }

    function toDam() {
      const damButton = document.querySelector('a[href="/admin/scaleflex-dam"]');
      if (damButton) {
        damButton.click();
      }
    }

    ensureCollectionExists().then(loadData);
    return {
      token,
      sec,
      directory,
      saveSfxToken,
      loading,
      limit,
      attributes,
      limitType,
      isValid,
      dialogVisible,
      closeDialog,
      dialogText,
      dialogTitle,
      dialogType,
      confirmResetAllSettings,
      dialogReset,
      resetAllSettings,
      toDam
    };
  },
};

const _hoisted_1$3 = { style: {"margin-top":"20px","padding":"0 10px"} };
const _hoisted_2$3 = { style: {"display":"flex","flex-direction":"column","align-content":"center"} };
const _hoisted_3$3 = { style: {"display":"flex","background":"var(--theme--navigation--project--background)","padding":"5px 8px","border-radius":"4px","align-items":"center"} };
const _hoisted_4$3 = {
  href: "https://docs.scaleflex.com/digital-asset-management-dam/plugins-and-connectors/plugins/directus",
  target: "_blank",
  class: "external-link",
  style: {"margin-top":"8px"}
};
const _hoisted_5$2 = {
  href: "https://www.scaleflex.com",
  target: "_blank",
  class: "homepage"
};
const _hoisted_6$2 = { class: "sfx-padding-box" };
const _hoisted_7$1 = { style: {"margin-bottom":"1rem"} };
const _hoisted_8 = { style: {"margin-bottom":"1rem"} };
const _hoisted_9 = { style: {"margin-bottom":"1rem"} };
const _hoisted_10 = { style: {"margin-bottom":"1rem"} };
const _hoisted_11 = { style: {"margin-bottom":"1rem"} };
const _hoisted_12 = { style: {"margin-bottom":"1rem"} };
const _hoisted_13 = { style: {"display":"flex","justify-content":"start","align-items":"center"} };
const _hoisted_14 = { style: {"margin-left":"5px"} };

function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VIcon = resolveComponent("VIcon");
  const _component_VCardTitle = resolveComponent("VCardTitle");
  const _component_VCardText = resolveComponent("VCardText");
  const _component_VCard = resolveComponent("VCard");
  const _component_VInput = resolveComponent("VInput");
  const _component_VDivider = resolveComponent("VDivider");
  const _component_VSelect = resolveComponent("VSelect");
  const _component_VButton = resolveComponent("VButton");
  const _component_v_card_title = resolveComponent("v-card-title");
  const _component_v_card_text = resolveComponent("v-card-text");
  const _component_v_card_actions = resolveComponent("v-card-actions");
  const _component_v_card = resolveComponent("v-card");
  const _component_VDialog = resolveComponent("VDialog");
  const _component_private_view = resolveComponent("private-view");

  return (openBlock(), createBlock(_component_private_view, { title: "Scaleflex DAM" }, {
    navigation: withCtx(() => [
      createElementVNode("div", _hoisted_1$3, [
        createElementVNode("div", _hoisted_2$3, [
          createElementVNode("div", _hoisted_3$3, [
            createVNode(_component_VIcon, {
              name: "settings",
              style: {"color":"var(--theme--primary)"}
            }),
            _cache[8] || (_cache[8] = createElementVNode("span", { style: {"margin-left":"4px","font-size":"14px","display":"block"} }, "Scaleflex DAM", -1 /* HOISTED */))
          ]),
          createElementVNode("div", {
            onClick: _cache[0] || (_cache[0] = (...args) => ($setup.toDam && $setup.toDam(...args))),
            class: "external-link",
            style: {"margin-top":"8px"}
          }, [
            createVNode(_component_VIcon, {
              name: "gallery_thumbnail",
              style: {"color":"var(--theme--primary)"}
            }),
            _cache[9] || (_cache[9] = createElementVNode("span", { style: {"margin-left":"4px","font-size":"14px","display":"block"} }, "Assets Library", -1 /* HOISTED */))
          ]),
          createElementVNode("a", _hoisted_4$3, [
            createVNode(_component_VIcon, {
              name: "description",
              style: {"color":"var(--theme--primary)"}
            }),
            _cache[10] || (_cache[10] = createElementVNode("span", { style: {"margin-left":"4px","font-size":"14px","display":"block"} }, "Documentation", -1 /* HOISTED */))
          ])
        ])
      ])
    ]),
    default: withCtx(() => [
      createVNode(_component_VCard, { style: {"margin":"0 32px 32px 32px","max-width":"100%"} }, {
        default: withCtx(() => [
          createVNode(_component_VCardTitle, { style: {"padding":"15px"} }, {
            default: withCtx(() => _cache[11] || (_cache[11] = [
              createTextVNode(" About Scaleflex DAM ")
            ])),
            _: 1 /* STABLE */
          }),
          createVNode(_component_VCardText, { style: {"padding":"15px","width":"100%","position":"relative"} }, {
            default: withCtx(() => [
              _cache[13] || (_cache[13] = createElementVNode("div", { style: {"display":"flex","align-items":"center","justify-content":"start","margin-bottom":"20px"} }, [
                createElementVNode("img", { src: "https://frzjaqrbb.filerobot.com/plugins_assets/scaleflex.svg" })
              ], -1 /* HOISTED */)),
              _cache[14] || (_cache[14] = createElementVNode("div", { style: {"z-index":"999"} }, " Scaleflex DAM(Filerobot) is a scalable and performance-oriented Digital Asset Management platform with integrated image and video optimizers to store, organize, optimize and deliver your media assets such as images, videos, PDFs and many other brand assets fast all around the world to all device types. ", -1 /* HOISTED */)),
              createElementVNode("a", _hoisted_5$2, [
                createVNode(_component_VIcon, {
                  name: "house",
                  small: true,
                  style: {"margin-top":"2px"}
                }),
                _cache[12] || (_cache[12] = createElementVNode("span", { style: {"margin-left":"4px","font-size":"14px","display":"block"} }, "Scaleflex Home", -1 /* HOISTED */))
              ]),
              _cache[15] || (_cache[15] = createElementVNode("img", {
                src: "https://frzjaqrbb.filerobot.com/plugins_assets/dam.svg",
                style: {"position":"absolute","right":"10px","top":"-40px","width":"180px","z-index":"1","opacity":"0.4"}
              }, null, -1 /* HOISTED */))
            ]),
            _: 1 /* STABLE */
          })
        ]),
        _: 1 /* STABLE */
      }),
      createElementVNode("div", _hoisted_6$2, [
        _cache[31] || (_cache[31] = createElementVNode("div", { style: {"font-size":"18px","margin-bottom":"20px"} }, [
          createElementVNode("h2", null, "Base configurations"),
          createElementVNode("p", { class: "guide-text" }, "The following fields are required to integrate the Scaleflex DAM Widget within Directus.")
        ], -1 /* HOISTED */)),
        createElementVNode("div", _hoisted_7$1, [
          _cache[16] || (_cache[16] = createElementVNode("label", { for: "sfx_token" }, [
            createElementVNode("b", null, "Token")
          ], -1 /* HOISTED */)),
          createVNode(_component_VInput, {
            disabled: $setup.loading,
            modelValue: $setup.token,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (($setup.token) = $event))
          }, null, 8 /* PROPS */, ["disabled", "modelValue"]),
          _cache[17] || (_cache[17] = createElementVNode("p", { class: "guide-text" }, [
            createTextVNode("Scaleflex DAM token from your account, you can obtain a token by fill in "),
            createElementVNode("a", {
              style: {"color":"var(--theme--primary)"},
              href: "https://www.scaleflex.com/contact-us",
              target: "_blank"
            }, "Scaleflex contact page")
          ], -1 /* HOISTED */))
        ]),
        createElementVNode("div", _hoisted_8, [
          _cache[18] || (_cache[18] = createElementVNode("label", { for: "sfx_sec" }, [
            createElementVNode("b", null, "Security Template")
          ], -1 /* HOISTED */)),
          createVNode(_component_VInput, {
            disabled: $setup.loading,
            modelValue: $setup.sec,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => (($setup.sec) = $event))
          }, null, 8 /* PROPS */, ["disabled", "modelValue"]),
          _cache[19] || (_cache[19] = createElementVNode("p", { class: "guide-text" }, "To load the Scaleflex DAM Widget or Scaleflex DAM Image Editor, you you need to create a Security Template in your Asset Hub first, in order for your Directus instantiation of the Widget to obtain proper credentials and access your storage", -1 /* HOISTED */))
        ]),
        createElementVNode("div", _hoisted_9, [
          _cache[20] || (_cache[20] = createElementVNode("label", { for: "sfx_token" }, [
            createElementVNode("b", null, "Root Directory")
          ], -1 /* HOISTED */)),
          createVNode(_component_VInput, {
            disabled: $setup.loading,
            modelValue: $setup.directory,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => (($setup.directory) = $event))
          }, null, 8 /* PROPS */, ["disabled", "modelValue"]),
          _cache[21] || (_cache[21] = createElementVNode("p", { class: "guide-text" }, "The directory in your Hub, where the files will be stored", -1 /* HOISTED */))
        ]),
        createVNode(_component_VDivider, { style: {"margin":"20px 0"} }),
        _cache[32] || (_cache[32] = createElementVNode("div", { style: {"font-size":"18px","margin-bottom":"20px"} }, [
          createElementVNode("h2", null, "Advanced configuration"),
          createElementVNode("p", { class: "guide-text" }, "This configuration will be overridden if 'Use Custom Setting' is activated in each Field Interface.")
        ], -1 /* HOISTED */)),
        createElementVNode("div", _hoisted_10, [
          _cache[22] || (_cache[22] = createElementVNode("label", { for: "limit" }, [
            createElementVNode("b", null, "Limit")
          ], -1 /* HOISTED */)),
          createVNode(_component_VInput, {
            disabled: $setup.loading,
            min: "0",
            modelValue: $setup.limit,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => (($setup.limit) = $event)),
            type: "number"
          }, null, 8 /* PROPS */, ["disabled", "modelValue"]),
          _cache[23] || (_cache[23] = createElementVNode("p", { class: "guide-text" }, [
            createTextVNode("The max number of files that can be added to a single field, "),
            createElementVNode("b", { style: {"color":"var(--theme--primary)"} }, "default: 0(unlimited)")
          ], -1 /* HOISTED */))
        ]),
        createElementVNode("div", _hoisted_11, [
          _cache[24] || (_cache[24] = createElementVNode("label", { for: "attributes" }, [
            createElementVNode("b", null, "Attributes")
          ], -1 /* HOISTED */)),
          createVNode(_component_VSelect, {
            modelValue: $setup.attributes,
            "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => (($setup.attributes) = $event)),
            disabled: $setup.loading,
            items: [
            {
              text: 'Meta',
              value: 'meta',
            },
            {
              text: 'Tags',
              value: 'tags',
            },
            {
              text: 'Info',
              value: 'info',
            },
          ],
            multiplePreviewThreshold: 4,
            multiple: true
          }, null, 8 /* PROPS */, ["modelValue", "disabled"]),
          _cache[25] || (_cache[25] = createElementVNode("p", { class: "guide-text" }, "Attribute from Scaleflex DAM asset that you want to include in Client response", -1 /* HOISTED */))
        ]),
        createElementVNode("div", _hoisted_12, [
          _cache[26] || (_cache[26] = createElementVNode("label", { for: "limitType" }, [
            createElementVNode("b", null, "Limit Type")
          ], -1 /* HOISTED */)),
          createVNode(_component_VSelect, {
            modelValue: $setup.limitType,
            "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => (($setup.limitType) = $event)),
            disabled: $setup.loading,
            multiplePreviewThreshold: 5,
            items: [
            {
              text: 'Image',
              value: 'image',
            },
            {
              text: 'Document',
              value: 'document',
            },
            {
              text: 'Video',
              value: 'video',
            },
            {
              text: 'Audio',
              value: 'audio',
            },
          ],
            multiple: true
          }, null, 8 /* PROPS */, ["modelValue", "disabled"]),
          _cache[27] || (_cache[27] = createElementVNode("p", { class: "guide-text" }, "File types limit when use Widget", -1 /* HOISTED */))
        ]),
        createElementVNode("div", null, [
          (!$setup.loading)
            ? (openBlock(), createBlock(_component_VButton, {
                key: 0,
                onClick: $setup.saveSfxToken
              }, {
                default: withCtx(() => [
                  createVNode(_component_VIcon, { name: "save" }),
                  _cache[28] || (_cache[28] = createElementVNode("span", { style: {"margin-left":"5px"} }, "Save Settings", -1 /* HOISTED */))
                ]),
                _: 1 /* STABLE */
              }, 8 /* PROPS */, ["onClick"]))
            : createCommentVNode("v-if", true),
          (!$setup.loading && $setup.token !== '' && $setup.sec !== '')
            ? (openBlock(), createBlock(_component_VButton, {
                key: 1,
                style: {"margin-left":"15px"},
                onClick: $setup.confirmResetAllSettings,
                outlined: true,
                danger: true
              }, {
                default: withCtx(() => [
                  createVNode(_component_VIcon, { name: "restart_alt" }),
                  _cache[29] || (_cache[29] = createElementVNode("span", { style: {"margin-left":"5px"} }, "Reset all settings", -1 /* HOISTED */))
                ]),
                _: 1 /* STABLE */
              }, 8 /* PROPS */, ["onClick"]))
            : createCommentVNode("v-if", true),
          ($setup.loading)
            ? (openBlock(), createBlock(_component_VButton, {
                key: 2,
                disabled: $setup.loading
              }, {
                default: withCtx(() => _cache[30] || (_cache[30] = [
                  createElementVNode("span", null, "Processing...", -1 /* HOISTED */)
                ])),
                _: 1 /* STABLE */
              }, 8 /* PROPS */, ["disabled"]))
            : createCommentVNode("v-if", true)
        ])
      ]),
      createVNode(_component_VDialog, {
        modelValue: $setup.dialogVisible,
        "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => (($setup.dialogVisible) = $event))
      }, {
        default: withCtx(() => [
          createVNode(_component_v_card, { class: "dialog-content" }, {
            default: withCtx(() => [
              createVNode(_component_v_card_title, null, {
                default: withCtx(() => [
                  createElementVNode("div", _hoisted_13, [
                    ($setup.dialogType === 'info')
                      ? (openBlock(), createBlock(_component_VIcon, {
                          key: 0,
                          color: "gray",
                          name: "info"
                        }))
                      : createCommentVNode("v-if", true),
                    ($setup.dialogType === 'warning')
                      ? (openBlock(), createBlock(_component_VIcon, {
                          key: 1,
                          color: "tomato",
                          name: "warning"
                        }))
                      : createCommentVNode("v-if", true),
                    ($setup.dialogType === 'success')
                      ? (openBlock(), createBlock(_component_VIcon, {
                          key: 2,
                          color: "green",
                          name: "check_circle"
                        }))
                      : createCommentVNode("v-if", true),
                    ($setup.dialogType === 'danger')
                      ? (openBlock(), createBlock(_component_VIcon, {
                          key: 3,
                          color: "red",
                          name: "error"
                        }))
                      : createCommentVNode("v-if", true),
                    createElementVNode("span", _hoisted_14, toDisplayString($setup.dialogTitle), 1 /* TEXT */)
                  ])
                ]),
                _: 1 /* STABLE */
              }),
              createVNode(_component_v_card_text, { style: {"padding":"10px 35px"} }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString($setup.dialogText), 1 /* TEXT */)
                ]),
                _: 1 /* STABLE */
              }),
              createVNode(_component_v_card_actions, null, {
                default: withCtx(() => [
                  ($setup.dialogReset)
                    ? (openBlock(), createBlock(_component_VButton, {
                        key: 0,
                        outlined: true,
                        onClick: $setup.closeDialog
                      }, {
                        default: withCtx(() => _cache[33] || (_cache[33] = [
                          createTextVNode("Cancel")
                        ])),
                        _: 1 /* STABLE */
                      }, 8 /* PROPS */, ["onClick"]))
                    : createCommentVNode("v-if", true),
                  (!$setup.dialogReset)
                    ? (openBlock(), createBlock(_component_VButton, {
                        key: 1,
                        outlined: true,
                        onClick: $setup.closeDialog
                      }, {
                        default: withCtx(() => _cache[34] || (_cache[34] = [
                          createTextVNode("Close")
                        ])),
                        _: 1 /* STABLE */
                      }, 8 /* PROPS */, ["onClick"]))
                    : createCommentVNode("v-if", true),
                  ($setup.dialogReset)
                    ? (openBlock(), createBlock(_component_VButton, {
                        key: 2,
                        danger: true,
                        onClick: $setup.resetAllSettings
                      }, {
                        default: withCtx(() => _cache[35] || (_cache[35] = [
                          createTextVNode("Reset")
                        ])),
                        _: 1 /* STABLE */
                      }, 8 /* PROPS */, ["onClick"]))
                    : createCommentVNode("v-if", true),
                  (($setup.dialogType === 'warning' || $setup.dialogType === 'danger') && !$setup.dialogReset)
                    ? (openBlock(), createBlock(_component_VButton, {
                        key: 3,
                        onClick: $setup.closeDialog
                      }, {
                        default: withCtx(() => _cache[36] || (_cache[36] = [
                          createTextVNode(" Double check Settings ")
                        ])),
                        _: 1 /* STABLE */
                      }, 8 /* PROPS */, ["onClick"]))
                    : createCommentVNode("v-if", true)
                ]),
                _: 1 /* STABLE */
              })
            ]),
            _: 1 /* STABLE */
          })
        ]),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["modelValue"])
    ]),
    _: 1 /* STABLE */
  }))
}
var ModuleComponent$1 = /*#__PURE__*/_export_sfc(_sfc_main$3, [['render',_sfc_render$3],['__file',"module.vue"]]);

var e1 = {
	id: 'scaleflex-dam-setting',
	name: 'Scaleflex DAM Setting',
	icon: 'filter',
	routes: [
		{
			path: '',
			component: ModuleComponent$1,
		},
		{
			name: 'page',
			path: ':page',
			props: true,
			component: ModuleComponent$1,
		},
	]
};

var css$2 = "\n.media-container[data-v-e6bd5544] {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  position: relative;\n  padding: 5px;\n}\n.media-item-wrapper[data-v-e6bd5544] {\n  position: relative;\n  transition: transform 0.2s ease, z-index 0.2s ease;\n}\n.media-item-wrapper.hovered[data-v-e6bd5544] {\n  transform: scale(1.2); /* Highlight effect */\n}\n.media-item[data-v-e6bd5544] {\n  width: 35px;\n  height: 35px;\n  border-radius: 35%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-color: #f0f0f0;\n  border: 2px solid white; /* Circle border for better visibility */\n  overflow: hidden;\n}\n.circle[data-v-e6bd5544] {\n  background-size: cover;\n  background-position: center;\n}\n.icon-wrapper[data-v-e6bd5544] {\n  background-color: #ddd; /* Placeholder background for icons */\n}\n.extra-items .media-item[data-v-e6bd5544] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-color: var(--v-button-background-color, var(--theme--primary));\n  opacity: 70%;\n  font-size: 14px;\n  color: white;\n  font-weight: bold;\n}\n.extra-count[data-v-e6bd5544] {\n  font-size: 14px;\n  font-weight: bold;\n}\n";
n(css$2,{});

const _sfc_main$2 = {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    limit: {
      type: Number,
      default: 2,
    }
  },
  data() {
    return {
      hoveredIndex: null,
    };
  },
  computed: {
    displayedItems() {
      return this.value.slice(0, this.limit);
    },
  },
  methods: {
    isImage(type) {
      return type.startsWith("image");
    },
    isVideo(type) {
      return type.startsWith("video");
    },
    isAudio(type) {
      return type.startsWith("audio");
    },
    getIconName(type) {
      if (this.isVideo(type)) return "videocam";
      if (this.isAudio(type)) return "play_circle";
      return "draft";
    },
    hasQueryString(url) {
      try {
        const urlObject = new URL(url);
        return urlObject.search.length > 0;
      } catch (error) {
        return false;
      }
    },
    createThumbnail(url) {
      if (!this.hasQueryString(url)) return url + "?width=100&height=100";
      else return url + "&width=100&height=100";
    },
  },
};

const _hoisted_1$2 = { class: "media-container" };
const _hoisted_2$2 = ["onMouseover"];
const _hoisted_3$2 = ["alt"];
const _hoisted_4$2 = {
  key: 1,
  class: "media-item circle icon-wrapper"
};
const _hoisted_5$1 = {
  key: 0,
  class: "media-item-wrapper extra-items"
};
const _hoisted_6$1 = { class: "media-item circle icon-wrapper" };
const _hoisted_7 = { class: "extra-count" };

function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VIcon = resolveComponent("VIcon");

  return (openBlock(), createElementBlock("div", _hoisted_1$2, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.displayedItems, (item, index) => {
      return (openBlock(), createElementBlock("div", {
        key: index,
        class: normalizeClass(["media-item-wrapper", { 'hovered': $data.hoveredIndex === index }]),
        style: normalizeStyle({
          zIndex: $data.hoveredIndex === index ? 100 : index + 1,
          marginLeft: index > 0 ? '-12px' : '0'
        }),
        onMouseover: $event => ($data.hoveredIndex = index),
        onMouseleave: _cache[0] || (_cache[0] = $event => ($data.hoveredIndex = null))
      }, [
        ($options.isImage(item.type))
          ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "media-item circle",
              style: normalizeStyle({ backgroundImage: `url(${$options.createThumbnail(item.cdn)})` }),
              alt: item.name
            }, null, 12 /* STYLE, PROPS */, _hoisted_3$2))
          : (openBlock(), createElementBlock("div", _hoisted_4$2, [
              createVNode(_component_VIcon, {
                class: normalizeClass(`item-icon ${item.type}`),
                name: $options.getIconName(item.type),
                small: true
              }, null, 8 /* PROPS */, ["class", "name"])
            ]))
      ], 46 /* CLASS, STYLE, PROPS, NEED_HYDRATION */, _hoisted_2$2))
    }), 128 /* KEYED_FRAGMENT */)),
    ($props.value.length > $props.limit)
      ? (openBlock(), createElementBlock("div", _hoisted_5$1, [
          createElementVNode("div", _hoisted_6$1, [
            createElementVNode("span", _hoisted_7, "+" + toDisplayString($props.value.length - $props.limit), 1 /* TEXT */)
          ])
        ]))
      : createCommentVNode("v-if", true)
  ]))
}
var DisplayComponent = /*#__PURE__*/_export_sfc(_sfc_main$2, [['render',_sfc_render$2],['__scopeId',"data-v-e6bd5544"],['__file',"display.vue"]]);

var e2 = {
	id: 'scaleflex-dam-display',
	name: 'DAM Assets',
	icon: 'image',
	description: 'Display DAM assets with beautiful UI',
	component: DisplayComponent,
	options: [
		{
			field: 'limit',
			type: 'integer',
			name: 'Limit assets on Display',
			meta: {
				interface: 'input',
				options: {
					min: 0,
				}
			},
			schema: {
				default_value: 2,
			},
		},
	],
	types: ['json'],
};

var css$1 = "\n#sfx-dam-widget .filerobot-Provider-ItemCategory-wrapper .filerobot-u-reset {\n  top: 0;\n}\n.header-bar {\n  z-index: 99999;\n}\n.filerobot-common-Search-searchInput {\n  background: #FFF;\n}\n.external-link{\n  display: flex;\n  padding: 5px 8px;\n  border-radius: 4px;\n  transition: background 500ms ease;\n  align-items: center;\n}\n.external-link:hover{\n  background: var(--theme--navigation--project--background);\n}\n";
n(css$1,{});

const _sfc_main$1 = {
  props: {
    id: {type: Number, default: 1},
    custom: {type: Boolean, default: false},
    limit: {type: Number, default: 0},
    limitTypes: {type: String, default: null},
    attributes: {type: String, default: null},
  },
  setup(props, {emit}) {
    const api = useApi();
    const loadConfigDone = ref(false);
    const isLoading = ref(true);
    const token = ref('');
    const sec = ref('');
    const directory = ref('');
    const limit = ref(null);
    const attributes = ref([]);
    const limitType = ref([]);
    const endpoint = ref('');
    const isTokenAndSecExists = ref(false);

    onMounted(() => {
      init().then(function () {
        const frConfig = {
          token: token.value,
          sec: sec.value,
          directory: directory.value,
          limitType: limitType.value,
        };
        renderWidget(frConfig);
      });
    });

    function toDamSetting(){
      const damButton = document.querySelector('a[href="/admin/scaleflex-dam-setting"]');
      if (damButton) {
        damButton.click();
      }
    }

    return {
      getIsLoading,
      toDamSetting,
      isTokenAndSecExists
    };

    function getIsLoading() {
      return isLoading.value;
    }

    async function init() {
      await loadData().then(function () {
        isLoading.value = false;
        loadConfigDone.value = true;
      });
    }

    async function loadData() {
      try {
        const response = await api.get(`/items/scaleflex_dam_settings/${props.id}`);
        const data = response.data.data;

        if (!data) throw new Error('Data not found');
        if (data.token && data.sec) {
          endpoint.value = `https://api.filerobot.com/${data.token}/v5`;
          token.value = data.token || '';
          sec.value = data.sec || '';
          directory.value = data.directory || '';
          isTokenAndSecExists.value = true;
        } else {
          isTokenAndSecExists.value = false;
        }

        if (props.custom) {
          limit.value = props.limit || null;
          limitType.value = props.limitTypes ? props.limitTypes : [];
          attributes.value = props.attributes ? props.attributes : [];
        } else {
          limit.value = data.limit || null;
          limitType.value = data.limitType ? data.limitType.split(",") : [];
          attributes.value = data.attributes ? data.attributes.split(",") : [];
        }
      } catch (error) {

      }
    }

    function renderWidget(frConfig) {
      if (!window.Filerobot) {
        return;
      }

      let Filerobot = window.Filerobot;

      let filerobot = null;

      filerobot = Filerobot.Core({
        securityTemplateID: frConfig.sec,
        container: frConfig.token
      });

      let frUploadDirectory = frConfig.directory;

      // Plugins
      let Explorer = Filerobot.Explorer;
      let XHRUpload = Filerobot.XHRUpload;

      filerobot
          .use(Explorer, {
            config: {
              rootFolderPath: frUploadDirectory
            },
            target: '#sfx-dam-widget',
            inline: true,
            width: "100%",
            height: "100%",
            disableExportButton: false,
            hideExportButtonIcon: true,
            preventExportDefaultBehavior: true,
            dismissUrlPathQueryUpdate: true,
            disableDownloadButton: true,
            hideDownloadButtonIcon: true,
            preventDownloadDefaultBehavior: true,
            locale: {
              strings: {
                mutualizedExportButtonLabel: 'Add assets',
                mutualizedDownloadButton: 'Add assets'
              }
            },
            filters: {
              mimeTypes: limitType.value, // Replace with an array of MIME types if needed
            }
          })
          .use(XHRUpload)
          .on('export', async (files, popupExportSuccessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
            console.dir(files);
          })
          .on('complete', ({failed, uploadID, successful}) => {
            if (failed) {
              console.dir(failed);
            }

            if (successful) {
              // console.dir(successful);
              successful.forEach((item, key) => {
                // do something
              });
            }
          });


    }
  }
};

const _hoisted_1$1 = { style: {"margin-top":"20px","padding":"0 10px"} };
const _hoisted_2$1 = { style: {"display":"flex","flex-direction":"column","align-content":"center"} };
const _hoisted_3$1 = { style: {"display":"flex","align-items":"center","background":"var(--theme--navigation--project--background)","padding":"5px 8px","border-radius":"4px","margin-top":"8px"} };
const _hoisted_4$1 = {
  href: "https://docs.scaleflex.com/digital-asset-management-dam/plugins-and-connectors/plugins/directus",
  target: "_blank",
  class: "external-link",
  style: {"margin-top":"8px"}
};
const _hoisted_5 = {
  key: 0,
  style: {"margin":"32px"}
};
const _hoisted_6 = {
  key: 1,
  style: {"padding":"32px"}
};

function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VIcon = resolveComponent("VIcon");
  const _component_VCardTitle = resolveComponent("VCardTitle");
  const _component_VCardText = resolveComponent("VCardText");
  const _component_VCard = resolveComponent("VCard");
  const _component_private_view = resolveComponent("private-view");

  return (openBlock(), createBlock(_component_private_view, { title: "Scaleflex DAM" }, {
    navigation: withCtx(() => [
      createElementVNode("div", _hoisted_1$1, [
        createElementVNode("div", _hoisted_2$1, [
          createElementVNode("div", {
            onClick: _cache[0] || (_cache[0] = (...args) => ($setup.toDamSetting && $setup.toDamSetting(...args))),
            class: "external-link"
          }, [
            createVNode(_component_VIcon, {
              name: "settings",
              style: {"color":"var(--theme--primary)"}
            }),
            _cache[2] || (_cache[2] = createElementVNode("span", { style: {"margin-left":"4px","font-size":"14px","display":"block"} }, "Scaleflex DAM", -1 /* HOISTED */))
          ]),
          createElementVNode("div", _hoisted_3$1, [
            createVNode(_component_VIcon, {
              name: "gallery_thumbnail",
              style: {"color":"var(--theme--primary)"}
            }),
            _cache[3] || (_cache[3] = createElementVNode("span", { style: {"margin-left":"4px","font-size":"14px","display":"block"} }, "Assets Library", -1 /* HOISTED */))
          ]),
          createElementVNode("a", _hoisted_4$1, [
            createVNode(_component_VIcon, {
              name: "description",
              style: {"color":"var(--theme--primary)"}
            }),
            _cache[4] || (_cache[4] = createElementVNode("span", { style: {"margin-left":"4px","font-size":"14px","display":"block"} }, "Documentation", -1 /* HOISTED */))
          ])
        ])
      ])
    ]),
    default: withCtx(() => [
      _cache[9] || (_cache[9] = createElementVNode("link", {
        rel: "stylesheet",
        type: "text/css",
        href: "https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css"
      }, null, -1 /* HOISTED */)),
      ($setup.isTokenAndSecExists)
        ? (openBlock(), createElementBlock("div", _hoisted_5, _cache[5] || (_cache[5] = [
            createElementVNode("div", { id: "sfx-dam-widget" }, null, -1 /* HOISTED */)
          ])))
        : createCommentVNode("v-if", true),
      (!$setup.isTokenAndSecExists)
        ? (openBlock(), createElementBlock("div", _hoisted_6, [
            createVNode(_component_VCard, { style: {"max-width":"100%"} }, {
              default: withCtx(() => [
                createVNode(_component_VCardTitle, { style: {"color":"tomato","display":"flex","align-items":"center"} }, {
                  default: withCtx(() => [
                    createVNode(_component_VIcon, { name: "report" }),
                    _cache[6] || (_cache[6] = createElementVNode("span", { style: {"font-size":"14px","margin-left":"5px"} }, "Scaleflex DAM Notice", -1 /* HOISTED */))
                  ]),
                  _: 1 /* STABLE */
                }),
                createVNode(_component_VCardText, { style: {"max-width":"100%","padding-bottom":"25px"} }, {
                  default: withCtx(() => [
                    _cache[7] || (_cache[7] = createTextVNode(" Please visit the ")),
                    createElementVNode("span", {
                      style: {"text-decoration":"underline","color":"dodgerblue","cursor":"pointer"},
                      onClick: _cache[1] || (_cache[1] = (...args) => ($setup.toDamSetting && $setup.toDamSetting(...args))),
                      target: "_blank"
                    }, "Scaleflex DAM Configuration"),
                    _cache[8] || (_cache[8] = createTextVNode(" to add your Token and Template ID before browsing assets. "))
                  ]),
                  _: 1 /* STABLE */
                })
              ]),
              _: 1 /* STABLE */
            })
          ]))
        : createCommentVNode("v-if", true)
    ]),
    _: 1 /* STABLE */
  }))
}
var ModuleComponent = /*#__PURE__*/_export_sfc(_sfc_main$1, [['render',_sfc_render$1],['__file',"module.vue"]]);

var e3 = {
	id: 'scaleflex-dam',
	name: 'Scaleflex DAM',
	icon: 'cloud',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		},
	],
};

/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var validEvents = [
    'onActivate',
    'onAddUndo',
    'onBeforeAddUndo',
    'onBeforeExecCommand',
    'onBeforeGetContent',
    'onBeforeRenderUI',
    'onBeforeSetContent',
    'onBeforePaste',
    'onBlur',
    'onChange',
    'onClearUndos',
    'onClick',
    'onContextMenu',
    'onCopy',
    'onCut',
    'onDblclick',
    'onDeactivate',
    'onDirty',
    'onDrag',
    'onDragDrop',
    'onDragEnd',
    'onDragGesture',
    'onDragOver',
    'onDrop',
    'onExecCommand',
    'onFocus',
    'onFocusIn',
    'onFocusOut',
    'onGetContent',
    'onHide',
    'onInit',
    'onKeyDown',
    'onKeyPress',
    'onKeyUp',
    'onLoadContent',
    'onMouseDown',
    'onMouseEnter',
    'onMouseLeave',
    'onMouseMove',
    'onMouseOut',
    'onMouseOver',
    'onMouseUp',
    'onNodeChange',
    'onObjectResizeStart',
    'onObjectResized',
    'onObjectSelected',
    'onPaste',
    'onPostProcess',
    'onPostRender',
    'onPreProcess',
    'onProgressState',
    'onRedo',
    'onRemove',
    'onReset',
    'onSaveContent',
    'onSelectionChange',
    'onSetAttrib',
    'onSetContent',
    'onShow',
    'onSubmit',
    'onUndo',
    'onVisualAid'
];
var isValidKey = function (key) {
    return validEvents.map(function (event) { return event.toLowerCase(); }).indexOf(key.toLowerCase()) !== -1;
};
var bindHandlers = function (initEvent, listeners, editor) {
    Object.keys(listeners)
        .filter(isValidKey)
        .forEach(function (key) {
        var handler = listeners[key];
        if (typeof handler === 'function') {
            if (key === 'onInit') {
                handler(initEvent, editor);
            }
            else {
                editor.on(key.substring(2), function (e) { return handler(e, editor); });
            }
        }
    });
};
var bindModelHandlers = function (props, ctx, editor, modelValue) {
    var modelEvents = props.modelEvents ? props.modelEvents : null;
    var normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;
    watch(modelValue, function (val, prevVal) {
        if (editor && typeof val === 'string' && val !== prevVal && val !== editor.getContent({ format: props.outputFormat })) {
            editor.setContent(val);
        }
    });
    editor.on(normalizedEvents ? normalizedEvents : 'change input undo redo', function () {
        ctx.emit('update:modelValue', editor.getContent({ format: props.outputFormat }));
    });
};
var initEditor = function (initEvent, props, ctx, editor, modelValue, content) {
    editor.setContent(content());
    if (ctx.attrs['onUpdate:modelValue']) {
        bindModelHandlers(props, ctx, editor, modelValue);
    }
    bindHandlers(initEvent, ctx.attrs, editor);
};
var unique = 0;
var uuid = function (prefix) {
    var time = Date.now();
    var random = Math.floor(Math.random() * 1000000000);
    unique++;
    return prefix + '_' + random + unique + String(time);
};
var isTextarea = function (element) {
    return element !== null && element.tagName.toLowerCase() === 'textarea';
};
var normalizePluginArray = function (plugins) {
    if (typeof plugins === 'undefined' || plugins === '') {
        return [];
    }
    return Array.isArray(plugins) ? plugins : plugins.split(' ');
};
var mergePlugins = function (initPlugins, inputPlugins) {
    return normalizePluginArray(initPlugins).concat(normalizePluginArray(inputPlugins));
};
var isNullOrUndefined = function (value) {
    return value === null || value === undefined;
};

/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var createState = function () { return ({
    listeners: [],
    scriptId: uuid('tiny-script'),
    scriptLoaded: false
}); };
var CreateScriptLoader = function () {
    var state = createState();
    var injectScriptTag = function (scriptId, doc, url, callback) {
        var scriptTag = doc.createElement('script');
        scriptTag.referrerPolicy = 'origin';
        scriptTag.type = 'application/javascript';
        scriptTag.id = scriptId;
        scriptTag.src = url;
        var handler = function () {
            scriptTag.removeEventListener('load', handler);
            callback();
        };
        scriptTag.addEventListener('load', handler);
        if (doc.head) {
            doc.head.appendChild(scriptTag);
        }
    };
    var load = function (doc, url, callback) {
        if (state.scriptLoaded) {
            callback();
        }
        else {
            state.listeners.push(callback);
            if (!doc.getElementById(state.scriptId)) {
                injectScriptTag(state.scriptId, doc, url, function () {
                    state.listeners.forEach(function (fn) { return fn(); });
                    state.scriptLoaded = true;
                });
            }
        }
    };
    // Only to be used by tests.
    var reinitialize = function () {
        state = createState();
    };
    return {
        load: load,
        reinitialize: reinitialize
    };
};
var ScriptLoader = CreateScriptLoader();

/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var getGlobal = function () { return (typeof window !== 'undefined' ? window : global); };
var getTinymce = function () {
    var global = getGlobal();
    return global && global.tinymce ? global.tinymce : null;
};

var editorProps = {
    apiKey: String,
    cloudChannel: String,
    id: String,
    init: Object,
    initialValue: String,
    inline: Boolean,
    modelEvents: [String, Array],
    plugins: [String, Array],
    tagName: String,
    toolbar: [String, Array],
    modelValue: String,
    disabled: Boolean,
    tinymceScriptSrc: String,
    outputFormat: {
        type: String,
        validator: function (prop) { return prop === 'html' || prop === 'text'; }
    },
};

/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var renderInline = function (ce, id, elementRef, tagName) {
    return ce(tagName ? tagName : 'div', {
        id: id,
        ref: elementRef
    });
};
var renderIframe = function (ce, id, elementRef) {
    return ce('textarea', {
        id: id,
        visibility: 'hidden',
        ref: elementRef
    });
};
var defaultInitValues = { selector: undefined, target: undefined };
var Editor = defineComponent({
    props: editorProps,
    setup: function (props, ctx) {
        var conf = props.init ? __assign(__assign({}, props.init), defaultInitValues) : __assign({}, defaultInitValues);
        var _a = toRefs(props), disabled = _a.disabled, modelValue = _a.modelValue, tagName = _a.tagName;
        var element = ref(null);
        var vueEditor = null;
        var elementId = props.id || uuid('tiny-vue');
        var inlineEditor = (props.init && props.init.inline) || props.inline;
        var modelBind = !!ctx.attrs['onUpdate:modelValue'];
        var mounting = true;
        var initialValue = props.initialValue ? props.initialValue : '';
        var cache = '';
        var getContent = function (isMounting) { return modelBind ?
            function () { return ((modelValue === null || modelValue === void 0 ? void 0 : modelValue.value) ? modelValue.value : ''); } :
            function () { return isMounting ? initialValue : cache; }; };
        var initWrapper = function () {
            var content = getContent(mounting);
            var finalInit = __assign(__assign({}, conf), { readonly: props.disabled, target: element.value, plugins: mergePlugins(conf.plugins, props.plugins), toolbar: props.toolbar || (conf.toolbar), inline: inlineEditor, setup: function (editor) {
                    vueEditor = editor;
                    editor.on('init', function (e) { return initEditor(e, props, ctx, editor, modelValue, content); });
                    if (typeof conf.setup === 'function') {
                        conf.setup(editor);
                    }
                } });
            if (isTextarea(element.value)) {
                element.value.style.visibility = '';
            }
            getTinymce().init(finalInit);
            mounting = false;
        };
        watch(disabled, function (disable) {
            var _a;
            if (vueEditor !== null) {
                if (typeof ((_a = vueEditor.mode) === null || _a === void 0 ? void 0 : _a.set) === 'function') {
                    vueEditor.mode.set(disable ? 'readonly' : 'design');
                }
                else {
                    vueEditor.setMode(disable ? 'readonly' : 'design');
                }
            }
        });
        watch(tagName, function (_) {
            var _a;
            if (!modelBind) {
                cache = vueEditor.getContent();
            }
            (_a = getTinymce()) === null || _a === void 0 ? void 0 : _a.remove(vueEditor);
            nextTick(function () { return initWrapper(); });
        });
        onMounted(function () {
            if (getTinymce() !== null) {
                initWrapper();
            }
            else if (element.value && element.value.ownerDocument) {
                var channel = props.cloudChannel ? props.cloudChannel : '6';
                var apiKey = props.apiKey ? props.apiKey : 'no-api-key';
                var scriptSrc = isNullOrUndefined(props.tinymceScriptSrc) ?
                    "https://cdn.tiny.cloud/1/".concat(apiKey, "/tinymce/").concat(channel, "/tinymce.min.js") :
                    props.tinymceScriptSrc;
                ScriptLoader.load(element.value.ownerDocument, scriptSrc, initWrapper);
            }
        });
        onBeforeUnmount(function () {
            if (getTinymce() !== null) {
                getTinymce().remove(vueEditor);
            }
        });
        if (!inlineEditor) {
            onActivated(function () {
                if (!mounting) {
                    initWrapper();
                }
            });
            onDeactivated(function () {
                var _a;
                if (!modelBind) {
                    cache = vueEditor.getContent();
                }
                (_a = getTinymce()) === null || _a === void 0 ? void 0 : _a.remove(vueEditor);
            });
        }
        var rerender = function (init) {
            var _a;
            cache = vueEditor.getContent();
            (_a = getTinymce()) === null || _a === void 0 ? void 0 : _a.remove(vueEditor);
            conf = __assign(__assign(__assign({}, conf), init), defaultInitValues);
            nextTick(function () { return initWrapper(); });
        };
        ctx.expose({
            rerender: rerender,
            getEditor: function () { return vueEditor; }
        });
        return function () { return inlineEditor ?
            renderInline(h, elementId, element, props.tagName) :
            renderIframe(h, elementId, element); };
    }
});

/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

var css = "\n.ml-1 {\n  margin-left: 0.5rem;\n}\n#sfx-editor-modal .filerobot-Provider-ItemCategory-wrapper .filerobot-u-reset {\n  top: 0;\n}\n.modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n}\n.modal {\n  background: white;\n  border-radius: 8px;\n  padding: 1rem;\n  width: 80%;\n  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);\n  overflow-y: auto;\n  max-height: 80vh;\n  margin: 1.75rem auto;\n}\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.modal-close-btn {\n  background: transparent;\n  border: none;\n  font-size: 1.5rem;\n  cursor: pointer;\n}\n.modal-body {\n  margin: 1rem 0;\n}\n.modal-footer {\n  text-align: right;\n}\n";
n(css,{});

const _sfc_main = {
  props: {
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { Editor },
  data() {
    return {
      editor: null,
    };
  },
  emits: ['input', 'close'],
  setup(props, {emit}) {
    const isOpen = ref(false);

    const api = useApi();
    const loadConfigDone = ref(false);
    const isLoading = ref(true);
    const token = ref('');
    const sec = ref('');
    const directory = ref('');
    const limit = ref(null);
    const attributes = ref([]);
    const limitType = ref([]);
    const endpoint = ref('');
    const isTokenAndSecExists = ref(false);

    onMounted(() => {
      init();
    });

    function closeModal() {
      document.getElementById("sfx-editor-modal").setAttribute("style", "display: none");
      emit('close');
      isOpen.value = false;
    }

    function openModal(id) {
      document.getElementById("sfx-editor-modal").setAttribute("style", "display: block");
      isOpen.value = true;
      openSfxDAM(id);
    }

    async function openSfxDAM(editor_id) {
      const frConfig = {
        token: token.value,
        sec: sec.value,
        directory: directory.value,
        limitType: limitType.value,
      };
      renderWidget(frConfig, editor_id);
    }

    async function init() {
      await loadData().then(function () {
        isLoading.value = false;
        loadConfigDone.value = true;
      });
    }

    async function loadData() {
      try {
        const response = await api.get(`/items/scaleflex_dam_settings/1`);
        const data = response.data.data;

        if (!data) throw new Error('Data not found');
        if (data.token && data.sec) {
          endpoint.value = `https://api.filerobot.com/${data.token}/v5`;
          token.value = data.token || '';
          sec.value = data.sec || '';
          directory.value = data.directory || '';
          isTokenAndSecExists.value = true;
        } else {
          isTokenAndSecExists.value = false;
        }

        if (props.custom) {
          limit.value = props.limit || null;
          limitType.value = props.limitTypes ? props.limitTypes : [];
          attributes.value = props.attributes ? props.attributes : [];
        } else {
          limit.value = data.limit || null;
          limitType.value = data.limitType ? data.limitType.split(",") : [];
          attributes.value = data.attributes ? data.attributes.split(",") : [];
        }
      } catch (error) {

      }
    }


    function renderWidget(frConfig, editor_id) {
      if (!window.Filerobot) {
        return;
      }

      let Filerobot = window.Filerobot;

      let filerobot = null;

      filerobot = Filerobot.Core({
        securityTemplateID: frConfig.sec,
        container: frConfig.token
      });

      let frUploadDirectory = frConfig.directory;

      // Plugins
      let Explorer = Filerobot.Explorer;
      let XHRUpload = Filerobot.XHRUpload;

      filerobot
          .use(Explorer, {
            config: {
              rootFolderPath: frUploadDirectory
            },
            target: '#sfx-dam-widget-editor',
            inline: true,
            width: "100%",
            height: "100%",
            disableExportButton: false,
            hideExportButtonIcon: true,
            preventExportDefaultBehavior: true,
            dismissUrlPathQueryUpdate: true,
            disableDownloadButton: false,
            hideDownloadButtonIcon: true,
            preventDownloadDefaultBehavior: true,
            locale: {
              strings: {
                mutualizedExportButtonLabel: 'Add assets',
                mutualizedDownloadButton: 'Add assets'
              }
            },
            filters: {
              mimeTypes: limitType.value, // Replace with an array of MIME types if needed
            }
          })
          .use(XHRUpload)
          .on('export', async (files, popupExportSuccessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
            console.dir(files);
            const htmlRender = renderHTMLFromJSON(files);
            tinymce.get(editor_id).insertContent(htmlRender);
            closeModal();
          })
          .on('complete', ({failed, uploadID, successful}) => {
            if (failed) {
              console.dir(failed);
            }

            if (successful) {
              // console.dir(successful);
              successful.forEach((item, key) => {
                // do something
              });
            }
          });
    }

    // Function to render HTML from JSON data
    function renderHTMLFromJSON(data) {
      let result = "";

      data.forEach(item => {
        // Extract necessary properties from the JSON structure
        const file = item.file;
        const type = file.type;
        const title = file.meta?.title?.en || "No Title";
        const cdnLink = file.url?.cdn || "";

        if (file.url?.download !== undefined) {
          cdnLink.value = file.url?.download;
        }

        // Create HTML content based on the file type
        let itemContent = `<div>`;
        if (type === 'image/jpeg' || type === 'image/png') {
          itemContent += `<img src='${cdnLink}' alt='${title}' />`;
        } else if (type === 'video/mp4' || type.startsWith('video/')) {
          itemContent += `<video src='${cdnLink}' controls></video>`;
        } else if (type === 'audio/mpeg' || type.startsWith('audio/')) {
          itemContent += `<audio src='${cdnLink}' controls></audio>`;
        }
        itemContent += `</div>`;

        // Append to result string
        result += itemContent;
      });

      // Return the result string
      return result;
    }

    return {
      closeModal,
      openModal,
      emit,
    }
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  },
};

const _hoisted_1 = { class: "modal" };
const _hoisted_2 = { class: "modal-header" };
const _hoisted_3 = { class: "modal-body" };
const _hoisted_4 = { class: "modal-footer" };

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Editor = resolveComponent("Editor");

  return (openBlock(), createElementBlock(Fragment, null, [
    _cache[4] || (_cache[4] = createElementVNode("link", {
      rel: "stylesheet",
      type: "text/css",
      href: "https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css"
    }, null, -1 /* HOISTED */)),
    createElementVNode("div", null, [
      createVNode(_component_Editor, {
        "api-key": "qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc",
        init: {
          plugins: 'media table lists image link pagebreak code insertdatetime autoresize preview fullscreen directionality',
          toolbar: 'h1 h2 h3 bold italic underline alignleft aligncenter alignright alignjustify bullist numlist ' +
           'outdent indent link removeformat blockquote fullscreen code | sfxDAM',
          setup: (editor) => {
            editor.on('init', () => {
              editor.setContent($props.value);
            });

            editor.ui.registry.addToggleButton('sfxDAM', {
              text: 'DAM',
              onAction: (api) => {
                $setup.openModal(editor.id);
              }
            });

            editor.on('input', () => {
              const content = editor.getContent();
              $setup.emit('input', content);
            });
          }
        }
      }, null, 8 /* PROPS */, ["init"])
    ]),
    createElementVNode("div", {
      style: normalizeStyle({ display: _ctx.isOpen ? 'block' : 'none' }),
      class: "modal-overlay",
      id: "sfx-editor-modal"
    }, [
      createElementVNode("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          _cache[2] || (_cache[2] = createElementVNode("h3", null, "Scaleflex DAM", -1 /* HOISTED */)),
          createElementVNode("button", {
            onClick: _cache[0] || (_cache[0] = (...args) => ($setup.closeModal && $setup.closeModal(...args))),
            class: "modal-close-btn"
          }, "×")
        ]),
        createElementVNode("div", _hoisted_3, [
          renderSlot(_ctx.$slots, "default", {}, () => [
            _cache[3] || (_cache[3] = createElementVNode("div", { id: "sfx-dam-widget-editor" }, null, -1 /* HOISTED */))
          ])
        ]),
        createElementVNode("div", _hoisted_4, [
          createElementVNode("button", {
            onClick: _cache[1] || (_cache[1] = (...args) => ($setup.closeModal && $setup.closeModal(...args))),
            class: "btn"
          }, "Close")
        ])
      ])
    ], 4 /* STYLE */)
  ], 64 /* STABLE_FRAGMENT */))
}
var InterfaceComponent = /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__file',"interface.vue"]]);

var e4 = {
	id: 'dam-editor',
	name: 'WYSIWYG With DAM',
	icon: 'format_quote',
	description: 'Use the WYSIWYG with Scaleflex DAM',
	component: InterfaceComponent,
	options: {
		standard: [
			{
				field: 'toolbar',
				name: '$t:interfaces.input-rich-text-html.toolbar',
				type: 'json',
				schema: {
					default_value: [
						'bold',
						'italic',
						'underline',
						'h1',
						'h2',
						'h3',
						'numlist',
						'bullist',
						'removeformat',
						'blockquote',
						'customLink',
						'customImage',
						'customMedia',
						'hr',
						'code',
						'fullscreen',
					],
				},
				meta: {
					width: 'half',
					interface: 'select-multiple-dropdown',
					options: {
						choices: [
							{
								value: 'undo',
								text: '$t:wysiwyg_options.undo',
							},
							{
								value: 'redo',
								text: '$t:wysiwyg_options.redo',
							},
							{
								value: 'bold',
								text: '$t:wysiwyg_options.bold',
							},
							{
								value: 'italic',
								text: '$t:wysiwyg_options.italic',
							},
							{
								value: 'underline',
								text: '$t:wysiwyg_options.underline',
							},
							{
								value: 'strikethrough',
								text: '$t:wysiwyg_options.strikethrough',
							},
							{
								value: 'subscript',
								text: '$t:wysiwyg_options.subscript',
							},
							{
								value: 'superscript',
								text: '$t:wysiwyg_options.superscript',
							},
							{
								value: 'fontfamily',
								text: '$t:wysiwyg_options.fontselect',
							},
							{
								value: 'fontsize',
								text: '$t:wysiwyg_options.fontsizeselect',
							},
							{
								value: 'h1',
								text: '$t:wysiwyg_options.h1',
							},
							{
								value: 'h2',
								text: '$t:wysiwyg_options.h2',
							},
							{
								value: 'h3',
								text: '$t:wysiwyg_options.h3',
							},
							{
								value: 'h4',
								text: '$t:wysiwyg_options.h4',
							},
							{
								value: 'h5',
								text: '$t:wysiwyg_options.h5',
							},
							{
								value: 'h6',
								text: '$t:wysiwyg_options.h6',
							},
							{
								value: 'alignleft',
								text: '$t:wysiwyg_options.alignleft',
							},
							{
								value: 'aligncenter',
								text: '$t:wysiwyg_options.aligncenter',
							},
							{
								value: 'alignright',
								text: '$t:wysiwyg_options.alignright',
							},
							{
								value: 'alignjustify',
								text: '$t:wysiwyg_options.alignjustify',
							},
							{
								value: 'alignnone',
								text: '$t:wysiwyg_options.alignnone',
							},
							{
								value: 'indent',
								text: '$t:wysiwyg_options.indent',
							},
							{
								value: 'outdent',
								text: '$t:wysiwyg_options.outdent',
							},
							{
								value: 'numlist',
								text: '$t:wysiwyg_options.numlist',
							},
							{
								value: 'bullist',
								text: '$t:wysiwyg_options.bullist',
							},
							{
								value: 'forecolor',
								text: '$t:wysiwyg_options.forecolor',
							},
							{
								value: 'backcolor',
								text: '$t:wysiwyg_options.backcolor',
							},
							{
								value: 'removeformat',
								text: '$t:wysiwyg_options.removeformat',
							},
							{
								value: 'cut',
								text: '$t:wysiwyg_options.cut',
							},
							{
								value: 'copy',
								text: '$t:wysiwyg_options.copy',
							},
							{
								value: 'paste',
								text: '$t:wysiwyg_options.paste',
							},
							{
								value: 'remove',
								text: '$t:wysiwyg_options.remove',
							},
							{
								value: 'selectall',
								text: '$t:wysiwyg_options.selectall',
							},
							{
								value: 'blockquote',
								text: '$t:wysiwyg_options.blockquote',
							},
							{
								value: 'customLink',
								text: '$t:wysiwyg_options.link',
							},
							{
								value: 'unlink',
								text: '$t:wysiwyg_options.unlink',
							},
							{
								value: 'customImage',
								text: '$t:wysiwyg_options.image',
							},
							{
								value: 'customMedia',
								text: '$t:wysiwyg_options.media',
							},
							{
								value: 'table',
								text: '$t:wysiwyg_options.table',
							},
							{
								value: 'hr',
								text: '$t:wysiwyg_options.hr',
							},
							{
								value: 'code',
								text: '$t:wysiwyg_options.source_code',
							},
							{
								value: 'fullscreen',
								text: '$t:wysiwyg_options.fullscreen',
							},
							{
								value: 'visualaid',
								text: '$t:wysiwyg_options.visualaid',
							},
							{
								value: 'ltr rtl',
								text: '$t:wysiwyg_options.directionality',
							},
						],
					},
				},
			},
			{
				field: 'font',
				name: '$t:font',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'select-dropdown',
					options: {
						choices: [
							{ text: '$t:sans_serif', value: 'sans-serif' },
							{ text: '$t:monospace', value: 'monospace' },
							{ text: '$t:serif', value: 'serif' },
						],
					},
				},
				schema: {
					default_value: 'sans-serif',
				},
			},
			{
				field: 'folder',
				name: '$t:folder',
				type: 'uuid',
				meta: {
					width: 'half',
					interface: 'system-folder',
					note: '$t:interfaces.input-rich-text-html.folder_note',
				},
			},
			{
				field: 'imageToken',
				name: '$t:interfaces.input-rich-text-html.imageToken',
				type: 'string',
				meta: {
					note: '$t:interfaces.input-rich-text-html.imageToken_label',
					width: 'half',
					interface: 'input',
				},
			},
		],
		advanced: [
			{
				field: 'softLength',
				name: '$t:soft_length',
				type: 'integer',
				meta: {
					width: 'half',
					interface: 'input',
					options: {
						placeholder: '255',
						min: 1,
					},
				},
			},
			{
				field: 'customFormats',
				name: '$t:interfaces.input-rich-text-html.custom_formats',
				type: 'json',
				meta: {
					interface: 'code',
					note: '$t:interfaces.input-rich-text-html.custom_formats_note',
					options: {
						language: 'json',
						template: JSON.stringify(
							[
								{
									title: 'My Custom Format',
									inline: 'span',
									classes: 'custom-wrapper',
									styles: { color: '#00ff00', 'font-size': '20px' },
									attributes: { title: 'My Custom Wrapper' },
								},
							],
							null,
							4,
						),
					},
				},
			},
			{
				field: 'tinymceOverrides',
				name: '$t:interfaces.input-rich-text-html.options_override',
				type: 'json',
				meta: {
					interface: 'code',
					note: '$t:interfaces.input-rich-text-html.options_override_note',
					options: {
						language: 'json',
						template: JSON.stringify(
							{
								font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
								font_family_formats: 'Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace;',
							},
							null,
							4,
						),
					},
				},
			},
		],
	},
	types: ['text'],
};

const interfaces = [e0,e4];const displays = [e2];const layouts = [];const modules = [e1,e3];const panels = [];const themes = [];const operations = [];

export { displays, interfaces, layouts, modules, operations, panels, themes };
