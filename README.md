# Camera Navigation - Gesture Detection

Web application for gesture detection using computer vision with TensorFlow.js, Handpose and Next.js.

## 📝 Description

This project uses the browser's camera to detect hand gestures in real-time, recognizing patterns such as:
- 👍 Thumbs Up
- ✌️ Victory
- 👎 Thumbs Down

## 🚀 Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **TensorFlow.js** - Machine learning framework
- **Handpose** - Hand detection model
- **FingerPose** - Gesture recognition library
- **Tailwind CSS** - Styling
- **WebRTC** - Camera access

## 📋 Prerequisites

- Node.js 18+ installed
- Modern web browser with WebRTC support
- Camera connected to the device

## 🔧 How to Run

1. Clone the repository:
```bash
git clone <repository-url>
cd camera-navigation
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Allow camera access when prompted

## 📁 Project Structure

```
camera-navigation/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   └── GestureDetector.tsx  # Main gesture detection component
├── index.html          # Legacy HTML version (deprecated)
├── index.js            # Legacy JS version (deprecated)
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── next.config.ts      # Next.js configuration
└── README.md           # Documentation
```

## 📄 License

MIT

## ✍️ Author

Igor Ferreira - igorkmail@gmail.com
![alt text](image.png)

## References

https://www.youtube.com/watch?v=sXNZlNrNhpc
https://youtu.be/pON_ftmsR40
https://medium.com/deloitte-uk-tech-blog/how-to-control-desktop-apps-and-websites-using-hand-gestures-e2605283b3a4
https://www.computerworld.com/article/1580856/web-site-uses-camera-for-navigation-by-hand-gestures.html
https://github.com/tensorflow/tfjs-models/tree/master/handpose
https://www.tensorflow.org/js/models