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
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  var name = "";

  if (typeof type === "string") {
    name = type;
  } else if (typeof type === "function") {
    name = type.name;
  }

  if (name === "text" || name === "string") {
    if (children.length > 0) {
      props.text = children.join(" ");
      children = [];
    }
  }

  return {
    type: type,
    name: name,
    props: _extends({}, props),
    children: children,
    alternate: null,
    hooks: [],
    needsDraw: false,
    cache: null
  };
}

function flattenChildren(children) {
  var nodes = [];

  if (Array.isArray(children)) {
    for (var _iterator = _createForOfIteratorHelperLoose(children), _step; !(_step = _iterator()).done;) {
      var child = _step.value;

      if (Array.isArray(child)) {
        nodes = nodes.concat(flattenChildren(child));
      } else {
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
    cache: node.cache
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
    var x = parseFloat(this.node.props.x) || 0;
    var y = parseFloat(this.node.props.y) || 0;
    var width = parseFloat(this.node.props.width) || 50;
    var height = parseFloat(this.node.props.height) || 50;

    if (this.canvas) {
      var ctx = this.canvas.getContext("2d");
      var cu = this.updateRenderingContextFromProps(ctx, this.node.props);

      if (cu.hasChanged) {
        ctx.save();
      }

      ctx.beginPath();

      if (cu.shouldFill) {
        ctx.fillRect(x, y, width, height);
      }

      if (cu.shouldStroke) {
        ctx.strokeRect(x, y, width, height);
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
    var x = parseFloat(this.node.props.x) || 0;
    var y = parseFloat(this.node.props.y) || 0;
    var text = this.node.props.text || "Hello World";

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
    var x = parseFloat(this.node.props.x) || 0;
    var y = parseFloat(this.node.props.y) || 0;
    var radius = 50;

    if (this.node.props.radius) {
      radius = parseFloat(this.node.props.radius) || 50;
    } else {
      radius = parseFloat(this.node.props.width) || 50;
      radius = radius / 2;
    }

    if (this.canvas) {
      var ctx = this.canvas.getContext("2d");
      var cu = this.updateRenderingContextFromProps(ctx, this.node.props);

      if (cu.hasChanged) {
        ctx.save();
      }

      ctx.beginPath();
      ctx.ellipse(x + radius, y + radius, radius, radius, 0, 0, 2 * Math.PI);

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
    var _this$node$props$clos;

    var closePath = (_this$node$props$clos = this.node.props.closed) != null ? _this$node$props$clos : false;
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
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
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

function createHook() {
  return {
    state: {},
    queue: [],
    pendingEffects: [],
    pendingTicks: [],
    pendingUnmount: []
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
    var x = parseFloat(this.node.props.x) || 0;
    var y = parseFloat(this.node.props.y) || 0;
    var sides = parseFloat(this.node.props.sides) || 5;
    var radius = 50;

    if (this.node.props.radius) {
      radius = parseFloat(this.node.props.radius) || 25;
    } else {
      radius = parseFloat(this.node.props.width) || 50;
      radius = radius / 2;
    }

    var center = mkPoint(x + radius, y + radius);
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
    if (this.canvas) {
      this.pushCanvas(this.canvas);
      var tmpCanvas = this.node.cache;

      if (!tmpCanvas) {
        tmpCanvas = document.createElement("canvas");
        tmpCanvas.id = "tmp-group-canvas-" + groupId++;
        tmpCanvas.height = this.canvas.height;
        tmpCanvas.width = this.canvas.width;
        this.node.cache = tmpCanvas;
      }

      var tmpContext = tmpCanvas.getContext("2d");

      if (tmpContext) {
        tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
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
    if (this.node.needsDraw) {
      var canvas = this.popCanvas();

      if (canvas) {
        var origContext = canvas.getContext("2d");
        origContext.drawImage(this.node.cache, 0, 0);
        this.canvas = canvas;
      }
    } else {
      var _canvas = this.canvas;

      if (_canvas && this.node.cache) {
        var ctx = _canvas.getContext("2d");

        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(this.node.cache, 0, 0);
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

      case "group":
      case "pkgroup":
        jobs.push(new GroupJob(node));
        break;

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

      case "circle":
      case "pkcircle":
        jobs.push(new CircleJob(node));
        break;

      case "path":
      case "pkpath":
        jobs.push(new PathJob(node));
        break;

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

      case "group":
      case "pkgroup":
        jobs.push(new GroupEndJob(node));
        break;
    }
  } else {
    switch (node.name) {
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
      cache: null
    };
    this.unitsOfWork.push(this._root);
  };

  _proto.start = function start() {
    if (!this.isRunning) {
      this.stepCallbackId = requestIdleCallback(this.step);
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

    if (this.unitsOfWork.length === 0) {
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
      this.stepCallbackId = requestIdleCallback(this.step);
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
      paint(this.currentRoot);
    }
  };

  _proto.requestRootUpdate = function requestRootUpdate() {
    this.hasUpdateBeenRequested = true;
  };

  _proto.startRootUpdate = function startRootUpdate() {
    this.hasUpdateBeenRequested = false;

    if (this.currentRoot) {
      this._root = {
        name: "root",
        type: this.currentRoot.type,
        props: this.currentRoot.props,
        children: this.currentRoot.children,
        alternate: minifyNode(this.currentRoot),
        hooks: this.currentRoot.hooks,
        needsDraw: false,
        cache: null
      };
    }

    if (this._root) {
      this.unitsOfWork = [this._root];
    }
  };

  _proto.workTimerHooks = function workTimerHooks(node) {
    for (var _iterator2 = _createForOfIteratorHelperLoose(node.children), _step2; !(_step2 = _iterator2()).done;) {
      var child = _step2.value;
      this.workTimerHooks(child);
    }

    for (var _iterator3 = _createForOfIteratorHelperLoose(node.hooks), _step3; !(_step3 = _iterator3()).done;) {
      var hook = _step3.value;

      for (var _iterator4 = _createForOfIteratorHelperLoose(hook.pendingTicks), _step4; !(_step4 = _iterator4()).done;) {
        var action = _step4.value;
        action();
      }

      hook.pendingTicks = [];
    }
  };

  _proto.workEffectHooks = function workEffectHooks(node) {
    for (var _iterator5 = _createForOfIteratorHelperLoose(node.children), _step5; !(_step5 = _iterator5()).done;) {
      var child = _step5.value;
      this.workEffectHooks(child);
    }

    for (var _iterator6 = _createForOfIteratorHelperLoose(node.hooks), _step6; !(_step6 = _iterator6()).done;) {
      var hook = _step6.value;

      for (var _iterator7 = _createForOfIteratorHelperLoose(hook.pendingEffects), _step7; !(_step7 = _iterator7()).done;) {
        var action = _step7.value;
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

  _proto.workUmountHooks = function workUmountHooks(node) {
    for (var _iterator8 = _createForOfIteratorHelperLoose(node.children), _step8; !(_step8 = _iterator8()).done;) {
      var child = _step8.value;
      this.workEffectHooks(child);
    }

    for (var _iterator9 = _createForOfIteratorHelperLoose(node.hooks), _step9; !(_step9 = _iterator9()).done;) {
      var hook = _step9.value;

      for (var _iterator10 = _createForOfIteratorHelperLoose(hook.pendingUnmount), _step10; !(_step10 = _iterator10()).done;) {
        var action = _step10.value;
        action();
      }

      hook.pendingUnmount = [];
    }
  };

  _proto.updateNode = function updateNode(node) {
    if (!node.alternate) {
      node.needsDraw = true;
    }

    var prevChildren = [];

    if (node.type instanceof Function) {
      this.hookIndex = 0;
      node.hooks = [];
      prevChildren = node.children;
      var f = node.type;
      node.children = [f(node.props)];
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

    for (var _iterator11 = _createForOfIteratorHelperLoose(parent.children), _step11; !(_step11 = _iterator11()).done;) {
      var _child = _step11.value;
      needsDraw = needsDraw || this.propigateNeedsDraw(_child, needsDraw);
    }

    if (needsDraw) {
      for (var _iterator12 = _createForOfIteratorHelperLoose(parent.children), _step12; !(_step12 = _iterator12()).done;) {
        var child = _step12.value;
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

    if (a && b) {
      sameType = a.type === b.type;
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
        alternate: minifyNode(b)
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
        cache: null
      };
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
      getSharedSupervisor().addLayer({
        child: props.drawing,
        canvases: canvases
      });
      getSharedSupervisor().start();
    }
  }, [props.drawing, containerRef]);
  return React__default.createElement("div", {
    ref: containerRef,
    className: "Drawing"
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
  actions.forEach(function (action) {
    hook.state = reducer(hook.state, action);
  });

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

exports.Fragment = Fragment;
exports.PinkKoala = PinkKoala;
exports.Supervisor = Supervisor;
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
exports.useReducer = useReducer;
exports.useState = useState;
exports.useTicker = useTicker;
//# sourceMappingURL=index.js.map
