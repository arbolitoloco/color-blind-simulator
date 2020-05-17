/** 
 *  app name: Color Blindness Simulator
 *  author: Laura Rocha Prado
 *  year: 2020
 *  
 */

/**
 * Global variables
 */
var normalImg = document.getElementById('normalImg');
var normalImgSrc = normalImg.getAttribute('src');
var imgPicker = document.getElementById('img-picker');
var filteredImgs = document.querySelectorAll('[class^="img--"]');
var filename = 'colorblind-gallery-' + normalImgSrc.split("/").pop();

/**
 * Image picker
 */
imgPicker.addEventListener('change', function() {
  // Only reads first file when multiple are selected
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.addEventListener('load', function() {
      filename = 'colorblind-gallery-' + file.name;
      normalImg.setAttribute('src', this.result);
      replaceImg(this.result);
    });
    // Converts to url used for src
    reader.readAsDataURL(file);
  };
});

/**
 * Replaces existing gallery with uploaded image
 * (SVG filters are declared in HTML, and styles are applied in CSS)
 */
function replaceImg(url) {
  filteredImgs.forEach((filteredImg => {
    filteredImg.src = url;
  }));
};

/**
 * Replaces uploaded images with filtered images to allow for download
 * 
 * The generated gallery is downloaded using the html2canvas library.
 * However, because html2canvas does not support filters yet, 
 * I had to find a workaround: redraw images with filters applied (using `screenshot`
 * function adapted from here: https://github.com/cyan33/image-screenshot/)
 */
function screenshot(imgNode, format = 'png', quality = 0.97) {
  const canvas = document.createElement('canvas')
  canvas.width = imgNode.width
  canvas.height = imgNode.height

  const context = canvas.getContext('2d')
  context.filter = getComputedStyle(imgNode).filter

  imgNode.setAttribute('crossOrigin', 'anonymous')

  context.drawImage(imgNode, 0, 0, canvas.width, canvas.height)
  const url = canvas.toDataURL(`image/${format}`, quality)

  return {
    url,
    then: (cb) => {
      cb(url)
    },
    download: (name = 'image') => {
      download(url, `${name}.${format}`)
    }
  }
}

function redrawImages() {
  filteredImgs.forEach((filteredImg => {
    let redrawn = screenshot(filteredImg);
    filteredImg.src = redrawn.url;
  }));
}

/**
 * Gallery image download
 * Uses html2canvas library ()
 */
function downloadGallery() {
  redrawImages();
  let anchorElement = document.getElementById('blank'),
    gallery = document.getElementById('gallery');
  window.scrollTo(0, 0);

  html2canvas(gallery, {
    allowTaint: true
  }).then(function(canvas) {
    console.log(canvas.toDataURL);
    anchorElement.setAttribute('href', canvas.toDataURL("image/png"));
    anchorElement.setAttribute('download', filename);
    anchorElement.click();
  });
};


// Experimental approach:

// function createGallery(filter) {
//   let normalImg = document.getElementById('normalImg').getAttribute('src'),
//     gallery = document.getElementById('gallery'),
//     galleryItem = document.createElement('figure'),
//     filteredImg = new Image(),
//     imgCaption = document.createElement('figcaption');
//   filteredImg.src = normalImg;
//   filteredImg.setAttribute('class', 'img--' + `${filter}`);
//   imgCaption.innerText = filter;
//   gallery.appendChild(galleryItem);
//   galleryItem.appendChild(imgCaption);
//   galleryItem.appendChild(filteredImg);
// }

// createGallery('protanopia');
// createGallery('protanomaly');
// createGallery('deuteranomaly');
// createGallery('deuteranopia');
// createGallery('tritanomaly');
// createGallery('tritanopia');
// createGallery('achromatomaly');
// createGallery('achromatopsia');