import React from 'react';

import '../../App.css';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxDimensions }) => {

    const { width, height, top, right, bottom, left } = boxDimensions;
    const locationStrings = { top: `${top}px`, bottom: `${bottom}px`, right: `${right}px`, left: `${left}px`};
    const dimensionStrings = { width: `${width}px`, height: `${height}px` }

    return (
        <div className='center ma container'>
            <div className='absolute mt2 img-container'>
                <img id='input-image' src={imageUrl} alt='sample' width='500px' height='auto' />
                <div className='face-box' style={Object.assign({}, locationStrings, dimensionStrings)}></div>
            </div>
        </div>
    )
}

export default FaceRecognition;