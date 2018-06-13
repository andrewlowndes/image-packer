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

export class ImagePacker {
  public static createAltas(imgs: Array<ImagePackerDimension>): ImagePackerAtlas {
    const imgSizes = imgs.reduce((acc, img) => {
        acc.set(img, img.width * img.height);
        return acc;
      }, new Map<ImagePackerDimension, number>());
    
    let widthList = imgs.slice(0).sort((a, b) => {
        return b.width - a.width;
      }),
      heightList = imgs.slice(0).sort((a, b) => {
        return b.height - a.height;
      }),
      sizeList = imgs.slice(0).sort((a, b) => {
        return imgSizes.get(b) - imgSizes.get(a);
      });
    
    // - the first square will consist of [empty, largestHeight, largestWidth, empty]
    const largestWidthImg = widthList[0],
      largestHeightImg = heightList[0],
      coords: Array<ImagePackerCoord> = [];
    
    createAtlasImg(0, largestHeightImg.height, largestWidthImg);
    createAtlasImg(largestWidthImg.width, 0, largestHeightImg);
    fillSquare(0, 0, largestWidthImg.width, largestHeightImg.height);
    fillSquare(largestWidthImg.width, largestHeightImg.height, largestHeightImg.width, largestWidthImg.height);
    
    //then to minimize the size by placing the largest portrait to the right of the box and the largest landscape to the bottom of the box, until we have used all of the images
    let rectWidth = largestWidthImg.width + largestHeightImg.width,
      rectHeight = largestWidthImg.height + largestHeightImg.height;
    
    //attempt to remain an image that is square as possible
    while(sizeList.length) {        
      if (rectWidth < rectHeight) {
        const nextHighest = widthList[0]; //heightList[0]; //this should be more optimal if we had merged whitespace test
        
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
    
    //we should then have a min size that we need to contain all of our images
    function createAtlasImg(x: number, y: number, img: ImagePackerDimension) {
      coords.push({ x,  y, img });

      widthList.splice(widthList.indexOf(img), 1);
      heightList.splice(heightList.indexOf(img), 1);
      sizeList.splice(sizeList.indexOf(img), 1);
    }
    
    function fillSquare(x: number, y: number, width: number, height: number): boolean {
      if (!width || !height) {
        return false;
      }
      
      //find a suitable image to put into the square
      let foundImg: ImagePackerDimension;
      
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
      
      //improve: we could store this empty space and merge the space before we test
      return false;
    }
    
    return { coords, width: rectWidth, height: rectHeight };
  }
}
