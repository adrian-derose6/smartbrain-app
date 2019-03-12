import React from 'react';

import '../../App.css';

const FaceRecognition = ({ imageUrl }) => {
    return (
        <div className='center ma'>
         {  ( imageUrl !== '' ) ?
            <div className='absolute mt2'>
                <img src={imageUrl} alt='sample' width='500px' height='auto' />
            </div>
            :
            <div></div>
         }
        </div>
    )
}

export default FaceRecognition;