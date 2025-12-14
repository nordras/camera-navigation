// @ts-ignore - fingerpose doesn't have TypeScript types
import * as fp from "fingerpose";

export const config = {
  video: { width: 640, height: 480, fps: 30 },
};

export const gestureStrings: Record<string, string> = {
  thumbs_up: "👍",
  victory: "✌🏻",
  thumbs_down: "👎",
};

export const fingerLookupIndices = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

export const landmarkColors = {
  thumb: "red",
  indexFinger: "blue",
  middleFinger: "yellow",
  ringFinger: "green",
  pinky: "pink",
  palmBase: "white",
};

export function createThumbsDownGesture() {
  const thumbsDown = new fp.GestureDescription("thumbs_down");

  thumbsDown.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl);
  thumbsDown.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalDown, 1.0);
  thumbsDown.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownLeft, 0.9);
  thumbsDown.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownRight, 0.9);

  for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    thumbsDown.addCurl(finger, fp.FingerCurl.FullCurl, 0.9);
    thumbsDown.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);
  }

  return thumbsDown;
}

export function drawPoint(drawingContext: CanvasRenderingContext2D, y: number, x: number, r: number) {
  drawingContext.beginPath();
  drawingContext.arc(x, y, r, 0, 2 * Math.PI);
  drawingContext.fill();
}

export function drawPath(
  drawingContext: CanvasRenderingContext2D,
  points: number[][],
  closePath: boolean,
  color: string
) {
  drawingContext.strokeStyle = color;
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  drawingContext.stroke(region);
}

export function drawKeypoints(drawingContext: CanvasRenderingContext2D, keypoints: number[][]) {
  for (let i = 0; i < keypoints.length; i++) {
    const y = keypoints[i][0];
    const x = keypoints[i][1];
    drawPoint(drawingContext, x - 2, y - 2, 3);
  }

  const fingers = Object.keys(fingerLookupIndices);
  for (let i = 0; i < fingers.length; i++) {
    const finger = fingers[i] as keyof typeof fingerLookupIndices;
    const points = fingerLookupIndices[finger].map((idx) => keypoints[idx]);
    drawPath(drawingContext, points, false, landmarkColors[finger]);
  }
}

export async function loadWebcam(videoElement: HTMLVideoElement, width: number, height: number, fps: number) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Browser API navigator.mediaDevices.getUserMedia is not available");
  }

  videoElement.muted = true;
  videoElement.width = width;
  videoElement.height = height;

  const mediaConfig = {
    audio: false,
    video: {
      facingMode: "user",
      width: width,
      height: height,
      frameRate: { max: fps },
    },
  };

  const stream = await navigator.mediaDevices.getUserMedia(mediaConfig);
  videoElement.srcObject = stream;

  return new Promise<HTMLVideoElement>((resolve) => {
    videoElement.onloadedmetadata = () => {
      resolve(videoElement);
    };
  });
}
