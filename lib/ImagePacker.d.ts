export interface ImagePackerDimension {
    width: number;
    height: number;
}
export interface ImagePackerCoord {
    x: number;
    y: number;
    img: ImagePackerDimension;
}
export interface ImagePackerAtlas {
    coords: Array<ImagePackerCoord>;
    width: number;
    height: number;
}
export declare class ImagePacker {
    static createAltas(imgs: Array<ImagePackerDimension>): ImagePackerAtlas;
}
