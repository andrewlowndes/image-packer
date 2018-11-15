import { ImagePackerDimension } from "./interfaces/ImagePackerDimension";
import { ImagePackerAtlas } from "./interfaces/ImagePackerAtlas";
export declare function createAtlas<T extends ImagePackerDimension = ImagePackerDimension>(imgs: Array<T>): ImagePackerAtlas<T>;
export declare class ImagePacker {
    static createAltas: typeof createAtlas;
}
