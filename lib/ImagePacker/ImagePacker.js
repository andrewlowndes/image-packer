"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createAtlas(imgs) {
    var imgSizes = imgs.reduce(function (acc, img) {
        acc.set(img, img.width * img.height);
        return acc;
    }, new Map());
    var widthList = imgs.slice(0).sort(function (a, b) {
        return b.width - a.width;
    }), heightList = imgs.slice(0).sort(function (a, b) {
        return b.height - a.height;
    }), sizeList = imgs.slice(0).sort(function (a, b) {
        return imgSizes.get(b) - imgSizes.get(a);
    });
    var largestWidthImg = widthList[0], largestHeightImg = heightList[0], coords = [], createAtlasImg = function (x, y, img) {
        coords.push({ x: x, y: y, img: img });
        widthList.splice(widthList.indexOf(img), 1);
        heightList.splice(heightList.indexOf(img), 1);
        sizeList.splice(sizeList.indexOf(img), 1);
    }, fillSquare = function (x, y, width, height) {
        if (!width || !height) {
            return false;
        }
        var foundImg;
        if (sizeList.some(function (img) {
            if (img.width <= width && img.height <= height) {
                foundImg = img;
                return true;
            }
        })) {
            createAtlasImg(x, y, foundImg);
            if (fillSquare(x + foundImg.width, y, width - foundImg.width, height)) {
                fillSquare(x, y + foundImg.height, foundImg.width, height - foundImg.height);
            }
            else {
                fillSquare(x, y + foundImg.height, width, height - foundImg.height);
            }
            return true;
        }
        return false;
    };
    createAtlasImg(0, largestHeightImg.height, largestWidthImg);
    createAtlasImg(largestWidthImg.width, 0, largestHeightImg);
    fillSquare(0, 0, largestWidthImg.width, largestHeightImg.height);
    fillSquare(largestWidthImg.width, largestHeightImg.height, largestHeightImg.width, largestWidthImg.height);
    var rectWidth = largestWidthImg.width + largestHeightImg.width, rectHeight = largestWidthImg.height + largestHeightImg.height;
    while (sizeList.length) {
        if (rectWidth < rectHeight) {
            var nextHighest = widthList[0];
            createAtlasImg(rectWidth, 0, nextHighest);
            fillSquare(rectWidth, nextHighest.height, nextHighest.width, rectHeight - nextHighest.height);
            rectWidth += nextHighest.width;
        }
        else {
            var nextWidest = heightList[0];
            createAtlasImg(0, rectHeight, nextWidest);
            fillSquare(nextWidest.width, rectHeight, rectWidth - nextWidest.width, nextWidest.height);
            rectHeight += nextWidest.height;
        }
    }
    return { coords: coords, width: rectWidth, height: rectHeight };
}
exports.createAtlas = createAtlas;
var ImagePacker = (function () {
    function ImagePacker() {
    }
    ImagePacker.createAltas = createAtlas;
    return ImagePacker;
}());
exports.ImagePacker = ImagePacker;
