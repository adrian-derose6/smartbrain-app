import React, { Component } from 'react';
import 'tachyons';
import Particles from 'react-particles-js';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

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

const initialState = {
  input: '',
  imageUrl: '',
  boxDimensions: {},
  route: 'signIn',
  isSignedIn: false,
  user: {
    id:'',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  calculateFaceLocation = (data) => {
    const boundingBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    const { right_col, left_col, top_row, bottom_row } = boundingBox;
    const image = document.getElementById('input-image');
    const imageWidth = Number(image.width);
    const imageHeight = Number(image.height);

    this.setState({
      boxDimensions: {
        top: top_row * imageHeight,
        bottom: imageHeight - bottom_row * imageHeight, 
        left: left_col * imageWidth,
        right: imageWidth - right_col * imageWidth, 
      }
    });
  }

  loadUser = (user) => {
    this.setState({ user: {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      entries: user.entries,
      joined: user.joined
    }});
    console.log(this.state.user);
  }

  onRouteChange = (route) => {
    if (route === 'signIn') {
      this.setState(initialState);
    }
    else if (route === 'main') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route });
    console.log(this.state.route)
  }

  appRouter = () => {
    switch (this.state.route) {
      case 'signIn':
        return (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        );
      case 'main':
          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <Logo />
                <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
              </div>
                <Rank name={this.state.user.name} entries={this.state.user.entries} />
                <ImageLinkForm 
                  onInputChange={this.onInputChange}
                  onClick={this.onButtonSubmit}
                />
                <FaceRecognition imageUrl={this.state.imageUrl} boxDimensions={this.state.boxDimensions} />
            </div>
          );
      case 'register':
            return <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
      default: 
            return <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input, isPending: true })

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {
      if (response) {
        fetch('http://localhost:4000/image', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }))
        })
        .catch(console.log)
      }
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
        {this.appRouter()}
      </div>
    );
  }
}

export default App;
