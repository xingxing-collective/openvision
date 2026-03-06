import { ObjectDetector } from '../packages/openvision/src/index'

/**
 * Detect objects in still images on click
 */
async function handleClick(event: any) {
  return await ObjectDetector.detect({
    vision: {
      basePath: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm"
    },
    detector: {
      options: {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite`,
          delegate: "GPU"
        },
        scoreThreshold: 0.5,
        runningMode: 'IMAGE'
      }
    },
    detect: {
      image: event.target
    }
  })
}

window.onload = function () {
  const img = document.querySelector(".detectOnClick")?.querySelector('img')
  img?.addEventListener('click', async function (e) {
    const detections = await handleClick(e)
    console.log(detections)
  })
}