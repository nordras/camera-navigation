"use client";

import { useEffect, useRef, useState } from "react";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
// @ts-ignore - fingerpose doesn't have TypeScript types
import * as fp from "fingerpose";

const config = {
  video: { width: 640, height: 480, fps: 30 },
};

const gestureStrings: Record<string, string> = {
  thumbs_up: "👍",
  victory: "✌🏻",
  thumbs_down: "👎",
};

const fingerLookupIndices = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

const landmarkColors = {
  thumb: "red",
  indexFinger: "blue",
  middleFinger: "yellow",
  ringFinger: "green",
  pinky: "pink",
  palmBase: "white",
};

function createThumbsDownGesture() {
  const thumbsDown = new fp.GestureDescription("thumbs_down");

  thumbsDown.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl);
  thumbsDown.addDirection(
    fp.Finger.Thumb,
    fp.FingerDirection.VerticalDown,
    1.0
  );
  thumbsDown.addDirection(
    fp.Finger.Thumb,
    fp.FingerDirection.DiagonalDownLeft,
    0.9
  );
  thumbsDown.addDirection(
    fp.Finger.Thumb,
    fp.FingerDirection.DiagonalDownRight,
    0.9
  );

  for (let finger of [
    fp.Finger.Index,
    fp.Finger.Middle,
    fp.Finger.Ring,
    fp.Finger.Pinky,
  ]) {
    thumbsDown.addCurl(finger, fp.FingerCurl.FullCurl, 0.9);
    thumbsDown.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);
  }

  return thumbsDown;
}

export default function GestureDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gesture, setGesture] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let animationId: number;
    let detector: handPoseDetection.HandDetector;
    let gestureEstimator: any;

    const drawPoint = (
      ctx: CanvasRenderingContext2D,
      y: number,
      x: number,
      r: number
    ) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fill();
    };

    const drawPath = (
      ctx: CanvasRenderingContext2D,
      points: number[][],
      closePath: boolean,
      color: string
    ) => {
      ctx.strokeStyle = color;
      const region = new Path2D();
      region.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        region.lineTo(point[0], point[1]);
      }
      if (closePath) {
        region.closePath();
      }
      ctx.stroke(region);
    };

    const drawKeypoints = (ctx: CanvasRenderingContext2D, keypoints: number[][]) => {
      for (let i = 0; i < keypoints.length; i++) {
        const y = keypoints[i][0];
        const x = keypoints[i][1];
        drawPoint(ctx, x - 2, y - 2, 3);
      }

      const fingers = Object.keys(fingerLookupIndices) as Array<
        keyof typeof fingerLookupIndices
      >;
      for (let i = 0; i < fingers.length; i++) {
        const finger = fingers[i];
        const points = fingerLookupIndices[finger].map((idx) => keypoints[idx]);
        drawPath(ctx, points, false, landmarkColors[finger]);
      }
    };

    const loadWebcam = async (): Promise<HTMLVideoElement> => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser API navigator.mediaDevices.getUserMedia is not available");
      }

      const video = videoRef.current!;
      video.muted = true;
      video.width = config.video.width;
      video.height = config.video.height;

      const mediaConfig = {
        audio: false,
        video: {
          facingMode: "user",
          width: config.video.width,
          height: config.video.height,
          frameRate: { max: config.video.fps },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(mediaConfig);
      video.srcObject = stream;

      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          resolve(video);
        };
      });
    };

    const detectGestures = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !detector) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const runDetection = async () => {
        ctx.drawImage(
          video,
          0,
          0,
          video.videoWidth,
          video.videoHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const hands = await detector.estimateHands(video);
        
        if (hands.length > 0) {
          const keypoints = hands[0].keypoints;
          const result = keypoints.map(kp => [kp.x, kp.y]);
          drawKeypoints(ctx, result);

          if (gestureEstimator && keypoints) {
            const landmarks = keypoints.map(kp => [kp.x, kp.y, kp.z || 0]);
            const est = gestureEstimator.estimate(landmarks, 9);
            if (est.gestures.length > 0) {
              const bestGesture = est.gestures.reduce((p: any, c: any) => {
                return p.score > c.score ? p : c;
              });

              if (bestGesture.score > 9.9) {
                setGesture(gestureStrings[bestGesture.name] || "");
              }
            }
          }
        } else {
          setGesture("");
        }

        animationId = requestAnimationFrame(runDetection);
      };

      runDetection();
    };

    const init = async () => {
      try {
        setIsLoading(true);
        
        // Load TensorFlow backend
        await tf.ready();

        // Load webcam
        const video = await loadWebcam();
        await video.play();

        // Setup canvas
        const canvas = canvasRef.current!;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "white";
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        // Load hand pose detection model
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
          runtime: 'tfjs' as const,
          maxHands: 1,
        };
        detector = await handPoseDetection.createDetector(model, detectorConfig);

        // Initialize gesture estimator
        const knownGestures = [
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
          createThumbsDownGesture(),
        ];
        gestureEstimator = new fp.GestureEstimator(knownGestures);

        setIsLoading(false);
        detectGestures();
      } catch (err) {
        console.error("Error initializing:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize");
        setIsLoading(false);
      }
    };

    init();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
          <p className="text-xl">Loading model and camera...</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 rounded-lg">
          <p className="text-xl">Error: {error}</p>
        </div>
      )}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-blue-500 rounded-lg"
        />
        <video
          ref={videoRef}
          className="absolute top-0 left-0 invisible"
        />
        {gesture && (
          <h1 className="absolute bottom-8 right-8 text-8xl">
            {gesture}
          </h1>
        )}
      </div>
    </div>
  );
}
