function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
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

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var Fragment = "fragment";
function createElement(type, props) {
  var name = "";

  if (typeof type === "string") {
    name = type;
  } else if (typeof type === "function") {
    name = type.name;
  }

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  console.log("createElement", name, props, children);
  return {
    type: type,
    name: name,
    props: _extends({}, props),
    children: children,
    alternate: null,
    hooks: [],
    needsDraw: false,
    cache: null,
    frame: null
  };
}

function createHook() {
  return {
    state: {},
    queue: [],
    pendingEffects: [],
    pendingTicks: [],
    pendingUnmount: [],
    pendingLayout: []
  };
}

function mkPoint(x, y) {
  return {
    x: x,
    y: y
  };
}
function pointLerp(a, b, t) {
  return mkPoint(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
}
function pointAt(p, angle, distance) {
  return pointLerp(p, mkPoint(p.x + Math.cos(angle) * distance, p.y + Math.sin(angle) * distance), 1);
}

function mkRect(x, y, width, height) {
  return {
    x: x,
    y: y,
    width: width,
    height: height
  };
}
function rectLeft(rect) {
  return rect.x;
}
function rectRight(rect) {
  return rect.x + rect.width;
}
function rectTop(rect) {
  return rect.y;
}
function rectBottom(rect) {
  return rect.y + rect.height;
}
function rectCenter(rect) {
  return mkPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
}
function rectContains(rect, point) {
  return point.x >= rectLeft(rect) && point.x <= rectRight(rect) && point.y >= rectTop(rect) && point.y <= rectBottom(rect);
}
function rectIntersects(a, b) {
  return rectLeft(a) <= rectRight(b) && rectRight(a) >= rectLeft(b) && rectTop(a) <= rectBottom(b) && rectBottom(a) >= rectTop(b);
}

var mkSize = function mkSize(width, height) {
  return {
    width: width,
    height: height
  };
};

function flattenChildren(children) {
  var nodes = [];

  if (Array.isArray(children)) {
    for (var _iterator = _createForOfIteratorHelperLoose(children), _step; !(_step = _iterator()).done;) {
      var child = _step.value;

      if (Array.isArray(child)) {
        nodes = nodes.concat(flattenChildren(child));
      } else if (child) {
        nodes.push(child);
      }
    }
  }

  return nodes;
}

function havePropsChanged(a, b) {
  var ignoreKeys = ["__source", "__self"];

  if (a === null || b === null) {
    return true;
  }

  for (var key in a) {
    if (ignoreKeys.indexOf(key) === -1) {
      if (Array.isArray(a[key])) {
        if (a[key].length !== b[key].length) {
          return true;
        }

        for (var i = 0; i < a[key].length; i++) {
          if (havePropsChanged(a[key][i], b[key][i])) {
            return true;
          }
        }
      } else if (typeof a[key] === "object") {
        if (havePropsChanged(a[key], b[key])) {
          return true;
        }
      } else if (a[key] !== b[key]) {
        return true;
      }
    }
  }

  return false;
}

function minifyNode(node) {
  var mini = {
    name: node.name,
    type: node.type,
    props: node.props,
    children: node.children,
    alternate: null,
    hooks: node.hooks,
    needsDraw: false,
    cache: node.cache,
    frame: node.frame
  };
  return pruneGrandChildren(mini);
}
function pruneGrandChildren(node) {
  var children = node.children.map(function (child) {
    var mini = minifyNode(child);

    if (mini.children.length > 0) {
      mini.children = mini.children.map(function (grandChild) {
        return minifyNode(grandChild);
      });
    }

    return mini;
  });
  node.children = children;
  return node;
}

var paintContext = {
  canvas: null,
  canvasStack: []
};
var PaintJob = /*#__PURE__*/function () {
  function PaintJob(node) {
    this.name = "PaintJob";
    this.node = node;
  }

  var _proto = PaintJob.prototype;

  _proto.doPainting = function doPainting() {
    this.paint();
  };

  _proto.paint = function paint() {};

  _proto.pushCanvas = function pushCanvas(canvas) {
    paintContext.canvasStack.push(canvas);
  };

  _proto.popCanvas = function popCanvas() {
    var c = paintContext.canvasStack.pop();

    if (c) {
      return c;
    } else {
      return null;
    }
  };

  _proto.updateRenderingContextFromProps = function updateRenderingContextFromProps(ctx, props) {
    var hasChanged = false;
    var shouldFill = false;
    var shouldStroke = false;
    var map = {
      fill: "fillStyle",
      stroke: "strokeStyle",
      strokeWidth: "lineWidth",
      font: "font"
    };

    for (var key in map) {
      var ctxKey = map[key];

      if (props[key] && ctx[ctxKey] !== props[key]) {
        ctx[ctxKey] = props[key];
        hasChanged = true;
      }

      if (key === "fill" && props[key]) {
        shouldFill = true;
      }

      if (key === "stroke" && props[key]) {
        shouldStroke = true;
      }
    }

    return {
      hasChanged: hasChanged,
      shouldFill: shouldFill,
      shouldStroke: shouldStroke
    };
  };

  _createClass(PaintJob, [{
    key: "canvas",
    get: function get() {
      return paintContext.canvas;
    },
    set: function set(val) {
      paintContext.canvas = val;
    }
  }, {
    key: "paintingContext",
    get: function get() {
      return paintContext;
    }
  }]);

  return PaintJob;
}();

function getCanvas(id) {
  var sup = getSharedSupervisor();
  var canvases = sup.canvases;
  var canvas = canvases.find(function (c) {
    return c.id === id;
  });
  return canvas;
}

var canvasId = 0;
var LayerJob = /*#__PURE__*/function (_PaintJob) {
  _inheritsLoose(LayerJob, _PaintJob);

  function LayerJob(node) {
    var _this;

    _this = _PaintJob.call(this, node) || this;
    _this.name = "LayerJob";
    return _this;
  }

  var _proto = LayerJob.prototype;

  _proto.paint = function paint() {
    var canvas = getCanvas(this.node.props.id);

    if (canvas) {
      var tmpCanvas = this.node.cache;

      if (!tmpCanvas) {
        tmpCanvas = document.createElement("canvas");
        tmpCanvas.id = "tmp-layer-canvas-" + canvasId++;
        tmpCanvas.height = canvas.height;
        tmpCanvas.width = canvas.width;
        this.node.cache = tmpCanvas;
      }

      var tmpContext = tmpCanvas.getContext("2d");

      if (tmpContext) {
        tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
        this.canvas = tmpCanvas;
      }
    }
  };

  return LayerJob;
}(PaintJob);

var LayerEndJob = /*#__PURE__*/function (_PaintJob) {
  _inheritsLoose(LayerEndJob, _PaintJob);

  function LayerEndJob(node) {
    var _this;

    _this = _PaintJob.call(this, node) || this;
    _this.name = "LayerEndJob";
    return _this;
  }

  var _proto = LayerEndJob.prototype;

  _proto.paint = function paint() {
    var canvas = getCanvas(this.node.props.id);

    if (canvas) {
      var origContext = canvas.getContext("2d");
      origContext.clearRect(0, 0, canvas.width, canvas.height);
      origContext.drawImage(this.node.cache, 0, 0);
      this.canvas = canvas;
    }
  };

  return LayerEndJob;
}(PaintJob);

var RectangleJob = /*#__PURE__*/function (_PaintJob) {
  _inheritsLoose(RectangleJob, _PaintJob);

  function RectangleJob(node) {
    var _this;

    _this = _PaintJob.call(this, node) || this;
    _this.name = "RectangleJob";
    return _this;
  }

  var _proto = RectangleJob.prototype;

  _proto.paint = function paint() {
    var frm = this.node.frame;

    if (this.canvas) {
      var ctx = this.canvas.getContext("2d");
      var cu = this.updateRenderingContextFromProps(ctx, this.node.props);

      if (cu.hasChanged) {
        ctx.save();
      }

      ctx.beginPath();

      if (cu.shouldFill) {
        console.log("RectanbleJob.paint fill", frm.x, frm.y, frm.width, frm.height);
        ctx.fillRect(frm.x, frm.y, frm.width, frm.height);
      }

      if (cu.shouldStroke) {
        ctx.strokeRect(frm.x, frm.y, frm.width, frm.height);
      }

      if (cu.hasChanged) {
        ctx.restore();
      }
    }
  };

  return RectangleJob;
}(PaintJob);

var TextJob = /*#__PURE__*/function (_PaintJob) {
  _inheritsLoose(TextJob, _PaintJob);

  function TextJob(node) {
    var _this;

    _this = _PaintJob.call(this, node) || this;
    _this.name = "TextJob";
    return _this;
  }

  var _proto = TextJob.prototype;

  _proto.paint = function paint() {
    var x = this.node.frame.x;
    var y = this.node.frame.y;
    var text = this.node.props.text || "";

    if (this.canvas) {
      var ctx = this.canvas.getContext("2d");
      var cu = this.updateRenderingContextFromProps(ctx, this.node.props);

      if (cu.hasChanged) {
        ctx.save();
      }

      ctx.beginPath();
      var tm = ctx.measureText(text);
      y = y + tm.actualBoundingBoxAscent;

      if (cu.shouldFill) {
        ctx.fillText(text, x, y);
      }

      if (cu.shouldStroke) {
        ctx.strokeText(text, x, y);
      }

      if (cu.hasChanged) {
        ctx.restore();
      }
    }
  };

  return TextJob;
}(PaintJob);

var CircleJob = /*#__PURE__*/function (_PaintJob) {
  _inheritsLoose(CircleJob, _PaintJob);

  function CircleJob(node) {
    var _this;

    _this = _PaintJob.call(this, node) || this;
    _this.name = "CircleJob";
    return _this;
  }

  var _proto = CircleJob.prototype;

  _proto.paint = function paint() {
    var frm = this.node.frame;
    var radius = frm.width / 2;

    if (this.canvas) {
      var ctx = this.canvas.getContext("2d");
      var cu = this.updateRenderingContextFromProps(ctx, this.node.props);

      if (cu.hasChanged) {
        ctx.save();
      }

      ctx.beginPath();
      ctx.ellipse(frm.x + radius, frm.y + radius, radius, radius, 0, 0, 2 * Math.PI);

      if (cu.shouldFill) {
        ctx.fill();
      }

      if (cu.shouldStroke) {
        ctx.stroke();
      }

      if (cu.hasChanged) {
        ctx.restore();
      }
    }
  };

  return CircleJob;
}(PaintJob);

var PathJob = /*#__PURE__*/function (_PaintJob) {
  _inheritsLoose(PathJob, _PaintJob);

  function PathJob(node) {
    var _this;

    _this = _PaintJob.call(this, node) || this;
    _this.name = "PathJob";
    return _this;
  }

  var _proto = PathJob.prototype;

  _proto.paint = function paint() {
    var frm = this.node.frame;
    var closePath = this.node.props.closed ? this.node.props.closed : false;
    var path = this.node.props.path || [];

    if (this.canvas) {
      var ctx = this.canvas.getContext("2d");
      var cu = this.updateRenderingContextFromProps(ctx, this.node.props);

      if (cu.hasChanged) {
        ctx.save();
      }

      ctx.beginPath();
      var i = 0;

      for (var _iterator = _createForOfIteratorHelperLoose(path), _step; !(_step = _iterator()).done;) {
        var pt = _step.value;

        if (i === 0) {
          ctx.moveTo(frm.x + pt.x, frm.y + pt.y);
        } else {
          ctx.lineTo(frm.x + pt.x, frm.y + pt.y);
        }

        i++;
      }

      if (closePath) {
        ctx.closePath();
      }

      if (cu.shouldFill) {
        ctx.fill();
      }

      if (cu.shouldStroke) {
        ctx.stroke();
      }

      if (cu.hasChanged) {
        ctx.restore();
      }
    }
  };

  return PathJob;
}(PaintJob);

var PolygonJob = /*#__PURE__*/function (_PaintJob) {
  _inheritsLoose(PolygonJob, _PaintJob);

  function PolygonJob(node) {
    var _this;

    _this = _PaintJob.call(this, node) || this;
    _this.name = "PolygonJob";
    return _this;
  }

  var _proto = PolygonJob.prototype;

  _proto.paint = function paint() {
    var frm = this.node.frame;
    var radius = frm.width / 2;
    var sides = parseFloat(this.node.props.sides) || 5;
    var center = mkPoint(frm.x + radius, frm.y + radius);
    var angle = Math.PI * 2 / sides;
    var path = [];

    for (var i = 0; i < sides; i++) {
      var pt = pointAt(center, angle * i, radius);
      path.push(pt);
    }

    if (this.canvas) {
      var ctx = this.canvas.getContext("2d");
      var cu = this.updateRenderingContextFromProps(ctx, this.node.props);

      if (cu.hasChanged) {
        ctx.save();
      }

      ctx.beginPath();
      var _i = 0;

      for (var _iterator = _createForOfIteratorHelperLoose(path), _step; !(_step = _iterator()).done;) {
        var _pt = _step.value;

        if (_i === 0) {
          ctx.moveTo(_pt.x, _pt.y);
        } else {
          ctx.lineTo(_pt.x, _pt.y);
        }

        if (_i === path.length - 1) {
          ctx.closePath();
        }

        _i++;
      }

      if (cu.shouldFill) {
        ctx.fill();
      }

      if (cu.shouldStroke) {
        ctx.stroke();
      }

      if (cu.hasChanged) {
        ctx.restore();
      }
    }
  };

  return PolygonJob;
}(PaintJob);

var FrameJob = /*#__PURE__*/function (_PaintJob) {
  _inheritsLoose(FrameJob, _PaintJob);

  function FrameJob(node) {
    var _this;

    _this = _PaintJob.call(this, node) || this;
    _this.name = "FrameJob";
    return _this;
  }

  var _proto = FrameJob.prototype;

  _proto.paint = function paint() {
    console.log("Frame Job", this.node);
  };

  return FrameJob;
}(PaintJob);

var FrameEndJob = /*#__PURE__*/function (_PaintJob) {
  _inheritsLoose(FrameEndJob, _PaintJob);

  function FrameEndJob(node) {
    var _this;

    _this = _PaintJob.call(this, node) || this;
    _this.name = "FrameEndJob";
    return _this;
  }

  var _proto = FrameEndJob.prototype;

  _proto.paint = function paint() {
    console.log("FrameEnd Job", this.node);
  };

  return FrameEndJob;
}(PaintJob);

var groupId = 0;
var GroupJob = /*#__PURE__*/function (_PaintJob) {
  _inheritsLoose(GroupJob, _PaintJob);

  function GroupJob(node) {
    var _this;

    _this = _PaintJob.call(this, node) || this;
    _this.name = "GroupJob";
    return _this;
  }

  var _proto = GroupJob.prototype;

  _proto.paint = function paint() {
    var frm = this.node.frame;

    if (this.canvas) {
      this.pushCanvas(this.canvas);
      var tmpCanvas = this.node.cache;

      if (!tmpCanvas) {
        tmpCanvas = document.createElement("canvas");
        tmpCanvas.id = "tmp-group-canvas-" + groupId++;
        tmpCanvas.height = frm.height;
        tmpCanvas.width = frm.width;
        this.node.cache = tmpCanvas;
      }

      var tmpContext = tmpCanvas.getContext("2d");

      if (tmpContext) {
        tmpContext.clearRect(frm.x, frm.y, frm.width, frm.height);
        this.canvas = tmpCanvas;
      }
    }
  };

  return GroupJob;
}(PaintJob);

var GroupEndJob = /*#__PURE__*/function (_PaintJob) {
  _inheritsLoose(GroupEndJob, _PaintJob);

  function GroupEndJob(node) {
    var _this;

    _this = _PaintJob.call(this, node) || this;
    _this.name = "GroupEndJob";
    return _this;
  }

  var _proto = GroupEndJob.prototype;

  _proto.paint = function paint() {
    var frm = this.node.frame;

    if (this.node.needsDraw) {
      var canvas = this.popCanvas();

      if (canvas) {
        var origContext = canvas.getContext("2d");
        origContext.drawImage(this.node.cache, frm.x, frm.y);
        this.canvas = canvas;
      }
    } else {
      var _canvas = this.canvas;

      if (_canvas && this.node.cache) {
        var ctx = _canvas.getContext("2d");

        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(this.node.cache, frm.x, frm.y);
      }
    }
  };

  return GroupEndJob;
}(PaintJob);

function buildPaintJobs(node) {
  var jobs = [];

  if (node.needsDraw) {
    switch (node.name) {
      case "layer":
      case "pklayer":
        jobs.push(new LayerJob(node));
        break;

      case "frame":
      case "pkframe":
        jobs.push(new FrameJob(node));
        break;

      case "Group":
      case "group":
      case "pkgroup":
        jobs.push(new GroupJob(node));
        break;

      case "Rectangle":
      case "rect":
      case "pkrect":
      case "rectangle":
      case "pkrectangle":
        jobs.push(new RectangleJob(node));
        break;

      case "string":
      case "pkstring":
      case "text":
      case "pktext":
        jobs.push(new TextJob(node));
        break;

      case "Circle":
      case "circle":
      case "pkcircle":
        jobs.push(new CircleJob(node));
        break;

      case "Path":
      case "path":
      case "pkpath":
        jobs.push(new PathJob(node));
        break;

      case "Polygon":
      case "polygon":
      case "pkpolygon":
        jobs.push(new PolygonJob(node));
        break;
    }

    for (var _iterator = _createForOfIteratorHelperLoose(node.children), _step; !(_step = _iterator()).done;) {
      var child = _step.value;
      jobs = jobs.concat(buildPaintJobs(child));
    }

    switch (node.name) {
      case "layer":
      case "pklayer":
        jobs.push(new LayerEndJob(node));
        break;

      case "frame":
      case "pkframe":
        jobs.push(new FrameEndJob(node));
        break;

      case "Group":
      case "group":
      case "pkgroup":
        jobs.push(new GroupEndJob(node));
        break;
    }
  } else {
    switch (node.name) {
      case "Group":
      case "group":
      case "pkgroup":
        jobs.push(new GroupEndJob(node));
        break;
    }
  }

  return jobs;
}

var queue = [];
function paint(node) {
  if (queue.length === 0) {
    queue = buildPaintJobs(node);
    paintLoop();
  }
}
function paintLoop() {
  var job = null;

  while (queue.length > 0) {
    job = queue.shift();

    if (job) {
      job.doPainting();
    }
  }
}

var StateManager = /*#__PURE__*/function () {
  function StateManager() {
    var _this = this;

    this.AUTO_LOOP = true;
    this.paintCount = 0;
    this.size = mkSize(10, 10);
    this._nodeFrame = mkRect(0, 0, 10, 10);
    this._root = null;
    this._node = null;
    this.currentRoot = null;
    this.unitsOfWork = [];
    this.isRunning = false;
    this.hasUpdateBeenRequested = false;
    this.stepCallbackId = null;
    this.hookIndex = 0;
    this.step = this.step.bind(this);

    if (this.AUTO_LOOP === false) {
      var onKeyUp = function onKeyUp(e) {
        if (e.key === " ") {
          _this.requestRootUpdate();

          var deadline = performance.now() + 16;

          _this.step({
            timeRemaining: function timeRemaining() {
              return deadline - performance.now();
            },
            didTimeout: false
          });
        }
      };

      document.addEventListener("keyup", onKeyUp);
    }
  }

  var _proto = StateManager.prototype;

  _proto.setRoot = function setRoot(fn) {
    this._root = {
      name: "root",
      type: fn,
      props: {},
      children: [],
      alternate: null,
      hooks: [],
      needsDraw: false,
      cache: null,
      frame: mkRect(0, 0, this.size.width, this.size.height)
    };
    this.unitsOfWork.push(this._root);
  };

  _proto.start = function start() {
    var _this2 = this;

    if (!this.isRunning) {
      if (window.requestIdleCallback != null) {
        this.stepCallbackId = requestIdleCallback(this.step);
      } else {
        setTimeout(function () {
          _this2.step({
            timeRemaining: function timeRemaining() {
              return 16;
            },
            didTimeout: false
          });
        }, 10);
      }

      this.isRunning = true;
    }
  };

  _proto.stop = function stop() {
    this.isRunning = false;

    if (this.stepCallbackId) {
      cancelIdleCallback(this.stepCallbackId);
      this.stepCallbackId = null;
    }
  };

  _proto.step = function step(deadline) {
    var _this3 = this;

    var start = performance.now();

    if (this.currentRoot) {
      this.workTimerHooks(this.currentRoot);
    }

    if (this.unitsOfWork.length === 0 && this.hasUpdateBeenRequested) {
      this.startRootUpdate();
    }

    while (this.unitsOfWork.length > 0 && deadline.timeRemaining() > 2) {
      this.performNextUnitOfWork();
    }

    if (this.unitsOfWork.length === 0 && this._root != null) {
      this.resolveIntrinsicFrames(this._root, null);
      this.resolveCalculatedFrames(this._root, null);
      this.workLayoutHooks(this._root);
      this.commitRoot();
    }

    if (this.unitsOfWork.length === 0 && this._root === null) {
      if (this.currentRoot) {
        this.workEffectHooks(this.currentRoot);
      }
    }

    if (this.stepCallbackId) {
      cancelIdleCallback(this.stepCallbackId);
      this.stepCallbackId = null;
    }

    if (this.isRunning && this.AUTO_LOOP || this.unitsOfWork.length > 0) {
      if (window.requestIdleCallback != null) {
        this.stepCallbackId = requestIdleCallback(this.step);
      } else {
        setTimeout(function () {
          _this3.step({
            timeRemaining: function timeRemaining() {
              return 16;
            },
            didTimeout: false
          });
        }, 10);
      }
    }

    var diff = performance.now() - start;
  };

  _proto.performNextUnitOfWork = function performNextUnitOfWork() {
    var n = this.unitsOfWork.shift();

    if (n) {
      this._node = n;
    } else {
      this._node = null;
    }

    if (this._node) {
      this.workEffectHooks(this._node, false);
      var next = this.updateNode(this._node);

      for (var _iterator = _createForOfIteratorHelperLoose(next), _step; !(_step = _iterator()).done;) {
        var _n = _step.value;
        this.unitsOfWork.push(_n);
      }
    }
  };

  _proto.commitRoot = function commitRoot() {
    this.currentRoot = this._root;
    this._root = null;

    if (this.currentRoot) {
      this.propigateNeedsDraw(this.currentRoot);
      this.paintCount++;
      console.log("StateManager.commitRoot");
      this.debugFrames(this.currentRoot);
      paint(this.currentRoot);
    }
  };

  _proto.resolveCalculatedFrames = function resolveCalculatedFrames(node, parent) {
    if (parent && parent.frame && node.props && node.frame) {
      if (node.name === "fragment") {
        node.frame = _extends({}, parent.frame, {
          x: 0,
          y: 0
        });
      }

      var w = node.props.width;
      var r = node.props.radius;

      if (w && typeof w === "string" && node.props.width.includes("%")) {
        var wp = parseFloat(node.props.width) / 100;
        node.frame.width = parent.frame.width * wp;
      }

      if (!w && r) {
        if (r && typeof r === "string" && r.includes("%")) {
          var rp = parseFloat(r) / 100;
          node.frame.width = parent.frame.width * rp * 2;
        } else {
          node.frame.width = parseFloat(r) * 2;
        }
      }

      var h = node.props.height;

      if (h && typeof h === "string" && node.props.height.includes("%")) {
        var hp = parseFloat(node.props.height) / 100;
        node.frame.height = parent.frame.height * hp;
      }

      var x = node.props.x;

      if (x && typeof x === "string" && x.includes("%")) {
        var xp = parseFloat(node.props.x) / 100;
        var xPos = parent.frame.width * xp;
        node.frame.x = xPos;
      }

      var y = node.props.y;

      if (y && typeof y === "string" && y.includes("%")) {
        var yp = parseFloat(node.props.y) / 100;
        var yPos = parent.frame.height * yp;
        node.frame.y = yPos;
      }

      node.frame.x = node.frame.x + parent.frame.x;
      node.frame.y = node.frame.y + parent.frame.y;
    }

    for (var _iterator2 = _createForOfIteratorHelperLoose(node.children), _step2; !(_step2 = _iterator2()).done;) {
      var child = _step2.value;
      this.resolveCalculatedFrames(child, node);
    }
  };

  _proto.resolveIntrinsicFrames = function resolveIntrinsicFrames(node, parent) {
    for (var _iterator3 = _createForOfIteratorHelperLoose(node.children), _step3; !(_step3 = _iterator3()).done;) {
      var child = _step3.value;
      this.resolveIntrinsicFrames(child, node);
    }

    var frame = mkRect(0, 0, 0, 0);

    if (node.props.x) {
      frame.x = parseFloat(node.props.x);
    }

    if (node.props.y) {
      frame.y = parseFloat(node.props.y);
    }

    frame.width = this.resolveWidth(node);
    frame.height = this.resolveHeight(node);
    node.frame = frame;
  };

  _proto.resolveWidth = function resolveWidth(node) {
    var w = 0;

    if (node.frame && node.frame.width) {
      w = node.frame.width;
    } else if (node.props.width) {
      w = parseFloat(node.props.width);
    } else if (node.props._intrinsicWidth) {
      w = parseFloat(node.props._intrinsicWidth);
    } else {
      for (var _iterator4 = _createForOfIteratorHelperLoose(node.children), _step4; !(_step4 = _iterator4()).done;) {
        var child = _step4.value;
        w = Math.max(w, this.resolveWidth(child));
      }
    }

    return w;
  };

  _proto.resolveHeight = function resolveHeight(node) {
    var h = 0;

    if (node.frame && node.frame.height) {
      h = node.frame.height;
    } else if (node.props.height) {
      h = parseFloat(node.props.height);
    } else if (node.props._intrinsicHeight) {
      h = parseFloat(node.props._intrinsicHeight);
    } else {
      for (var _iterator5 = _createForOfIteratorHelperLoose(node.children), _step5; !(_step5 = _iterator5()).done;) {
        var child = _step5.value;
        h = Math.max(h, this.resolveHeight(child));
      }
    }

    return h;
  };

  _proto.debugFrames = function debugFrames(node, depth) {
    if (depth === void 0) {
      depth = 0;
    }

    var indent = "".padEnd(depth * 4, " ");

    if (node.frame) {
      console.log(indent, node.name, "x:", node.frame.x, ", y:", node.frame.y, "- w:", node.frame.width, ", h:", node.frame.height);
    } else {
      console.log(indent, node.name, "no-frame", node);
    }

    for (var _iterator6 = _createForOfIteratorHelperLoose(node.children), _step6; !(_step6 = _iterator6()).done;) {
      var child = _step6.value;
      this.debugFrames(child, depth + 1);
    }
  };

  _proto.requestRootUpdate = function requestRootUpdate() {
    this.hasUpdateBeenRequested = true;
  };

  _proto.startRootUpdate = function startRootUpdate() {
    this.hasUpdateBeenRequested = false;

    if (this.currentRoot) {
      this._nodeFrame = mkRect(0, 0, this.size.width, this.size.height);
      this._root = {
        name: "root",
        type: this.currentRoot.type,
        props: _extends({}, this.currentRoot.props, {
          width: this.size.width,
          height: this.size.height
        }),
        children: this.currentRoot.children,
        alternate: minifyNode(this.currentRoot),
        hooks: this.currentRoot.hooks,
        needsDraw: false,
        cache: null,
        frame: null
      };
    }

    if (this._root) {
      this.unitsOfWork = [this._root];
    }
  };

  _proto.workTimerHooks = function workTimerHooks(node) {
    for (var _iterator7 = _createForOfIteratorHelperLoose(node.children), _step7; !(_step7 = _iterator7()).done;) {
      var child = _step7.value;
      this.workTimerHooks(child);
    }

    for (var _iterator8 = _createForOfIteratorHelperLoose(node.hooks), _step8; !(_step8 = _iterator8()).done;) {
      var hook = _step8.value;

      for (var _iterator9 = _createForOfIteratorHelperLoose(hook.pendingTicks), _step9; !(_step9 = _iterator9()).done;) {
        var action = _step9.value;
        action();
      }

      hook.pendingTicks = [];
    }
  };

  _proto.workEffectHooks = function workEffectHooks(node, includeChildren) {
    if (includeChildren === void 0) {
      includeChildren = true;
    }

    if (includeChildren) {
      for (var _iterator10 = _createForOfIteratorHelperLoose(node.children), _step10; !(_step10 = _iterator10()).done;) {
        var child = _step10.value;
        this.workEffectHooks(child);
      }
    }

    for (var _iterator11 = _createForOfIteratorHelperLoose(node.hooks), _step11; !(_step11 = _iterator11()).done;) {
      var hook = _step11.value;

      for (var _iterator12 = _createForOfIteratorHelperLoose(hook.pendingEffects), _step12; !(_step12 = _iterator12()).done;) {
        var action = _step12.value;
        var unmount = hook.queue.pop();

        if (unmount) {
          unmount();
        }

        var cb = action();

        if (cb) {
          hook.queue.push(cb);
        }
      }

      hook.pendingEffects = [];
    }
  };

  _proto.workLayoutHooks = function workLayoutHooks(node) {
    for (var _iterator13 = _createForOfIteratorHelperLoose(node.children), _step13; !(_step13 = _iterator13()).done;) {
      var child = _step13.value;
      this.workLayoutHooks(child);
    }

    this._node = node;

    for (var _iterator14 = _createForOfIteratorHelperLoose(node.hooks), _step14; !(_step14 = _iterator14()).done;) {
      var hook = _step14.value;

      for (var _iterator15 = _createForOfIteratorHelperLoose(hook.pendingLayout), _step15; !(_step15 = _iterator15()).done;) {
        var action = _step15.value;
        action();
      }

      hook.pendingLayout = [];
    }

    this._node = null;
  };

  _proto.updateNode = function updateNode(node) {
    if (!node.alternate) {
      node.needsDraw = true;
    }

    var prevChildren = [];

    if (node.type instanceof Function) {
      this.hookIndex = 0;
      node.hooks = [];

      if (node.alternate) {
        prevChildren = node.alternate.children;
      } else if (node.children) {
        prevChildren = node.children;
      }

      var f = node.type;
      node.children = [f(node.props, node.children)];
    } else {
      prevChildren = node.alternate ? node.alternate.children : [];
    }

    var nextChildren = flattenChildren(node.children);
    var childDiff = this.diffChildren(nextChildren, prevChildren);
    node.children = childDiff.children;
    return node.children;
  };

  _proto.propigateNeedsDraw = function propigateNeedsDraw(parent, inherited) {
    if (inherited === void 0) {
      inherited = false;
    }

    var needsDraw = parent.needsDraw || inherited && !["pklayer", "layer", "group", "pkgroup"].includes(parent.name);

    for (var _iterator16 = _createForOfIteratorHelperLoose(parent.children), _step16; !(_step16 = _iterator16()).done;) {
      var _child = _step16.value;
      needsDraw = needsDraw || this.propigateNeedsDraw(_child, needsDraw);
    }

    if (needsDraw) {
      for (var _iterator17 = _createForOfIteratorHelperLoose(parent.children), _step17; !(_step17 = _iterator17()).done;) {
        var child = _step17.value;
        this.propigateNeedsDraw(child, true);
      }
    }

    parent.needsDraw = needsDraw;
    return needsDraw;
  };

  _proto.diffChildren = function diffChildren(nextChildren, prevChildren) {
    var children = [];
    var removed = [];
    var length = Math.max(nextChildren.length, prevChildren.length);

    for (var i = 0; i < length; i++) {
      var next = nextChildren[i];
      var prev = prevChildren[i];
      var nextNode = this.diffNode(next, prev);

      if (nextNode) {
        children.push(nextNode);
      }

      if (prev) {
        if (!nextNode) {
          removed.push(prev);
        }
      }
    }

    return {
      children: children,
      removed: removed
    };
  };

  _proto.diffNode = function diffNode(a, b) {
    var next = null;
    var sameType = false;

    if (!!a && !!b) {
      sameType = a.type == b.type;
    }

    if (a && b && sameType) {
      var needsDraw = false;

      if (havePropsChanged(a.props, b.props)) {
        needsDraw = true;
      }

      next = {
        name: a.name,
        type: a.type,
        props: a.props,
        children: a.children,
        needsDraw: needsDraw,
        hooks: b.hooks,
        cache: b.cache,
        alternate: minifyNode(b),
        frame: b.frame
      };
    } else if (a && !sameType) {
      next = {
        name: a.name,
        type: a.type,
        props: a.props,
        children: a.children,
        alternate: null,
        needsDraw: true,
        hooks: [],
        cache: null,
        frame: a.frame
      };
    } else {
      console.error("diffNode", a, b, sameType);
    }

    return next;
  };

  _createClass(StateManager, [{
    key: "root",
    get: function get() {
      return this._root;
    }
  }, {
    key: "node",
    get: function get() {
      return this._node;
    },
    set: function set(val) {
      this._node = val;
    }
  }]);

  return StateManager;
}();

var Supervisor = /*#__PURE__*/function () {
  function Supervisor() {
    this.canvases = [];
    this.stateManager = new StateManager();
  }

  var _proto = Supervisor.prototype;

  _proto.addLayer = function addLayer(layer) {
    this.stateManager.setRoot(layer.child);
    this.canvases = layer.canvases;
  };

  _proto.start = function start() {
    var _this$activeLayer;

    (_this$activeLayer = this.activeLayer) === null || _this$activeLayer === void 0 ? void 0 : _this$activeLayer.start();
  };

  _proto.stop = function stop() {};

  _createClass(Supervisor, [{
    key: "currentContext",
    get: function get() {
      return this.stateManager;
    }
  }, {
    key: "activeLayer",
    get: function get() {
      return this.stateManager;
    }
  }]);

  return Supervisor;
}();
var sharedSupervisor = new Supervisor();
function getSharedSupervisor() {
  return sharedSupervisor;
}

var PinkKoala = function PinkKoala(props) {
  var containerRef = React.useRef(null);
  React.useEffect(function () {
    if (containerRef.current) {
      var canvasNodes = containerRef.current.querySelectorAll("canvas");
      var canvases = Array.from(canvasNodes).map(function (node) {
        return node;
      });
      var sup = getSharedSupervisor();
      sup.addLayer({
        child: props.drawing,
        canvases: canvases
      });
      sup.stateManager.size = props.size;
      sup.start();
    }
  }, [props.drawing, containerRef, props.size]);
  return React__default.createElement("div", {
    ref: containerRef,
    className: "PinkKoala"
  }, props.layers.map(function (layer) {
    return React__default.createElement("canvas", {
      key: layer,
      id: layer,
      width: props.size.width,
      height: props.size.height
    });
  }));
};

function haveArgsChanged(a, b) {
  if (!a && !b) {
    return false;
  }

  if (!a && b || !b && a) {
    return true;
  }

  if (a.length !== b.length) {
    return true;
  }

  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return true;
    }
  }

  return false;
}

function invokeOrReturn(arg, f) {
  return typeof f == "function" ? f(arg) : f;
}

function getHookState() {
  var hook = null;
  var context = getSharedSupervisor().currentContext;

  if (context) {
    if (context.node) {
      hook = context.node.alternate && context.node.alternate.hooks && context.node.alternate.hooks[context.hookIndex];
    }
  }

  return {
    context: context,
    prevHook: hook
  };
}

function useEffect(callback, args) {
  var hookState = getHookState();
  var prevHook = hookState.prevHook;
  var context = hookState.context;

  if (!context || !context.node) {
    throw new Error("useReducer must be called from within a render function");
  }

  var hook = createHook();

  if (prevHook) {
    hook.state = prevHook.state;
    hook.queue = prevHook.queue;
  }

  if (haveArgsChanged(args, prevHook === null || prevHook === void 0 ? void 0 : prevHook.state)) {
    hook.pendingEffects.push(callback);
    hook.state = args;
  }

  context.node.hooks.push(hook);
  context.hookIndex++;
}

function useEventListener(event, handler, args) {
  useEffect(function () {
    document.addEventListener(event, handler);
    return function () {
      document.removeEventListener(event, handler);
    };
  }, [].concat(args, [event, handler]));
}

function useReducer(reducer, initialState, init) {
  if (init === void 0) {
    init = null;
  }

  var hookState = getHookState();
  var prevHook = hookState.prevHook;
  var context = hookState.context;

  if (!context || !context.node) {
    throw new Error("useReducer must be called from within a render function");
  }

  var hook = createHook();

  if (init) {
    hook.state = init(initialState);
  } else {
    hook.state = prevHook ? prevHook.state : invokeOrReturn(undefined, initialState);
  }

  var actions = prevHook ? prevHook.queue : [];

  for (var _iterator = _createForOfIteratorHelperLoose(actions), _step; !(_step = _iterator()).done;) {
    var action = _step.value;
    hook.state = reducer(hook.state, action);
  }

  if (prevHook) {
    prevHook.queue = [];
  }

  var dispatch = function dispatch(action) {
    hook.queue.push(action);
    context === null || context === void 0 ? void 0 : context.requestRootUpdate();
  };

  context.node.hooks.push(hook);
  context.hookIndex++;
  return [hook.state, dispatch];
}

function useState(initialState) {
  return useReducer(invokeOrReturn, initialState);
}

function useTicker(callback) {
  var hookState = getHookState();
  var prevHook = hookState.prevHook;
  var context = hookState.context;

  if (!context || !context.node) {
    throw new Error("useTicker must be called from within a render function");
  }

  var hook = createHook();
  hook.state = prevHook ? prevHook.state : {
    now: -1,
    delta: -1
  };

  var onTick = function onTick() {
    var now = Date.now();
    var delta = -1;

    if (prevHook && prevHook.state.lastTick > 0) {
      delta = now - prevHook.state.lastTick;
    }

    hook.state = {
      lastTick: now,
      delta: delta
    };
    callback(now, delta);
    return null;
  };

  hook.pendingTicks.push(onTick);
  context.node.hooks.push(hook);
  context.hookIndex++;
}

function useRenderContext() {
  var _getHookState = getHookState(),
      context = _getHookState.context;

  var value = {
    rootWidth: 0,
    rootHeight: 0,
    nodeRef: null
  };

  if (context) {
    value = {
      rootWidth: context.size.width,
      rootHeight: context.size.height,
      nodeRef: context.node
    };
  }

  return value;
}

function useLayoutEffect(callback, args) {
  var hookState = getHookState();
  var prevHook = hookState.prevHook;
  var context = hookState.context;

  if (!context || !context.node) {
    throw new Error("useLayoutEffect must be called from within a render function");
  }

  var hook = createHook();

  if (prevHook) {
    hook.state = prevHook.state;
    hook.queue = prevHook.queue;
  }

  if (haveArgsChanged(args, prevHook === null || prevHook === void 0 ? void 0 : prevHook.state)) {
    hook.pendingLayout.push(callback);
    hook.state = args;
  }

  context.node.hooks.push(hook);
  context.hookIndex++;
}

var Layer = function Layer(props, children) {
  var _useRenderContext = useRenderContext(),
      rootWidth = _useRenderContext.rootWidth,
      rootHeight = _useRenderContext.rootHeight;

  var attr = _extends({}, props, {
    width: rootWidth,
    height: rootHeight
  });

  return createElement("pklayer", Object.assign({}, attr), children);
};

var Rectangle = function Rectangle(props, children) {
  if (children && children.length > 0) {
    return createElement(Fragment, null, children);
  } else {
    return null;
  }
};

var Circle = function Circle(props, children) {
  if (children && children.length > 0) {
    return createElement(Fragment, null, children);
  } else {
    return null;
  }
};

var fontCanvas = document.createElement("canvas");
var fontCtx = fontCanvas.getContext("2d");
var Text = function Text(props, children) {
  var attr = _extends({}, props, {
    text: ""
  });

  var text = "";

  if (children && children.length > 0) {
    text = children.join(" ");
  }

  attr.text = text;

  if (props.font) {
    fontCtx.textBaseline = "top";
    fontCtx.font = props.font;
    var size = fontCtx.measureText(text || "");

    if (size) {
      attr._intrinsicWidth = size.width;
      attr._intrinsicHeight = size.fontBoundingBoxDescent - size.fontBoundingBoxAscent;
    }
  }

  return createElement("pktext", Object.assign({}, attr));
};

function translateFrame(node, x, y) {
  if (node.frame) {
    node.frame.x += x;
    node.frame.y += y;
  }

  for (var _iterator = _createForOfIteratorHelperLoose(node.children), _step; !(_step = _iterator()).done;) {
    var child = _step.value;
    translateFrame(child, x, y);
  }
}

function Row(props, children) {
  console.log("Row.props", props);
  console.log("Row.children", children);
  var justifyContent = props.justifyContent ? props.justifyContent : "start";
  var alignItems = props.alignItems ? props.alignItems : "start";
  useLayoutEffect(function () {
    var _useRenderContext = useRenderContext(),
        nodeRef = _useRenderContext.nodeRef;

    if (nodeRef) {
      var x = nodeRef.frame.x;
      var y = nodeRef.frame.y;
      var width = null;

      if (props.width) {
        width = nodeRef.frame.width;
      }

      var height = null;

      if (props.height) {
        height = nodeRef.frame.height;
      }

      var refChildren = nodeRef.children[0].children;
      var childPadding = 0;
      var childWidth = 0;
      var childHeight = 0;
      var flexCount = 0;
      var flexibileWidth = width ? width : 0;

      for (var _iterator = _createForOfIteratorHelperLoose(refChildren), _step; !(_step = _iterator()).done;) {
        var child = _step.value;

        if (child.props.flex) {
          try {
            var flexNum = parseInt(child.props.flex, 10);
            flexCount += flexNum;
          } catch (e) {
            console.warn(e);
          }
        } else if (child.frame) {
          flexibileWidth -= child.frame.width;
        }
      }

      for (var _iterator2 = _createForOfIteratorHelperLoose(refChildren), _step2; !(_step2 = _iterator2()).done;) {
        var _child = _step2.value;
        console.log("Row.useLayoutEffect start", _child.name, _child.frame);

        if (_child.frame && _child.props.flex && width) {
          try {
            var _flexNum = parseInt(_child.props.flex, 10);

            var flexRatio = _flexNum / flexCount;
            _child.frame.width = flexRatio * flexibileWidth;
            console.log("Row: flex width", _child.name, _child.frame.width, flexRatio);
            childWidth += _child.frame.width;
          } catch (e) {
            console.warn(e);
          }
        }

        if (_child.frame) {
          childWidth += _child.frame.width;
          childHeight = Math.max(childHeight, _child.frame.height);
        } else {
          console.warn("Row: child has no frame", _child);
        }
      }

      if (width === null) {
        width = childWidth;
        nodeRef.frame.width = width;
      }

      nodeRef.children[0].frame.width = width;

      if (height === null) {
        height = childHeight;
        nodeRef.frame.height = height;
      }

      nodeRef.children[0].frame.height = height;

      switch (justifyContent) {
        case "flex-start":
        case "start":
          break;

        case "flex-end":
        case "end":
          x = x + width - childWidth;
          break;

        case "center":
          x = x + (width - childWidth) / 2;
          break;

        case "space-between":
          childPadding = (width - childWidth) / (children.length - 1);
          break;

        case "space-around":
          childPadding = (width - childWidth) / 2;
          break;

        case "space-evenly":
          childPadding = (width - childWidth) / (children.length + 1);
          break;
      }

      for (var _iterator3 = _createForOfIteratorHelperLoose(refChildren), _step3; !(_step3 = _iterator3()).done;) {
        var _child2 = _step3.value;

        if (!_child2.frame) {
          _child2.frame = mkRect(0, 0, 0, 0);
          console.error("Row: child has no frame", _child2);
        }

        var cy = y;
        var ch = _child2.frame.height;

        switch (alignItems) {
          case "flex-start":
          case "start":
            break;

          case "flex-end":
          case "end":
            cy = y + height - _child2.frame.height;
            break;

          case "center":
          case "baseline":
            cy = y + (height - _child2.frame.height) / 2;
            break;

          case "stretch":
            ch = height;
            break;
        }

        translateFrame(_child2, x, cy);
        _child2.frame.height = ch;
        console.log("Row.useLayoutEffect end", _child2.name, _child2.frame);
        x += _child2.frame.width;
        x += childPadding;
      }
    }
  }, [children, justifyContent, alignItems]);
  return createElement(Fragment, null, children);
}

function Column(props, children) {
  console.log("Column.props", props);
  console.log("Column.children", children);
  var justifyContent = props.justifyContent ? props.justifyContent : "start";
  var alignItems = props.alignItems ? props.alignItems : "start";
  useLayoutEffect(function () {
    var _useRenderContext = useRenderContext(),
        nodeRef = _useRenderContext.nodeRef;

    if (nodeRef) {
      var x = nodeRef.frame.x;
      var y = nodeRef.frame.y;
      var width = null;

      if (props.width) {
        width = nodeRef.frame.width;
      }

      var height = null;

      if (props.height) {
        height = nodeRef.frame.height;
      }

      var refChildren = nodeRef.children[0].children;
      var childPadding = 0;
      var childWidth = 0;
      var childHeight = 0;
      var flexCount = 0;
      var flexibleHight = height ? height : 0;

      for (var _iterator = _createForOfIteratorHelperLoose(refChildren), _step; !(_step = _iterator()).done;) {
        var child = _step.value;

        if (child.props.flex) {
          try {
            var flexNum = parseInt(child.props.flex, 10);
            flexCount += flexNum;
          } catch (e) {
            console.warn(e);
          }
        } else if (child.frame) {
          flexibleHight -= child.frame.height;
        }
      }

      for (var _iterator2 = _createForOfIteratorHelperLoose(refChildren), _step2; !(_step2 = _iterator2()).done;) {
        var _child = _step2.value;
        console.log("Column.useLayoutEffect start", _child.name, _child.frame);

        if (_child.frame && _child.props.flex && height) {
          try {
            var _flexNum = parseInt(_child.props.flex, 10);

            var flexRatio = _flexNum / flexCount;
            _child.frame.height = flexRatio * flexibleHight;
            console.log("Column: flex height", _child.name, _child.frame.height, flexRatio);
            childHeight += _child.frame.height;
            childWidth = Math.max(childWidth, _child.frame.width);
          } catch (e) {
            console.warn(e);
          }
        } else if (_child.frame) {
          childHeight += _child.frame.height;
          childWidth = Math.max(childWidth, _child.frame.width);
        } else {
          console.error("Column: child has no frame", _child);
        }
      }

      if (width === null) {
        width = childWidth;
        nodeRef.frame.width = width;
      }

      nodeRef.children[0].frame.width = width;

      if (height === null) {
        height = childHeight;
        nodeRef.frame.height = height;
      }

      nodeRef.children[0].frame.height = height;

      switch (justifyContent) {
        case "flex-start":
        case "start":
          break;

        case "flex-end":
        case "end":
          y = y + height - childHeight;
          break;

        case "center":
          y = y + (height - childHeight) / 2;
          break;

        case "space-between":
          childPadding = (height - childHeight) / (children.length - 1);
          break;

        case "space-around":
          childPadding = (height - childHeight) / 2;
          break;

        case "space-evenly":
          childPadding = (height - childHeight) / (children.length + 1);
          break;
      }

      for (var _iterator3 = _createForOfIteratorHelperLoose(refChildren), _step3; !(_step3 = _iterator3()).done;) {
        var _child2 = _step3.value;

        if (!_child2.frame) {
          _child2.frame = mkRect(0, 0, 0, 0);
          console.error("Column: child has no frame", _child2);
        }

        var cx = x;
        var cw = _child2.frame.width;

        switch (alignItems) {
          case "flex-start":
          case "start":
            break;

          case "flex-end":
          case "end":
            cx = x + width - _child2.frame.width;
            break;

          case "center":
          case "baseline":
            cx = x + (width - _child2.frame.width) / 2;
            break;

          case "stretch":
            cw = width;
            break;
        }

        translateFrame(_child2, cx, y);
        _child2.frame.width = cw;
        console.log("Column.useLayoutEffect end", _child2.name, _child2.frame);
        y += _child2.frame.height;
        y += childPadding;
      }
    }
  }, [children, justifyContent, alignItems]);
  return createElement(Fragment, null, children);
}

var Polygon = function Polygon(props, children) {
  if (children && children.length > 0) {
    return createElement(Fragment, null, children);
  } else {
    return null;
  }
};

var Path = function Path(props, children) {
  if (children && children.length > 0) {
    return createElement(Fragment, null, children);
  } else {
    return null;
  }
};

var Group = function Group(props, children) {
  if (children && children.length > 0) {
    return createElement(Fragment, null, children);
  } else {
    return null;
  }
};

exports.Circle = Circle;
exports.Column = Column;
exports.Fragment = Fragment;
exports.Group = Group;
exports.Layer = Layer;
exports.Path = Path;
exports.PinkKoala = PinkKoala;
exports.Polygon = Polygon;
exports.Rectangle = Rectangle;
exports.Row = Row;
exports.Supervisor = Supervisor;
exports.Text = Text;
exports.createElement = createElement;
exports.getSharedSupervisor = getSharedSupervisor;
exports.haveArgsChanged = haveArgsChanged;
exports.invokeOrReturn = invokeOrReturn;
exports.mkPoint = mkPoint;
exports.mkRect = mkRect;
exports.mkSize = mkSize;
exports.pointLerp = pointLerp;
exports.rectBottom = rectBottom;
exports.rectCenter = rectCenter;
exports.rectContains = rectContains;
exports.rectIntersects = rectIntersects;
exports.rectLeft = rectLeft;
exports.rectRight = rectRight;
exports.rectTop = rectTop;
exports.useEffect = useEffect;
exports.useEventListener = useEventListener;
exports.useLayoutEffect = useLayoutEffect;
exports.useReducer = useReducer;
exports.useState = useState;
exports.useTicker = useTicker;
//# sourceMappingURL=index.js.map
