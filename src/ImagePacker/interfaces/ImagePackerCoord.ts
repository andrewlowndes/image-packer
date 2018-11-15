import { ImagePackerDimension } from "./ImagePackerDimension";

export interface ImagePackerCoord<T extends ImagePackerDimension = ImagePackerDimension> {
  x: number;
  y: number;
  img: T;
}