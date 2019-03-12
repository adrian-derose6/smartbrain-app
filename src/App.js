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
      imageUrl: ''
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    console.log('click');
    this.setState({ imageUrl: this.state.input})

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {
      console.log(response)
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <div className="App" >
        <Particles
          className='particles'
          params={particlesOptions} /> 
        <Navigation />
        <Logo />
        <div>
          <Rank />
          <ImageLinkForm 
            onInputChange={this.onInputChange}
            onClick={this.onButtonSubmit}
           />
        </div>
        <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
