const MOVE_ALL_SIZE = 16;
const MOVE_SIZE = 16;
const CORNER_SIZE = 6;

interface Point {
  x: number;
  y: number;
}

export const clickIsInside = function (
  point: number[],
  shapePoints: number[]
): boolean {
  const vs: number[][] = [];

  for (let i = 0, j = 0; i < shapePoints.length / 2; j += 2, i++) {
    vs[i] = [shapePoints[j], shapePoints[j + 1]];
  }

  const x = point[0];
  const y = point[1];

  let isInside = false;

  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0];
    const yi = vs[i][1];
    const xj = vs[j][0];
    const yj = vs[j][1];

    const intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) isInside = !isInside;
  }

  return isInside;
};

export const getCenter = function (shape: number[]): Point {
  const ptc = [];

  for (let i = 0; i < shape.length; i++) {
    ptc.push({ x: shape[i], y: shape[++i] });
  }

  const first = ptc[0];
  const last = ptc[ptc.length - 1];

  if (first.x !== last.x || first.y !== last.y) ptc.push(first);

  let twiceArea = 0;
  let x = 0;
  let y = 0;
  let p1;
  let p2;
  let f;

  const ptcLength = ptc.length;

  for (let i = 0, j = ptcLength - 1; i < ptcLength; j = i++) {
    p1 = ptc[i];
    p2 = ptc[j];
    f = p1.x * p2.y - p2.x * p1.y;
    twiceArea += f;
    x += (p1.x + p2.x) * f;
    y += (p1.y + p2.y) * f;
  }

  f = twiceArea * 3;

  return { x: x / f, y: y / f };
};

export const getSegmentLength = (
  x: number,
  y: number,
  x0: number,
  y0: number
): number => {
  return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};

export const getDistanceToLine = function (
  x: number,
  y: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  o: Point | boolean
): number {
  if (
    o &&
    !((o = ((x, y, x0, y0, x1, y1): { x: number; y: number } => {
      if (!(x1 - x0)) {
        return { x: x0, y: y };
      } else if (!(y1 - y0)) {
        return { x: x, y: y0 };
      }

      let left;
      const tg = -1 / ((y1 - y0) / (x1 - x0));

      return {
        x: (left =
          (x1 * (x * tg - y + y0) + x0 * (x * -tg + y - y1)) /
          (tg * (x1 - x0) + y0 - y1)),
        y: tg * left - tg * x + y,
      };
    })(x, y, x0, y0, x1, y1)),
    o.x >= Math.min(x0, x1) &&
    o.x <= Math.max(x0, x1) &&
    o.y >= Math.min(y0, y1) &&
    o.y <= Math.max(y0, y1))
  ) {
    const l1 = getSegmentLength(x, y, x0, y0);
    const l2 = getSegmentLength(x, y, x1, y1);

    return l1 > l2 ? l2 : l1;
  } else {
    const a = y0 - y1;
    const b = x1 - x0;
    const c = x0 * y1 - y0 * x1;

    return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
  }
};

export const shapeEditor = function (
  shapes: number[][],
  deleteEl: HTMLButtonElement,
  saveEl: HTMLButtonElement,
  addEl: HTMLButtonElement,
  canvasEl: HTMLCanvasElement,
  image: HTMLImageElement,
  previewEl?: HTMLButtonElement
): void {
  const ctx = canvasEl.getContext("2d");

  let startPoint: { x: number; y: number } | null;
  let activePoint: number | null;
  let activeIndex = 0;

  const drawShape = function (
    ctx: CanvasRenderingContext2D,
    shape: number[],
    active: boolean,
    save: boolean
  ): void {
    if (shape.length < 2) {
      return;
    }

    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = save ? "black" : "rgb(51, 153, 255)";

    if (shape.length >= 6 && active && !save) {
      const center = getCenter(shape);
      ctx.fillStyle = "black";
      ctx.lineWidth = 3;

      ctx.strokeStyle = "white";
      ctx.strokeRect(
        center.x - MOVE_ALL_SIZE / 2,
        center.y - MOVE_ALL_SIZE / 2,
        MOVE_ALL_SIZE,
        MOVE_ALL_SIZE
      );

      ctx.fillRect(
        center.x - MOVE_ALL_SIZE / 2,
        center.y - MOVE_ALL_SIZE / 2,
        MOVE_ALL_SIZE,
        MOVE_ALL_SIZE
      );
    }

    ctx.beginPath();
    ctx.moveTo(shape[0], shape[1]);

    for (let i = 0; i < shape.length; i += 2) {
      if (active && !save) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        ctx.strokeRect(
          shape[i] - CORNER_SIZE / 2,
          shape[i + 1] - CORNER_SIZE / 2,
          CORNER_SIZE,
          CORNER_SIZE
        );

        ctx.fillRect(
          shape[i] - CORNER_SIZE / 2,
          shape[i + 1] - CORNER_SIZE / 2,
          CORNER_SIZE,
          CORNER_SIZE
        );
      }

      if (shape.length > 2 && i > 1) {
        ctx.lineTo(shape[i], shape[i + 1]);
      }
    }

    ctx.closePath();
    ctx.fillStyle = save
      ? "black"
      : active
        ? "rgb(51, 153, 255, .75)"
        : "rgba(255,255,255, .5)";
    ctx.fill();
  };

  const draw = function (save = false): void {
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let i = shapes.length - 1; i >= 0; i--) {
      drawShape(ctx, shapes[i], i === activeIndex, save);
    }
  };

  const move = function (e: MouseEvent): void {
    if (!ctx || typeof activePoint !== "number") return;

    shapes[activeIndex][activePoint] = Math.round(e.offsetX);
    shapes[activeIndex][activePoint + 1] = Math.round(e.offsetY);

    draw();
  };

  const moveAll = function (e: MouseEvent): void {
    if (!ctx) return;

    if (!startPoint) {
      startPoint = { x: Math.round(e.offsetX), y: Math.round(e.offsetY) };
    }

    const sdvPoint = { x: Math.round(e.offsetX), y: Math.round(e.offsetY) };

    for (let i = 0; i < shapes[activeIndex].length; i++) {
      shapes[activeIndex][i] =
        sdvPoint.x - startPoint.x + shapes[activeIndex][i];

      shapes[activeIndex][++i] =
        sdvPoint.y - startPoint.y + shapes[activeIndex][i];
    }

    startPoint = sdvPoint;

    draw();
  };

  const resize = function (): void {
    canvasEl.setAttribute("height", image.height.toString());
    canvasEl.setAttribute("width", image.width.toString());

    draw();
  };

  const deleteShape = function (): void {
    shapes.splice(activeIndex, 1);

    if (shapes.length === 0) {
      shapes = [[]];
    }

    activeIndex = 0;
    draw();
  };

  const stopDrag = function (): void {
    canvasEl.removeEventListener("mousemove", move);
    canvasEl.removeEventListener("mousemove", moveAll);

    activePoint = null;
  };

  const rightClick = function (e: MouseEvent): boolean {
    resize();

    e.preventDefault();

    const x = e.offsetX;
    const y = e.offsetY;

    for (let i = 0; i < shapes[activeIndex].length; i += 2) {
      const dis = Math.sqrt(
        Math.pow(x - shapes[activeIndex][i], 2) +
        Math.pow(y - shapes[activeIndex][i + 1], 2)
      );

      if (dis < 6) {
        shapes[activeIndex].splice(i, 2);

        draw();

        return false;
      }
    }

    return false;
  };

  const addShape = function (e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();

    shapes.push([]);
    activeIndex = shapes.length - 1;
    canvasEl.style.cursor = "copy";
  };

  const mousedown = function (e: MouseEvent): void {
    let dis;
    let lineDis;
    let insertAt = shapes[activeIndex].length;
    canvasEl.style.cursor = "auto";

    e.preventDefault();

    const x = e.offsetX;
    const y = e.offsetY;

    // Handle active shape on click
    for (let i = 0; i < shapes.length; i++) {
      if (i !== activeIndex || i > activeIndex) {
        if (clickIsInside([x, y], shapes[i])) {
          activeIndex = i;
          draw();

          return;
        }
      }
    }

    // If more than 3 points && small distance from barycentre : move shape
    if (shapes[activeIndex].length >= 6) {
      if (!ctx) return;

      const center = getCenter(shapes[activeIndex]);

      ctx.fillRect(
        center.x - MOVE_ALL_SIZE / 2,
        center.y - MOVE_ALL_SIZE / 2,
        MOVE_ALL_SIZE,
        MOVE_ALL_SIZE
      );

      const dis = Math.sqrt(
        Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2)
      );

      if (dis < MOVE_ALL_SIZE) {
        startPoint = null;
        canvasEl.addEventListener("mousemove", moveAll);
        return;
      }
    }

    // Handle move point
    for (let i = 0; i < shapes[activeIndex].length; i += 2) {
      dis = Math.sqrt(
        Math.pow(x - shapes[activeIndex][i], 2) +
        Math.pow(y - shapes[activeIndex][i + 1], 2)
      );

      if (dis < MOVE_SIZE) {
        activePoint = i;
        canvasEl.addEventListener("mousemove", move);
        return;
      }
    }

    // Handle point insertion on line
    for (let i = 0; i < shapes[activeIndex].length; i += 2) {
      if (i > 1) {
        lineDis = getDistanceToLine(
          x,
          y,
          shapes[activeIndex][i],
          shapes[activeIndex][i + 1],
          shapes[activeIndex][i - 2],
          shapes[activeIndex][i - 1],
          true
        );

        if (lineDis < 6) {
          insertAt = i;
        }
      }
    }

    shapes[activeIndex].splice(insertAt, 0, Math.round(x), Math.round(y));
    activePoint = insertAt;

    canvasEl.addEventListener("mousemove", move);
    draw();
  };

  image.onload = function (): void {
    resize();
  };

  saveEl.addEventListener("click", () => {
    draw(true);
  });

  if (previewEl)
    previewEl.addEventListener("click", () => {
      draw(true);
    });

  canvasEl.addEventListener("mousedown", mousedown);
  canvasEl.addEventListener("contextmenu", rightClick);
  canvasEl.addEventListener("mouseup", stopDrag);
  canvasEl.addEventListener("mouseleave", stopDrag);
  addEl.addEventListener("click", addShape);

  deleteEl.addEventListener("click", deleteShape);

  window.addEventListener(
    "keyup",
    (e: KeyboardEvent) => {
      if (e.key === "Backspace") deleteShape();
    },
    false
  );

  window.addEventListener("resize", () => {
    resize();
  });
};
