let video;
let captureButton;
let videoWidth;
let videoHeight;
let avgColor = [255, 255, 255]; // Default white
let analyzing = false;

function setup() {
  createCanvas(640, 480);
  video = createCapture(
    {
      audio: false,
      video: {
        facingMode: "environment",
      },
    },
    function (e) {
      // we have video
      console.log(video)
      videoWidth = video.width;
      videoHeight = video.height;
    }
  );
  video.hide()

  captureButton = createButton("Capture Image");
  captureButton.position(285, 57);
  captureButton.mousePressed(getAverageColor);
}

function draw() {
  if (analyzing) {
    background(avgColor);
  } else {
    image(video, 0, 0, width, height);
  }
}

function getAverageColor() {
  video.loadPixels();

  if (video.pixels.length > 0) {
    let r = 0, g = 0, b = 0, count = 0;

    for (let y = 0; y < video.height; y++) {
      for (let x = 0; x < video.width; x++) {
        let index = (x + y * video.width) * 4;
        r += video.pixels[index];
        g += video.pixels[index + 1];
        b += video.pixels[index + 2];
        count++;
      }
    }

    avgColor = [r / count, g / count, b / count];
    analyzing = true;

  
    if (typeof firebase !== "undefined" && db) {
      saveColorToFirebase(avgColor);
    } else {
      console.error("Firebase is not initialized!");
    }
  }
}

function saveColorToFirebase(color) {
  db.collection("colors").add({
    r: color[0],
    g: color[1],
    b: color[2],
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(docRef => console.log("Document written with ID:", docRef.id))
  .catch(error => console.error("Error adding document:", error));
}
