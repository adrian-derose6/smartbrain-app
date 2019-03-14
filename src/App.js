import React, { Component } from 'react';
import 'tachyons';
import Particles from 'react-particles-js';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import './App.css';

import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '7a900e8228f74929b28b73271d60670d'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxDimensions: {

      },
      isPending: false
    }
  }

  calculateFaceLocation = (data) => {

    const boundingBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    const { right_col, left_col, top_row, bottom_row } = boundingBox;
    const image = document.getElementById('input-image');

    const imageWidth = Number(image.width);
    const imageHeight = Number(image.height);

    console.log(imageWidth, imageHeight);

    this.setState({
      boxDimensions: {
        top: top_row * imageHeight,
        bottom: imageHeight - bottom_row * imageHeight, 
        left: left_col * imageWidth,
        right: imageWidth - right_col * imageWidth, 
      }
    });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    console.log('click');
    this.setState({ imageUrl: this.state.input, isPending: true })

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {
      this.setState({ isPending: false })
      this.calculateFaceLocation(response)
    })
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="App" >
        <Particles
          className='particles'
          params={particlesOptions} /> 
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <Logo />
          <Navigation />
        </div>
        <div>
          
        </div> 
        <div>
          <Rank />
          <ImageLinkForm 
            onInputChange={this.onInputChange}
            onClick={this.onButtonSubmit}
           />
        </div>
        <FaceRecognition imageUrl={this.state.imageUrl} boxDimensions={this.state.boxDimensions} />
      </div>
    );
  }
}

export default App;
