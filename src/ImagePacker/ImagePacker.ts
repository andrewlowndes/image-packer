import { ImagePackerDimension } from "./interfaces/ImagePackerDimension";
import { ImagePackerAtlas } from "./interfaces/ImagePackerAtlas";
import { ImagePackerCoord } from "./interfaces/ImagePackerCoord";

export function createAtlas<T extends ImagePackerDimension = ImagePackerDimension>(imgs: Array<T>): ImagePackerAtlas<T> {
  const imgSizes = imgs.reduce((acc, img) => {
      acc.set(img, img.width * img.height);
      return acc;
    }, new Map<T, number>());
  
  let widthList = imgs.slice(0).sort((a, b) => {
      return b.width - a.width;
    }),
    heightList = imgs.slice(0).sort((a, b) => {
      return b.height - a.height;
    }),
    sizeList = imgs.slice(0).sort((a, b) => {
      return imgSizes.get(b) - imgSizes.get(a);
    });
  
  const largestWidthImg = widthList[0],
    largestHeightImg = heightList[0],
    coords: Array<ImagePackerCoord<T>> = [],
    createAtlasImg = function(x: number, y: number, img: T) {
      coords.push({ x,  y, img });

      widthList.splice(widthList.indexOf(img), 1);
      heightList.splice(heightList.indexOf(img), 1);
      sizeList.splice(sizeList.indexOf(img), 1);
    },
    fillSquare = function(x: number, y: number, width: number, height: number): boolean {
      if (!width || !height) {
        return false;
      }
      
      //find a suitable image to put into the square
      let foundImg: T;
      
      if (sizeList.some((img) => {
        if (img.width <= width && img.height <= height) {
          foundImg = img;
          return true;
        }
      })) {
        createAtlasImg(x, y, foundImg);
        
        //attempt to have two holes where the right side takes up the bottom right space
        if (fillSquare(x+foundImg.width, y, width-foundImg.width, height)) {
          fillSquare(x, y+foundImg.height, foundImg.width, height - foundImg.height);
        } else {
          //if that does not work out then attempt to fill the bottom space as the large space
          fillSquare(x, y+foundImg.height, width, height - foundImg.height);
        }
        
        return true;
      }
      
      //TODO: we could store this empty space and merge the whitespace before we test for a more optimal result
      return false;
    };
  
  // first create a first square consisting of [empty, largestHeight, largestWidth, empty] and try and fill the empty sections
  createAtlasImg(0, largestHeightImg.height, largestWidthImg);
  createAtlasImg(largestWidthImg.width, 0, largestHeightImg);
  fillSquare(0, 0, largestWidthImg.width, largestHeightImg.height);
  fillSquare(largestWidthImg.width, largestHeightImg.height, largestHeightImg.width, largestWidthImg.height);
  
  //now we know for sure that the remaining images will fit the right and bottom of the square so minimize the size by placing the largest portrait to the right of the box and the largest landscape to the bottom of the box, until we have used all of the images
  let rectWidth = largestWidthImg.width + largestHeightImg.width,
    rectHeight = largestWidthImg.height + largestHeightImg.height;
  
  //decide where to place the next image based on how square the output is
  while(sizeList.length) {        
    if (rectWidth < rectHeight) {
      const nextHighest = widthList[0]; //heightList[0]; //this would be more efficient if we had merged whitespace
      
      createAtlasImg(rectWidth, 0, nextHighest);
      fillSquare(rectWidth, nextHighest.height, nextHighest.width, rectHeight - nextHighest.height);
      rectWidth += nextHighest.width;
    } else {
      const nextWidest = heightList[0]; //widthList[0];
      
      createAtlasImg(0, rectHeight, nextWidest);
      fillSquare(nextWidest.width, rectHeight, rectWidth-nextWidest.width, nextWidest.height);
      rectHeight += nextWidest.height;
    }
  }
  
  return { coords, width: rectWidth, height: rectHeight };
}

export class ImagePacker {
  /**
   * @deprecated Use createAtlas
   */
  public static createAltas = createAtlas;
}
