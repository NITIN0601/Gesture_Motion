// Get references to video and canvas elements, and create a 2D context for the canvas
var videoElement = document.getElementById('video');
var canvasElement = document.getElementById('canvas');
var canvasCtx = canvasElement.getContext('2d');

// Create a new Hand object and a HandStateHandler object
var hand  = new Hand();
var state = new HandStateHandler();

// Set the canvas element's width and height to match the window size
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;

// Create a new OptionsNavigator object and pass in options and a callback function
optionsNavigator = new OptionsNavigator(options, addToSentence)

// Create buttons using the OptionsNavigator object
CreateButtons(optionsNavigator);

// Callback function that gets called when new hand detection results are available
function onResults(results) {
  // Save the current canvas state
  canvasCtx.save();
  // Clear the canvas
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  // Draw the image from the hand detection results on the canvas
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  // If multiple hands are detected, loop through them
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      // Update the Hand object with the detected hand landmarks
      hand.update(landmarks);
      // Update the HandStateHandler object with the updated Hand object
      state.update(hand);
      // Show the detected hand landmarks on the canvas
      showHand(canvasCtx, hand, "rgba(0, 0, 255, 1)");
      // Draw a point at the center of the detected hand on the canvas
      drawPoint(canvasCtx, state.HandCenterLocation(), "blue");
      // Show the current hand state on the canvas
      showHandState(state);
    }
  }
  // Restore the previous canvas state
  canvasCtx.restore();
}

// Function that draws the detected hand landmarks on the canvas
function showHand(canvasCtx, hand) {
  for (let i = 0; i < hand.landmarks.length; i++) {
    const x = hand.landmarks[i].x * canvasElement.width;
    const y = hand.landmarks[i].y * canvasElement.height;
    drawPoint(canvasCtx, [x, y]);
  }
}

// Function that draws a point on the canvas
function drawPoint(ctx, point, color) {
  ctx.beginPath();
  // Draw a circle with a radius of 10 pixels at the specified point
  ctx.arc(point[0], point[1], 10, 0, 2 * Math.PI);
  // Set the fill color to the specified color (or white if no color is specified)
  ctx.fillStyle = color || "white";
  // Fill the circle with the specified color
  ctx.fill();
  // Save the current canvas state
  ctx.save();
}

// Function that shows the current hand state on the canvas
function showHandState(state) {
  // Get the current hand state as a string
  var gesture = state.getCurrentState()
  // Set the font and fill style for the canvas
  canvasCtx.font = "30px Arial";
  canvasCtx.fillStyle = "red";
  // Reverse the canvas in the x direction
  canvasCtx.scale(-1, 1);
  // Draw the current hand state at the bottom right corner of the canvas
  canvasCtx.fillText(gesture, -canvasElement.width + 10, canvasElement.height - 10);
  // Reverse the canvas back to its original orientation
  canvas
