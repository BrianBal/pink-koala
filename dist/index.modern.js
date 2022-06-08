import React, { useRef, useEffect as useEffect$1 } from 'react';

var Fragment = "fragment";
function createElement(type, props, ...children) {
  let name = "";

  if (typeof type === "string") {
    name = type;
  } else if (typeof type === "function") {
    name = type.name;
  }

  console.log("createElement", name, props, children);
  return {
    type,
    name,
    props: { ...props
    },
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
    x,
    y
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
    x,
    y,
    width,
    height
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

const mkSize = (width, height) => ({
  width,
  height
});

function flattenChildren(children) {
  let nodes = [];

  if (Array.isArray(children)) {
    for (let child of children) {
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
  const ignoreKeys = ["__source", "__self"];

  if (a === null || b === null) {
    return true;
  }

  for (let key in a) {
    if (ignoreKeys.indexOf(key) === -1) {
      if (Array.isArray(a[key])) {
        if (a[key].length !== b[key].length) {
          return true;
        }

        for (let i = 0; i < a[key].length; i++) {
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
  let mini = {
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
  let children = node.children.map(child => {
    let mini = minifyNode(child);

    if (mini.children.length > 0) {
      mini.children = mini.children.map(grandChild => {
        return minifyNode(grandChild);
      });
    }

    return mini;
  });
  node.children = children;
  return node;
}

let paintContext = {
  canvas: null,
  canvasStack: []
};
class PaintJob {
  constructor(node) {
    this.name = "PaintJob";
    this.node = node;
  }

  doPainting() {
    this.paint();
  }

  paint() {}

  get canvas() {
    return paintContext.canvas;
  }

  set canvas(val) {
    paintContext.canvas = val;
  }

  get paintingContext() {
    return paintContext;
  }

  pushCanvas(canvas) {
    paintContext.canvasStack.push(canvas);
  }

  popCanvas() {
    let c = paintContext.canvasStack.pop();

    if (c) {
      return c;
    } else {
      return null;
    }
  }

  updateRenderingContextFromProps(ctx, props) {
    let hasChanged = false;
    let shouldFill = false;
    let shouldStroke = false;
    const map = {
      fill: "fillStyle",
      stroke: "strokeStyle",
      strokeWidth: "lineWidth",
      font: "font"
    };

    for (let key in map) {
      let ctxKey = map[key];

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
      hasChanged,
      shouldFill,
      shouldStroke
    };
  }

}

function getCanvas(id) {
  let sup = getSharedSupervisor();
  const canvases = sup.canvases;
  const canvas = canvases.find(c => c.id === id);
  return canvas;
}

let canvasId = 0;
class LayerJob extends PaintJob {
  constructor(node) {
    super(node);
    this.name = "LayerJob";
  }

  paint() {
    let canvas = getCanvas(this.node.props.id);

    if (canvas) {
      let tmpCanvas = this.node.cache;

      if (!tmpCanvas) {
        tmpCanvas = document.createElement("canvas");
        tmpCanvas.id = `tmp-layer-canvas-${canvasId++}`;
        tmpCanvas.height = canvas.height;
        tmpCanvas.width = canvas.width;
        this.node.cache = tmpCanvas;
      }

      let tmpContext = tmpCanvas.getContext("2d");

      if (tmpContext) {
        tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
        this.canvas = tmpCanvas;
      }
    }
  }

}

class LayerEndJob extends PaintJob {
  constructor(node) {
    super(node);
    this.name = "LayerEndJob";
  }

  paint() {
    let canvas = getCanvas(this.node.props.id);

    if (canvas) {
      let origContext = canvas.getContext("2d");
      origContext.clearRect(0, 0, canvas.width, canvas.height);
      origContext.drawImage(this.node.cache, 0, 0);
      this.canvas = canvas;
    }
  }

}

class RectangleJob extends PaintJob {
  constructor(node) {
    super(node);
    this.name = "RectangleJob";
  }

  paint() {
    let frm = this.node.frame;

    if (this.canvas) {
      let ctx = this.canvas.getContext("2d");
      let cu = this.updateRenderingContextFromProps(ctx, this.node.props);

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
  }

}

class TextJob extends PaintJob {
  constructor(node) {
    super(node);
    this.name = "TextJob";
  }

  paint() {
    let x = this.node.frame.x;
    let y = this.node.frame.y;
    let text = this.node.props.text || "";

    if (this.canvas) {
      let ctx = this.canvas.getContext("2d");
      let cu = this.updateRenderingContextFromProps(ctx, this.node.props);

      if (cu.hasChanged) {
        ctx.save();
      }

      ctx.beginPath();
      let tm = ctx.measureText(text);
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
  }

}

class CircleJob extends PaintJob {
  constructor(node) {
    super(node);
    this.name = "CircleJob";
  }

  paint() {
    let frm = this.node.frame;
    let radius = frm.width / 2;

    if (this.canvas) {
      let ctx = this.canvas.getContext("2d");
      let cu = this.updateRenderingContextFromProps(ctx, this.node.props);

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
  }

}

class PathJob extends PaintJob {
  constructor(node) {
    super(node);
    this.name = "PathJob";
  }

  paint() {
    let frm = this.node.frame;
    let closePath = this.node.props.closed ? this.node.props.closed : false;
    let path = this.node.props.path || [];

    if (this.canvas) {
      let ctx = this.canvas.getContext("2d");
      let cu = this.updateRenderingContextFromProps(ctx, this.node.props);

      if (cu.hasChanged) {
        ctx.save();
      }

      ctx.beginPath();
      let i = 0;

      for (let pt of path) {
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
  }

}

class PolygonJob extends PaintJob {
  constructor(node) {
    super(node);
    this.name = "PolygonJob";
  }

  paint() {
    let frm = this.node.frame;
    let radius = frm.width / 2;
    let sides = parseFloat(this.node.props.sides) || 5;
    let center = mkPoint(frm.x + radius, frm.y + radius);
    let angle = Math.PI * 2 / sides;
    let path = [];

    for (let i = 0; i < sides; i++) {
      let pt = pointAt(center, angle * i, radius);
      path.push(pt);
    }

    if (this.canvas) {
      let ctx = this.canvas.getContext("2d");
      let cu = this.updateRenderingContextFromProps(ctx, this.node.props);

      if (cu.hasChanged) {
        ctx.save();
      }

      ctx.beginPath();
      let i = 0;

      for (let pt of path) {
        if (i === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }

        if (i === path.length - 1) {
          ctx.closePath();
        }

        i++;
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
  }

}

class FrameJob extends PaintJob {
  constructor(node) {
    super(node);
    this.name = "FrameJob";
  }

  paint() {
    console.log("Frame Job", this.node);
  }

}

class FrameEndJob extends PaintJob {
  constructor(node) {
    super(node);
    this.name = "FrameEndJob";
  }

  paint() {
    console.log("FrameEnd Job", this.node);
  }

}

let groupId = 0;
class GroupJob extends PaintJob {
  constructor(node) {
    super(node);
    this.name = "GroupJob";
  }

  paint() {
    let frm = this.node.frame;

    if (this.canvas) {
      this.pushCanvas(this.canvas);
      let tmpCanvas = this.node.cache;

      if (!tmpCanvas) {
        tmpCanvas = document.createElement("canvas");
        tmpCanvas.id = `tmp-group-canvas-${groupId++}`;
        tmpCanvas.height = frm.height;
        tmpCanvas.width = frm.width;
        this.node.cache = tmpCanvas;
      }

      let tmpContext = tmpCanvas.getContext("2d");

      if (tmpContext) {
        tmpContext.clearRect(frm.x, frm.y, frm.width, frm.height);
        this.canvas = tmpCanvas;
      }
    }
  }

}

class GroupEndJob extends PaintJob {
  constructor(node) {
    super(node);
    this.name = "GroupEndJob";
  }

  paint() {
    let frm = this.node.frame;

    if (this.node.needsDraw) {
      let canvas = this.popCanvas();

      if (canvas) {
        let origContext = canvas.getContext("2d");
        origContext.drawImage(this.node.cache, frm.x, frm.y);
        this.canvas = canvas;
      }
    } else {
      let canvas = this.canvas;

      if (canvas && this.node.cache) {
        let ctx = canvas.getContext("2d");
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(this.node.cache, frm.x, frm.y);
      }
    }
  }

}

function buildPaintJobs(node) {
  let jobs = [];

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

    for (let child of node.children) {
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

let queue = [];
function paint(node) {
  if (queue.length === 0) {
    queue = buildPaintJobs(node);
    paintLoop();
  }
}
function paintLoop() {
  let job = null;

  while (queue.length > 0) {
    job = queue.shift();

    if (job) {
      job.doPainting();
    }
  }
}

class StateManager {
  constructor() {
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
      const onKeyUp = e => {
        if (e.key === " ") {
          this.requestRootUpdate();
          let deadline = performance.now() + 16;
          this.step({
            timeRemaining: () => deadline - performance.now(),
            didTimeout: false
          });
        }
      };

      document.addEventListener("keyup", onKeyUp);
    }
  }

  get root() {
    return this._root;
  }

  get node() {
    return this._node;
  }

  set node(val) {
    this._node = val;
  }

  setRoot(fn) {
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
  }

  start() {
    if (!this.isRunning) {
      if (window.requestIdleCallback != null) {
        this.stepCallbackId = requestIdleCallback(this.step);
      } else {
        setTimeout(() => {
          this.step({
            timeRemaining: () => {
              return 16;
            },
            didTimeout: false
          });
        }, 10);
      }

      this.isRunning = true;
    }
  }

  stop() {
    this.isRunning = false;

    if (this.stepCallbackId) {
      cancelIdleCallback(this.stepCallbackId);
      this.stepCallbackId = null;
    }
  }

  step(deadline) {
    let start = performance.now();

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
        setTimeout(() => {
          this.step({
            timeRemaining: () => {
              return 16;
            },
            didTimeout: false
          });
        }, 10);
      }
    }

    let diff = performance.now() - start;
  }

  performNextUnitOfWork() {
    let n = this.unitsOfWork.shift();

    if (n) {
      this._node = n;
    } else {
      this._node = null;
    }

    if (this._node) {
      this.workEffectHooks(this._node, false);
      let next = this.updateNode(this._node);

      for (let _n of next) {
        this.unitsOfWork.push(_n);
      }
    }
  }

  commitRoot() {
    this.currentRoot = this._root;
    this._root = null;

    if (this.currentRoot) {
      this.propigateNeedsDraw(this.currentRoot);
      this.paintCount++;
      console.log("StateManager.commitRoot");
      this.debugFrames(this.currentRoot);
      paint(this.currentRoot);
    }
  }

  resolveCalculatedFrames(node, parent) {
    if (parent && parent.frame && node.props && node.frame) {
      if (node.name === "fragment") {
        node.frame = { ...parent.frame,
          x: 0,
          y: 0
        };
      }

      let w = node.props.width;
      let r = node.props.radius;

      if (w && typeof w === "string" && node.props.width.includes("%")) {
        let wp = parseFloat(node.props.width) / 100;
        node.frame.width = parent.frame.width * wp;
      }

      if (!w && r) {
        if (r && typeof r === "string" && r.includes("%")) {
          let rp = parseFloat(r) / 100;
          node.frame.width = parent.frame.width * rp * 2;
        } else {
          node.frame.width = parseFloat(r) * 2;
        }
      }

      let h = node.props.height;

      if (h && typeof h === "string" && node.props.height.includes("%")) {
        let hp = parseFloat(node.props.height) / 100;
        node.frame.height = parent.frame.height * hp;
      }

      let x = node.props.x;

      if (x && typeof x === "string" && x.includes("%")) {
        let xp = parseFloat(node.props.x) / 100;
        let xPos = parent.frame.width * xp;
        node.frame.x = xPos;
      }

      let y = node.props.y;

      if (y && typeof y === "string" && y.includes("%")) {
        let yp = parseFloat(node.props.y) / 100;
        let yPos = parent.frame.height * yp;
        node.frame.y = yPos;
      }

      node.frame.x = node.frame.x + parent.frame.x;
      node.frame.y = node.frame.y + parent.frame.y;
    }

    for (let child of node.children) {
      this.resolveCalculatedFrames(child, node);
    }
  }

  resolveIntrinsicFrames(node, parent) {
    for (let child of node.children) {
      this.resolveIntrinsicFrames(child, node);
    }

    let frame = mkRect(0, 0, 0, 0);

    if (node.props.x) {
      frame.x = parseFloat(node.props.x);
    }

    if (node.props.y) {
      frame.y = parseFloat(node.props.y);
    }

    frame.width = this.resolveWidth(node);
    frame.height = this.resolveHeight(node);
    node.frame = frame;
  }

  resolveWidth(node) {
    let w = 0;

    if (node.frame && node.frame.width) {
      w = node.frame.width;
    } else if (node.props.width) {
      w = parseFloat(node.props.width);
    } else if (node.props._intrinsicWidth) {
      w = parseFloat(node.props._intrinsicWidth);
    } else {
      for (let child of node.children) {
        w = Math.max(w, this.resolveWidth(child));
      }
    }

    return w;
  }

  resolveHeight(node) {
    let h = 0;

    if (node.frame && node.frame.height) {
      h = node.frame.height;
    } else if (node.props.height) {
      h = parseFloat(node.props.height);
    } else if (node.props._intrinsicHeight) {
      h = parseFloat(node.props._intrinsicHeight);
    } else {
      for (let child of node.children) {
        h = Math.max(h, this.resolveHeight(child));
      }
    }

    return h;
  }

  debugFrames(node, depth = 0) {
    let indent = "".padEnd(depth * 4, " ");

    if (node.frame) {
      console.log(indent, node.name, "x:", node.frame.x, ", y:", node.frame.y, "- w:", node.frame.width, ", h:", node.frame.height);
    } else {
      console.log(indent, node.name, "no-frame", node);
    }

    for (let child of node.children) {
      this.debugFrames(child, depth + 1);
    }
  }

  requestRootUpdate() {
    this.hasUpdateBeenRequested = true;
  }

  startRootUpdate() {
    this.hasUpdateBeenRequested = false;

    if (this.currentRoot) {
      this._nodeFrame = mkRect(0, 0, this.size.width, this.size.height);
      this._root = {
        name: "root",
        type: this.currentRoot.type,
        props: { ...this.currentRoot.props,
          width: this.size.width,
          height: this.size.height
        },
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
  }

  workTimerHooks(node) {
    for (let child of node.children) {
      this.workTimerHooks(child);
    }

    for (let hook of node.hooks) {
      for (let action of hook.pendingTicks) {
        action();
      }

      hook.pendingTicks = [];
    }
  }

  workEffectHooks(node, includeChildren = true) {
    if (includeChildren) {
      for (let child of node.children) {
        this.workEffectHooks(child);
      }
    }

    for (let hook of node.hooks) {
      for (let action of hook.pendingEffects) {
        let unmount = hook.queue.pop();

        if (unmount) {
          unmount();
        }

        let cb = action();

        if (cb) {
          hook.queue.push(cb);
        }
      }

      hook.pendingEffects = [];
    }
  }

  workLayoutHooks(node) {
    for (let child of node.children) {
      this.workLayoutHooks(child);
    }

    this._node = node;

    for (let hook of node.hooks) {
      for (let action of hook.pendingLayout) {
        action();
      }

      hook.pendingLayout = [];
    }

    this._node = null;
  }

  updateNode(node) {
    if (!node.alternate) {
      node.needsDraw = true;
    }

    let prevChildren = [];

    if (node.type instanceof Function) {
      this.hookIndex = 0;
      node.hooks = [];

      if (node.alternate) {
        prevChildren = node.alternate.children;
      } else if (node.children) {
        prevChildren = node.children;
      }

      let f = node.type;
      node.children = [f(node.props, node.children)];
    } else {
      prevChildren = node.alternate ? node.alternate.children : [];
    }

    let nextChildren = flattenChildren(node.children);
    let childDiff = this.diffChildren(nextChildren, prevChildren);
    node.children = childDiff.children;
    return node.children;
  }

  propigateNeedsDraw(parent, inherited = false) {
    let needsDraw = parent.needsDraw || inherited && !["pklayer", "layer", "group", "pkgroup"].includes(parent.name);

    for (let child of parent.children) {
      needsDraw = needsDraw || this.propigateNeedsDraw(child, needsDraw);
    }

    if (needsDraw) {
      for (let child of parent.children) {
        this.propigateNeedsDraw(child, true);
      }
    }

    parent.needsDraw = needsDraw;
    return needsDraw;
  }

  diffChildren(nextChildren, prevChildren) {
    let children = [];
    let removed = [];
    let length = Math.max(nextChildren.length, prevChildren.length);

    for (let i = 0; i < length; i++) {
      let next = nextChildren[i];
      let prev = prevChildren[i];
      let nextNode = this.diffNode(next, prev);

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
      children,
      removed
    };
  }

  diffNode(a, b) {
    let next = null;
    let sameType = false;

    if (!!a && !!b) {
      sameType = a.type == b.type;
    }

    if (a && b && sameType) {
      let needsDraw = false;

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
  }

}

class Supervisor {
  constructor() {
    this.canvases = [];
    this.stateManager = new StateManager();
  }

  addLayer(layer) {
    this.stateManager.setRoot(layer.child);
    this.canvases = layer.canvases;
  }

  get currentContext() {
    return this.stateManager;
  }

  get activeLayer() {
    return this.stateManager;
  }

  start() {
    var _this$activeLayer;

    (_this$activeLayer = this.activeLayer) === null || _this$activeLayer === void 0 ? void 0 : _this$activeLayer.start();
  }

  stop() {}

}
let sharedSupervisor = new Supervisor();
function getSharedSupervisor() {
  return sharedSupervisor;
}

const PinkKoala = props => {
  let containerRef = useRef(null);
  useEffect$1(() => {
    if (containerRef.current) {
      const canvasNodes = containerRef.current.querySelectorAll("canvas");
      let canvases = Array.from(canvasNodes).map(node => {
        return node;
      });
      let sup = getSharedSupervisor();
      sup.addLayer({
        child: props.drawing,
        canvases: canvases
      });
      sup.stateManager.size = props.size;
      sup.start();
    }
  }, [props.drawing, containerRef, props.size]);
  return React.createElement("div", {
    ref: containerRef,
    className: "PinkKoala"
  }, props.layers.map(layer => React.createElement("canvas", {
    key: layer,
    id: layer,
    width: props.size.width,
    height: props.size.height
  })));
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

  for (let i = 0; i < a.length; i++) {
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
  let hook = null;
  let context = getSharedSupervisor().currentContext;

  if (context) {
    if (context.node) {
      hook = context.node.alternate && context.node.alternate.hooks && context.node.alternate.hooks[context.hookIndex];
    }
  }

  return {
    context,
    prevHook: hook
  };
}

function useEffect(callback, args) {
  let hookState = getHookState();
  let prevHook = hookState.prevHook;
  let context = hookState.context;

  if (!context || !context.node) {
    throw new Error("useReducer must be called from within a render function");
  }

  let hook = createHook();

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
  useEffect(() => {
    document.addEventListener(event, handler);
    return () => {
      document.removeEventListener(event, handler);
    };
  }, [...args, event, handler]);
}

function useReducer(reducer, initialState, init = null) {
  let hookState = getHookState();
  let prevHook = hookState.prevHook;
  let context = hookState.context;

  if (!context || !context.node) {
    throw new Error("useReducer must be called from within a render function");
  }

  let hook = createHook();

  if (init) {
    hook.state = init(initialState);
  } else {
    hook.state = prevHook ? prevHook.state : invokeOrReturn(undefined, initialState);
  }

  const actions = prevHook ? prevHook.queue : [];

  for (let action of actions) {
    hook.state = reducer(hook.state, action);
  }

  if (prevHook) {
    prevHook.queue = [];
  }

  const dispatch = action => {
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
  let hookState = getHookState();
  let prevHook = hookState.prevHook;
  let context = hookState.context;

  if (!context || !context.node) {
    throw new Error("useTicker must be called from within a render function");
  }

  const hook = createHook();
  hook.state = prevHook ? prevHook.state : {
    now: -1,
    delta: -1
  };

  const onTick = () => {
    let now = Date.now();
    let delta = -1;

    if (prevHook && prevHook.state.lastTick > 0) {
      delta = now - prevHook.state.lastTick;
    }

    hook.state = {
      lastTick: now,
      delta
    };
    callback(now, delta);
    return null;
  };

  hook.pendingTicks.push(onTick);
  context.node.hooks.push(hook);
  context.hookIndex++;
}

function useRenderContext() {
  const {
    context
  } = getHookState();
  let value = {
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
  let hookState = getHookState();
  let prevHook = hookState.prevHook;
  let context = hookState.context;

  if (!context || !context.node) {
    throw new Error("useLayoutEffect must be called from within a render function");
  }

  let hook = createHook();

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

const Layer = (props, children) => {
  const {
    rootWidth,
    rootHeight
  } = useRenderContext();
  const attr = { ...props,
    width: rootWidth,
    height: rootHeight
  };
  return createElement("pklayer", Object.assign({}, attr), children);
};

const Rectangle = (props, children) => {
  if (children && children.length > 0) {
    return createElement(Fragment, null, children);
  } else {
    return null;
  }
};

const Circle = (props, children) => {
  if (children && children.length > 0) {
    return createElement(Fragment, null, children);
  } else {
    return null;
  }
};

const fontCanvas = document.createElement("canvas");
const fontCtx = fontCanvas.getContext("2d");
const Text = (props, children) => {
  let attr = { ...props,
    text: ""
  };
  let text = "";

  if (children && children.length > 0) {
    text = children.join(" ");
  }

  attr.text = text;

  if (props.font) {
    fontCtx.textBaseline = "top";
    fontCtx.font = props.font;
    let size = fontCtx.measureText(text || "");

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

  for (let child of node.children) {
    translateFrame(child, x, y);
  }
}

function Row(props, children) {
  console.log("Row.props", props);
  console.log("Row.children", children);
  let justifyContent = props.justifyContent ? props.justifyContent : "start";
  let alignItems = props.alignItems ? props.alignItems : "start";
  useLayoutEffect(() => {
    const {
      nodeRef
    } = useRenderContext();

    if (nodeRef) {
      let x = nodeRef.frame.x;
      let y = nodeRef.frame.y;
      let width = null;

      if (props.width) {
        width = nodeRef.frame.width;
      }

      let height = null;

      if (props.height) {
        height = nodeRef.frame.height;
      }

      const refChildren = nodeRef.children[0].children;
      let childPadding = 0;
      let childWidth = 0;
      let childHeight = 0;
      let flexCount = 0;
      let flexibileWidth = width ? width : 0;

      for (let child of refChildren) {
        if (child.props.flex) {
          try {
            let flexNum = parseInt(child.props.flex, 10);
            flexCount += flexNum;
          } catch (e) {
            console.warn(e);
          }
        } else if (child.frame) {
          flexibileWidth -= child.frame.width;
        }
      }

      for (let child of refChildren) {
        console.log("Row.useLayoutEffect start", child.name, child.frame);

        if (child.frame && child.props.flex && width) {
          try {
            let flexNum = parseInt(child.props.flex, 10);
            let flexRatio = flexNum / flexCount;
            child.frame.width = flexRatio * flexibileWidth;
            console.log("Row: flex width", child.name, child.frame.width, flexRatio);
            childWidth += child.frame.width;
          } catch (e) {
            console.warn(e);
          }
        }

        if (child.frame) {
          childWidth += child.frame.width;
          childHeight = Math.max(childHeight, child.frame.height);
        } else {
          console.warn("Row: child has no frame", child);
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

      for (let child of refChildren) {
        if (!child.frame) {
          child.frame = mkRect(0, 0, 0, 0);
          console.error("Row: child has no frame", child);
        }

        let cy = y;
        let ch = child.frame.height;

        switch (alignItems) {
          case "flex-start":
          case "start":
            break;

          case "flex-end":
          case "end":
            cy = y + height - child.frame.height;
            break;

          case "center":
          case "baseline":
            cy = y + (height - child.frame.height) / 2;
            break;

          case "stretch":
            ch = height;
            break;
        }

        translateFrame(child, x, cy);
        child.frame.height = ch;
        console.log("Row.useLayoutEffect end", child.name, child.frame);
        x += child.frame.width;
        x += childPadding;
      }
    }
  }, [children, justifyContent, alignItems]);
  return createElement(Fragment, null, children);
}

function Column(props, children) {
  console.log("Column.props", props);
  console.log("Column.children", children);
  let justifyContent = props.justifyContent ? props.justifyContent : "start";
  let alignItems = props.alignItems ? props.alignItems : "start";
  useLayoutEffect(() => {
    const {
      nodeRef
    } = useRenderContext();

    if (nodeRef) {
      let x = nodeRef.frame.x;
      let y = nodeRef.frame.y;
      let width = null;

      if (props.width) {
        width = nodeRef.frame.width;
      }

      let height = null;

      if (props.height) {
        height = nodeRef.frame.height;
      }

      const refChildren = nodeRef.children[0].children;
      let childPadding = 0;
      let childWidth = 0;
      let childHeight = 0;
      let flexCount = 0;
      let flexibleHight = height ? height : 0;

      for (let child of refChildren) {
        if (child.props.flex) {
          try {
            let flexNum = parseInt(child.props.flex, 10);
            flexCount += flexNum;
          } catch (e) {
            console.warn(e);
          }
        } else if (child.frame) {
          flexibleHight -= child.frame.height;
        }
      }

      for (let child of refChildren) {
        console.log("Column.useLayoutEffect start", child.name, child.frame);

        if (child.frame && child.props.flex && height) {
          try {
            let flexNum = parseInt(child.props.flex, 10);
            let flexRatio = flexNum / flexCount;
            child.frame.height = flexRatio * flexibleHight;
            console.log("Column: flex height", child.name, child.frame.height, flexRatio);
            childHeight += child.frame.height;
            childWidth = Math.max(childWidth, child.frame.width);
          } catch (e) {
            console.warn(e);
          }
        } else if (child.frame) {
          childHeight += child.frame.height;
          childWidth = Math.max(childWidth, child.frame.width);
        } else {
          console.error("Column: child has no frame", child);
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

      for (let child of refChildren) {
        if (!child.frame) {
          child.frame = mkRect(0, 0, 0, 0);
          console.error("Column: child has no frame", child);
        }

        let cx = x;
        let cw = child.frame.width;

        switch (alignItems) {
          case "flex-start":
          case "start":
            break;

          case "flex-end":
          case "end":
            cx = x + width - child.frame.width;
            break;

          case "center":
          case "baseline":
            cx = x + (width - child.frame.width) / 2;
            break;

          case "stretch":
            cw = width;
            break;
        }

        translateFrame(child, cx, y);
        child.frame.width = cw;
        console.log("Column.useLayoutEffect end", child.name, child.frame);
        y += child.frame.height;
        y += childPadding;
      }
    }
  }, [children, justifyContent, alignItems]);
  return createElement(Fragment, null, children);
}

const Polygon = (props, children) => {
  if (children && children.length > 0) {
    return createElement(Fragment, null, children);
  } else {
    return null;
  }
};

const Path = (props, children) => {
  if (children && children.length > 0) {
    return createElement(Fragment, null, children);
  } else {
    return null;
  }
};

const Group = (props, children) => {
  if (children && children.length > 0) {
    return createElement(Fragment, null, children);
  } else {
    return null;
  }
};

export { Circle, Column, Fragment, Group, Layer, Path, PinkKoala, Polygon, Rectangle, Row, Supervisor, Text, createElement, getSharedSupervisor, haveArgsChanged, invokeOrReturn, mkPoint, mkRect, mkSize, pointLerp, rectBottom, rectCenter, rectContains, rectIntersects, rectLeft, rectRight, rectTop, useEffect, useEventListener, useLayoutEffect, useReducer, useState, useTicker };
//# sourceMappingURL=index.modern.js.map
