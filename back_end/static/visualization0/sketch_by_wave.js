//  NOTE: Rending the decenders on letter is an extra
//  bomus project ;)

var theWords = "爱"; //
var theWordsSize = 40; //  font just small enough that the
//  edges are "blurred" when rendering

var noiseTickle = 0.0; //  A counter to cycle the random noise
var noiseMod = 0.1; //  How fast to "wiggle" the lines
var yLines = 75; //  How many vertical lines we want
var xDivs = 100; //  How many Horizontal divisions we want

var theWordPixels = null; //  Holds the array of pixels[] generated
var sWidth = null; //  The (int) width of the word
var sHeight = null; //  The (int) height of the word
var targetHeight = null; //  The maximum sizes we want to display
var targetWidth = null; //  The word at (func of canvas size).
var newHeight = null; //  The final width and height we'll
var newWidth = null; //  show the words at

var pixelCheckXmin = null; //  The area of the canvas where we will
var pixelCheckYmin = null; //  me drawing the word. Used for checking
var pixelCheckXmax = null; //  the pixel array
var pixelCheckYmax = null;

var baseHeightMod = null; //  base vertival height of wiggle lines
var riseHeightMod = null; //  extra height where the word is
var xStep = null; //  distance between the verticals lines
var yStep = null; //  and the horizontal divisions

var doDraw = true; //  used for debugging.


//  SETUP FOR THE SETUP GODS
function setup() {

    //  NOTE: To make things faster we load up the word
    //  onto a canvas and pull the pixel values from them.
    //  Because in p5js we can only pull the pixel values
    //  from the display window we can't just use an offscreen
    //  image (we couldn't if we went outside P5js a bit).
    //  So to be pure p5js we are doing it this way.
    //
    //  If we extended we could update the word/image during
    //  the draw cycle based on user input. There's a number
    //  of ways to do this, left as an exercise for the
    //  reader ;)

    //  Make a canvas just large enough to hold the word
    textSize(theWordsSize);
    sWidth = Math.floor(textWidth(theWords));
    sHeight = int(theWordsSize);
    createCanvas(sWidth, sHeight);

    //  Write the word to the canvas
    background(0);
    noStroke();
    fill(255);
    textSize(theWordsSize);
    text(theWords, 0, theWordsSize);

    //  Load in the pixels into the pixel array
    //  and store them
    loadPixels();
    theWordPixels = pixels;

    //  Work out the frame we are going to need
    //  to hold the text in with the lines
    calcWordSize();

    //  Now that's all done, lets set the canvas
    //  to the correct full window size
    createCanvas(windowWidth, windowHeight);
    background(0);
    strokeWeight(1.5);

}

//  Should we resize the window, we need to
//  recalculate a bunch of stuff
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    calcWordSize();
    background(0);
}

//  This function works out all the sizes
//  dimensions and what-not to display the
//  word based on the windowSize. In short
//  it tries to make it look good at all
//  sizes rather than just having hardcoded
//  base values
function calcWordSize() {

    //  This is the smaller than window size box
    //  we will try and put the word into
    targetHeight = int(windowHeight * 0.8);
    targetWidth = int(windowWidth * 0.8);

    //  This is the new width and height the
    //  word will be to fully fit the height
    //  we want.
    newHeight = int(targetHeight);
    newWidth = int((targetHeight / sHeight) * sWidth);

    //  But if the word is then too long for
    //  the width we want, we'll make it the
    //  width and scale down the height a bit.
    if (newWidth > targetWidth) {
        newWidth = targetWidth;
        newHeight = int((targetWidth / sWidth) * sHeight);
    }

    //  This is the rectangle in the middle of
    //  the canvas were we want to a) pay attention
    //  and b) draw the word
    pixelCheckXmin = (windowWidth / 2) - (newWidth / 2);
    pixelCheckYmin = (windowHeight / 2) - (newHeight / 2);
    pixelCheckXmax = pixelCheckXmin + newWidth;
    pixelCheckYmax = pixelCheckYmin + newHeight;

    //  Work out the step values we need in our
    //  loops to give us the number of lines and
    //  divisions we want
    yStep = windowHeight / yLines;
    xStep = windowWidth / xDivs;
    //  To a limit anyway.
    if (yStep < 6) yStep = 6;

    //  The base wiggle height and modified height
    //  where the words are is based on
    //  the window height. As the window
    //  gets heigher the wiggles do to, etc.
    riseHeightMod = windowHeight * 0.00025;
    baseHeightMod = windowHeight * 0.0125;

}

// DRAW FOR THE DRAW GODDESS
function draw() {

    //  This is a bit of debug to make the thing
    //  only draw once
    if (doDraw == false) return;

    //  PAINT IT BLACK!
    background(0);

    //  Get ready to draw the lines
    fill(0);

    //  Here are some variables we are going to be
    //  using inside the loops, but don't want to
    //  be recreating them each time.
    var heightMod = null;
    var getX = null;
    var getY = null;
    var pixelPull = null;
    var c = null;

    //  Draw a whole bunch of horizontal lines
    for (var y = 40; y < windowHeight; y += yStep) {

        //  Make the colour fade off towards the top
        //  because why not.
        stroke(map(y, 0, windowHeight, 0, 255));

        //  The line is actually a solid filled shape with the
        //  line draw along the top. The black fill covers up
        //  the previous line giving it depth.
        beginShape();

        //  Because awkward we draw the first two points twice
        //  to fix the curve to the starting position. The
        //  "- (baseHeightMod/2)" is so the starting point will
        //  be roughly vertically alligned with the first
        //  random point.
        curveVertex(0, y - (baseHeightMod / 2));
        curveVertex(0, y - (baseHeightMod / 2));

        //  Now we do through all the divisions
        for (var x = xStep; x < windowWidth; x += xStep) {

            //  We are always going to modifying the wiggle height
            //  by the base amount.
            heightMod = baseHeightMod;

            //  If we are withing the pixelCheck area (where)
            //  we are going to draw the word, then we
            //  need to have a larger heightMod
            if (
                x > pixelCheckXmin &&
                x < pixelCheckXmax &&
                y > pixelCheckYmin &&
                y < pixelCheckYmax
            ) {

                //  Work out where from the pixel array we are going to pull
                //  the pixel values. For example if we are 50% of the way
                //  across the pixelCheck area, then we need to pull
                //  the pixel value from 50% of the way through the
                //  original word's pixels we stored in the array.
                //
                //  NOTE: we have slight modifiers on the end (0.8 & 0.9) this
                //  is because p5js seems to add a bit of padding into the end
                //  of the size it things text will be. So a 5 letter word will
                //  have 5 lots of whitespace padding at the end(why? I dunno)
                //  The extra mod allows us to workaround that a bit
                //
                //  NOTE 2: At this point we could do something with much
                //  longer strings. Where instead of grabbing the pixels from
                //  anywhere along the words we have a sliding window of fixed
                //  size (based on the windowWidth) and moves back and forth
                //  along the words. This would give the effect of scrolling words.
                //  Again exercise left to the forking reader.
                getX = int(map(x, pixelCheckXmin, pixelCheckXmax, 0, sWidth * 0.8));
                getY = int(map(y, pixelCheckYmin, pixelCheckYmax, 0, sHeight * 0.9));

                //  Go grab the pixel from the pixel array. It wil be
                //  white where the letters are, black where they aren't
                //  and somewhere inbetween around the edges. The smaller
                //  we render the original words the more blurred edges
                //  there are.
                pixelPull = ((getY * sWidth) + getX) * 4;

                //  Now we grab the pixel value for red ('cause we are
                //  dealing with B&W we only need one of the rgb values).
                //  The value will be between 0-255, so we need to scale
                //  that right down, which is done with the riseHeightMod
                //  (which itself is a function of the windowHeight).
                //  And then throw the baseeightMod on, to make it line
                //  up with the rest of the lines.
                heightMod = (theWordPixels[pixelPull] * riseHeightMod) + baseHeightMod;
            }

            //  Finally, we add the point, where the y value is adjusted
            //  by the noise function, the value (0-1) is modified by
            //  the heightMod, which is either the baseHeightMod or
            //  a higher value where the word is.
            curveVertex(x, y - (noise(x, y, noiseTickle) * heightMod));
        }

        //  Close off the curve with two fixed points at the
        //  end of the line, just as we started them.
        curveVertex(windowWidth, y - (baseHeightMod / 2));
        curveVertex(windowWidth, y - (baseHeightMod / 2));
        endShape();
    }

    //  Increase the noiseTickle
    noiseTickle += noiseMod;

    //  If we only want the scene to draw once (so we can
    //  debug by outputting values to the console)
    //  uncomment the line below
    //doDraw = false;

}