import {
  clickIsInside,
  getDistanceToLine,
  getCenter,
  shapeEditor,
  getSegmentLength,
} from "../src/main";
import "jest-canvas-mock"

describe("<Editor />", (): void => {
  let resetEl: HTMLButtonElement;
  let saveEl: HTMLButtonElement;
  let addEl: HTMLButtonElement;
  let canvasEl: HTMLCanvasElement;
  let image: HTMLImageElement;

  beforeEach(() => {
    resetEl = document.createElement("button");
    resetEl.innerHTML = "Delete shape";

    saveEl = document.createElement("button");
    saveEl.innerHTML = "Save mask";

    addEl = document.createElement("button");
    addEl.innerHTML = "Add mask";

    canvasEl = document.createElement("canvas");

    image = new Image();
    image.src = "http://via.placeholder.com/640x360";

    canvasEl.style.background = `url(${image.src})`;
    canvasEl.style.backgroundSize = `contain`;

    document.querySelectorAll("body")[0].after(canvasEl);
    document.querySelectorAll("body")[0].before(saveEl);
    document.querySelectorAll("body")[0].before(resetEl);
    document.querySelectorAll("body")[0].before(addEl);
  });

  describe("shapeEditor", (): void => {
    it("should create a valid canvas", async () => {
      const canvas = document.querySelectorAll("canvas")[0];

      expect(canvas.style.background).toEqual(
        "url(http://via.placeholder.com/640x360)"
      );

      expect(canvas).toBeDefined();
    });

    it("should delete a shape", async () => {
      const shapes: number[][] = [
        [157, 303, 241, 371, 272, 295],
        [484, 71, 537, 199, 566, 115],
      ];

      shapeEditor(shapes, resetEl, saveEl, addEl, canvasEl, image);

      resetEl.click();

      expect(shapes.length).toEqual(1);
    });

    it("should add a shape", async () => {
      const shapes: number[][] = [
        [157, 303, 241, 371, 272, 295],
        [484, 71, 537, 199, 566, 115],
      ];

      shapeEditor(shapes, resetEl, saveEl, addEl, canvasEl, image);

      addEl.click();

      expect(shapes.length).toEqual(3);
    });
  });

  describe("utils", () => {
    it("a click outside a shape should not select it", async () => {
      const shapes: number[][] = [[0, 0, 100, 0, 100, 100, 0, 100]];
      const outSide = clickIsInside([101, 101], shapes[0]);

      expect(outSide).toBeFalsy();
    });

    it("a click inside a shape should select it", async () => {
      const shapes: number[][] = [[0, 0, 100, 0, 100, 100, 0, 100]];
      const outSide = clickIsInside([50, 50], shapes[0]);

      expect(outSide).toBeTruthy();
    });

    it("should get the center of a shape", async () => {
      const shapes: number[][] = [[0, 0, 100, 0, 100, 100, 0, 100]];
      const center = getCenter(shapes[0]);

      expect(center).toEqual({ x: 50, y: 50 });
    });

    it("should get a segment length", async () => {
      const segmentLength = getSegmentLength(0, 0, 3, 4);

      expect(segmentLength).toEqual(5);
    });

    it("should get the distance from a click to a line", async () => {
      const clickOnLineDist = getDistanceToLine(50, 50, 0, 0, 100, 100, true);
      const clickOffLineDist = getDistanceToLine(10, 0, 0, 0, 100, 100, true);

      expect(clickOnLineDist).toEqual(0);
      expect(clickOffLineDist).toEqual(7.071067811865475);
    });
  });
});
