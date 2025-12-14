"use client";

import { useEffect, useRef, useState } from "react";
// @ts-ignore - fingerpose doesn't have TypeScript types
import * as fp from "fingerpose";
import {
  config,
  gestureStrings,
  createThumbsDownGesture,
  drawKeypoints,
  loadWebcam,
} from "@/utils/gestureUtils";

export default function GestureDetectorV2() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gesture, setGesture] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let animationId: number;
    let model: any;
    let gestureEstimator: any;
    let videoWidth: number;
    let videoHeight: number;
    let drawingContext: CanvasRenderingContext2D | null;
    let canvas: HTMLCanvasElement;

    async function loadVideo() {
      const video = await loadWebcam(
        videoRef.current!,
        config.video.width,
        config.video.height,
        config.video.fps
      );
      await video.play();
      return video;
    }

    async function continuouslyDetectLandmarks(video: HTMLVideoElement) {
      async function runDetection() {
        if (!drawingContext || !canvas) return;

        drawingContext.drawImage(
          video,
          0,
          0,
          videoWidth,
          videoHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Draw hand landmarks
        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
          const result = predictions[0].landmarks;
          drawKeypoints(drawingContext, result);
        }

        if (
          predictions.length > 0 &&
          Object.keys(predictions[0]).includes("landmarks")
        ) {
          const est = gestureEstimator.estimate(predictions[0].landmarks, 9);
          if (est.gestures.length > 0) {
            // Find gesture with highest match score
            let result = est.gestures.reduce((p: any, c: any) => {
              return p.score > c.score ? p : c;
            });

            if (result.score > 9.9) {
              setGesture(gestureStrings[result.name] || "");
            } else {
              setGesture("");
            }
          }
        } else {
          setGesture("");
        }

        animationId = requestAnimationFrame(runDetection);
      }

      // Initialize gesture detection
      const knownGestures = [
        fp.Gestures.VictoryGesture,
        fp.Gestures.ThumbsUpGesture,
        createThumbsDownGesture(),
      ];

      gestureEstimator = new fp.GestureEstimator(knownGestures);

      // @ts-ignore - handpose is loaded via CDN
      if (typeof handpose === 'undefined') {
        throw new Error('Handpose library not loaded');
      }
      // @ts-ignore
      model = await handpose.load();
      runDetection();
    }

    async function main() {
      try {
        setIsLoading(true);

        let video = await loadVideo();

        videoWidth = video.videoWidth;
        videoHeight = video.videoHeight;

        canvas = canvasRef.current!;
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        drawingContext = canvas.getContext("2d");
        if (!drawingContext) throw new Error("Could not get 2D context");

        drawingContext.clearRect(0, 0, videoWidth, videoHeight);

        drawingContext.fillStyle = "white";
        drawingContext.translate(canvas.width, 0);
        drawingContext.scale(-1, 1);

        await continuouslyDetectLandmarks(video);

        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize");
        setIsLoading(false);
      }
    }

    main();

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
      <h1 className="text-2xl font-bold text-white mb-4">Gesture Detection V2</h1>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg z-10">
          <p className="text-xl text-white">Loading model and camera...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 rounded-lg z-10">
          <p className="text-xl text-white">Error: {error}</p>
        </div>
      )}

      <div className="relative">
        <canvas ref={canvasRef} className="border-4 border-blue-500 rounded-lg" />
        <video ref={videoRef} className="absolute top-0 left-0 invisible" />
        {gesture && <h1 className="absolute bottom-8 right-8 text-8xl">{gesture}</h1>}
      </div>
    </div>
  );
}
