# Camera Navigation - Gesture Detection

Web application for gesture detection using computer vision with TensorFlow.js and Handpose.

## 📝 Description

This project uses the browser's camera to detect hand gestures in real-time, recognizing patterns such as:
- 👍 Thumbs Up
- ✌️ Victory
- 👎 Thumbs Down

## 🚀 Technologies

- **TensorFlow.js** - Machine learning framework
- **Handpose** - Hand detection model
- **FingerPose** - Gesture recognition library
- **HTML5 Canvas** - Visual rendering
- **WebRTC** - Camera access

## 📋 Prerequisites

- Modern web browser with WebRTC support
- Camera connected to the device
- Local web server (due to CORS policy)

## 🔧 How to Run

1. Clone the repository:
```bash
git clone <repository-url>
cd camera-navigation
open index.html
```

2. Allow camera access when prompted

## 📁 Project Structure

```
camera-navigation/
├── index.html          # Main interface
├── index.js            # Gesture detection logic
├── package.json        # Project configuration
├── .gitignore         # Files ignored by Git
└── README.md          # Documentation
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