import * as THREE from 'three';
import * as fabric from 'fabric';


const drawStartPos = new THREE.Vector2();

function setupCanvasDrawing(child) {
    console.log('child',child);
    // get canvas and context

    const drawingCanvas = document.getElementById( 'canvas133' );
    const drawingContext = drawingCanvas.getContext( '2d' );
    child.material.map = new THREE.CanvasTexture( drawingCanvas );
    // draw white background

    drawingContext.fillStyle = '#FFFFFF';
    drawingContext.fillRect( 0, 0, 1000, 1000);

    // set canvas as material.map (this could be done to any map, bump, displacement etc.)

    //drawingCanvas.repeat.set(12,12);

    
   
    console.log('childcanvas',drawingCanvas);
    // set the variable to keep track of when to draw

    let paint = false;

    // add canvas event listeners
    drawingCanvas.addEventListener( 'pointerdown', function ( e ) {

        paint = true;
        drawStartPos.set( e.offsetX, e.offsetY );

    } );

    drawingCanvas.addEventListener( 'pointermove', function ( e ) {

        if ( paint ) draw( drawingContext, e.offsetX, e.offsetY ,child);

    } );

    drawingCanvas.addEventListener( 'pointerup', function () {

        paint = false;

    } );

    drawingCanvas.addEventListener( 'pointerleave', function () {

        paint = false;

    } );

}

function draw( drawContext, x, y ,child) {

    drawContext.moveTo( drawStartPos.x, drawStartPos.y );
    drawContext.strokeStyle = '#000000';
    drawContext.lineTo( x, y );
    drawContext.stroke();
    // reset drawing start position to current position.
    drawStartPos.set( x, y );
    child.material.map.needsUpdate = true;
    console.log('11',child.material.map.needsUpdate)
    // need to flag the map as needing updating.
    

}
// child.material.map = new THREE.CanvasTexture( drawingCanvas );
//child.material.map.needsUpdate = true;
export { setupCanvasDrawing };