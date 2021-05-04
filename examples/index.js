"strict mode";

const diffSample = document.getElementsByClassName("diff-sample");
for (let i = 0; i < diffSample.length; i++) {
  loadDiffSample(diffSample[i]);
}

/**
 * @param {Element} diffSample
 */
async function loadDiffSample(diffSample) {
  const images = await loadImages(diffSample.getElementsByTagName("img"));
  images[2].src = imageDiff(images[0], images[1], "green").toDataURL();
}

/**
 * @param {HTMLCollectionOf<HTMLImageElement>} images
 * @return {Promise<HTMLCollectionOf<HTMLImageElement>>}
 */
function loadImages(images) {
  let loading = images.length;
  function imageLoaded(resolve) {
    if (--loading === 0) {
      resolve(images);
    }
  }

  return new Promise((resolve) => {
    for (let i = 0; i < images.length; i++) {
      if (images[i].complete) {
        imageLoaded(resolve);
      } else {
        images[i].onload = () => imageLoaded(resolve);
      }
    }
  });
}
