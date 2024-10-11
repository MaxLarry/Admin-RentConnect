const createImage = (url) => 
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (error) => reject(error));
    img.src = url;
  });

  const getCroppedImg = async (imageSrc, croppedArea) => {
    const image = new Image();
    image.src = imageSrc;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = croppedArea.width;
    canvas.height = croppedArea.height;

    return new Promise((resolve) => {
        image.onload = () => {
            ctx.drawImage(
                image,
                croppedArea.x,
                croppedArea.y,
                croppedArea.width,
                croppedArea.height,
                0,
                0,
                croppedArea.width,
                croppedArea.height
            );
            canvas.toBlob((blob) => {
                const croppedImageUrl = URL.createObjectURL(blob);
                resolve(croppedImageUrl);
            }, 'image/jpeg');
        };
    });
};

export default getCroppedImg;
