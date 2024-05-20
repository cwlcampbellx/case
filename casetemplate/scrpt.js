const canvas = document.getElementById('clipCanvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');

const shapeImage = new Image();
shapeImage.src = 'casee.png'; // Ensure this path is correct and the image is in the same directory

shapeImage.onload = function () {
    // Optionally, draw the shape image initially
    ctx.drawImage(shapeImage, 0, 0, canvas.width, canvas.height);
    console.log('Shape image loaded and drawn');
};

shapeImage.onerror = function () {
    console.error('Failed to load shape image');
};

imageUpload.addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const uploadedImage = new Image();
            uploadedImage.onload = function () {
                clipImageToShape(uploadedImage);
            };
            uploadedImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function clipImageToShape(image) {
    // Create an off-screen canvas to handle the clipping
    const clipCanvas = document.createElement('canvas');
    clipCanvas.width = canvas.width;
    clipCanvas.height = canvas.height;
    const clipCtx = clipCanvas.getContext('2d');

    // Draw the shape image to create the mask
    clipCtx.drawImage(shapeImage, 0, 0, clipCanvas.width, clipCanvas.height);
    clipCtx.globalCompositeOperation = 'source-in';
    clipCtx.drawImage(image, 0, 0, clipCanvas.width, clipCanvas.height);

    // Draw the clipped image on the main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(clipCanvas, 0, 0);
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'clipped-image.png';
    link.href = canvas.toDataURL();
    link.click();
}
