import React, { Component } from 'react'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';


class Maps extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.setState({ lat, lng })
        this.props.getGeoCode(`${lat}, ${lng}`)
      });
    }
  }

  onMarkerDragEnd = (coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    this.setState({ lat, lng });
    this.props.getGeoCode(`${lat}, ${lng}`)
  };

  render() {
    const { lat, lng } = this.state
    if (lat && lng) {
      return (
        <Map
          google={this.props.google}
          style={{
            width: "50%",
            height: "300px"
          }}
          initialCenter={{ lat, lng }}
        >
          <Marker
            position={{ lat, lng }}
            draggable={true}
            onDragend={(t, map, coord) => this.onMarkerDragEnd(coord)}
          />
        </Map>
      );
    } else {
      return null
    }
  }
}


export default GoogleApiWrapper({
  apiKey: "AIzaSyCOsyifA4MYEGZQo2AaAwhvsPqxFs3mafE"
})(Maps)