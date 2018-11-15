import { ImagePackerCoord } from "./ImagePackerCoord";
import { ImagePackerDimension } from "./ImagePackerDimension";
export interface ImagePackerAtlas<T extends ImagePackerDimension = ImagePackerDimension> {
    coords: Array<ImagePackerCoord<T>>;
    width: number;
    height: number;
}
