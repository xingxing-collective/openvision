import {
  FilesetResolver,
  ObjectDetector as Detector,
  type ImageSource,
  type ObjectDetectorResult as DetectorResult,
  type ObjectDetectorOptions as DetectorOptions
} from '@mediapipe/tasks-vision'

export namespace ObjectDetector {

  export type ObjectDetectorResult = DetectorResult

  /**
  * Copyright 2022 The MediaPipe Authors.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */
  /** An object containing the locations of the Wasm assets */
  export interface WasmFileset {
    /** The path to the Wasm loader script. */
    wasmLoaderPath: string;
    /** The path to the Wasm binary. */
    wasmBinaryPath: string;
    /** The optional path to the asset loader script. */
    assetLoaderPath?: string;
    /** The optional path to the assets binary. */
    assetBinaryPath?: string;
  }

  export function createVision(basePath?: string) {
    return FilesetResolver.forVisionTasks(basePath)
  }

  export function createDetector(
    vision: WasmFileset,
    options: DetectorOptions
  ) {
    return Detector.createFromOptions(vision, options)
  }

  /**
 * Defines a rectangle, used e.g. as part of detection results or as input
 * region-of-interest.
 *
 * The coordinates are normalized with respect to the image dimensions, i.e.
 * generally in [0,1] but they may exceed these bounds if describing a region
 * overlapping the image. The origin is on the top-left corner of the image.
 */
  export interface RectF {
    left: number;
    top: number;
    right: number;
    bottom: number;
  }

  /**
   * Options for image processing.
   *
   * If both region-or-interest and rotation are specified, the crop around the
   * region-of-interest is extracted first, then the specified rotation is applied
   * to the crop.
   */
  export interface ImageProcessingOptions {
    /**
     * The optional region-of-interest to crop from the image. If not specified,
     * the full image is used.
     *
     * Coordinates must be in [0,1] with 'left' < 'right' and 'top' < bottom.
     */
    regionOfInterest?: RectF;
    /**
     * The rotation to apply to the image (or cropped region-of-interest), in
     * degrees clockwise.
     *
     * The rotation must be a multiple (positive or negative) of 90°.
     */
    rotationDegrees?: number;
  }

  export interface ObjectDetectorDetectOptions {
    vision?: {
      basePath?: string
    },
    detector: {
      options: DetectorOptions
    }
    detect: {
      image: ImageSource
      imageProcessingOptions?: ImageProcessingOptions
    }
  }

  export async function detect(opts: ObjectDetectorDetectOptions) {
    const vision = await createVision(opts?.vision?.basePath)
    const detector = await createDetector(vision, opts.detector.options)
    return detector.detect(opts.detect.image, opts.detect?.imageProcessingOptions)
  }
}