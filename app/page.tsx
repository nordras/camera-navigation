import GestureDetector from "@/components/GestureDetectorV2";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Gesture Detection</h1>
      <GestureDetector />
    </main>
  );
}
