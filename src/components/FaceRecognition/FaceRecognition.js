import React from 'react';

import '../../App.css';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxDimensions }) => {

    const { top, right, bottom, left } = boxDimensions;

    return (
        <div className='center ma container'>
            <div className='absolute mt2 img-container'>
                <img id='input-image' src={imageUrl} alt='sample' width='500px' height='auto' />
                <div className='face-box' style={{ top, right, bottom, left }}></div>
            </div>
        </div>
    )
}

export default FaceRecognition;