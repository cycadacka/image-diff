(function (root, factory) {
  if (typeof exports === "object" && typeof module === "object") {
    // TODO: Support npm... without node-canvas since it's hard to install in Windows 10.
  } else if (typeof define === "function" && define.amd) {
    define(factory());
  } else if (typeof exports === "object") {
    exports["imageDiff"] = factory();
  } else {
    root["imageDiff"] = factory();
  }
})(self, function () {
  /**
   * @param {number} width
   * @param {number} height
   * @return {CanvasRenderingContext2D}
   */
  function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    return canvas.getContext("2d");
  }

  /**
   * @param {HTMLImageElement} aImage
   * @param {HTMLImageElement} bImage
   * @param {string} marker
   * @return {HTMLCanvasElement}
   */
  function imageDiff(aImage, bImage, marker = "red") {
    const maxWidth = Math.max(aImage.naturalWidth, bImage.naturalWidth);
    const maxHeight = Math.max(aImage.naturalHeight, bImage.naturalHeight);

    const mask = createCanvas(maxWidth, maxHeight);
    const result = createCanvas(maxWidth, maxHeight);
    result.drawImage(aImage, 0, 0, aImage.naturalWidth, aImage.naturalHeight);

    // mask => | `aImage` - `bImage` |
    mask.drawImage(aImage, 0, 0, aImage.naturalWidth, aImage.naturalHeight);
    mask.globalCompositeOperation = "difference";
    mask.drawImage(bImage, 0, 0, bImage.naturalWidth, bImage.naturalHeight);

    // mask => HSLA where Saturation is 0%;
    mask.globalCompositeOperation = "saturation";
    mask.fillStyle = "#FFF";
    mask.fillRect(0, 0, maxWidth, maxHeight);

    // mask => `mask` * 2 ^ 8
    mask.globalCompositeOperation = "lighter";
    for (let i = 0; i < 8; i++) {
      mask.drawImage(mask.canvas, 0, 0);
    }

    // result => `aImage` * (-`mask`)
    result.filter = "invert(1)";
    result.globalCompositeOperation = "multiply";
    result.drawImage(mask.canvas, 0, 0);
    result.filter = "none";

    // mask => `mask` * `marker`
    mask.globalCompositeOperation = "multiply";
    mask.fillStyle = marker;
    mask.fillRect(0, 0, maxWidth, maxHeight);

    // result => `result` + `mask`
    result.globalCompositeOperation = "lighter";
    result.drawImage(mask.canvas, 0, 0);

    return result.canvas;
  }

  return imageDiff;
});
