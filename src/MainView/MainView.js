import React, { useState, useEffect } from "react";
import GeoJSON from 'ol/format/GeoJSON'

import MapComponent from "../MapComponent/MapComponent"

import "./MainView.css";
import "../../node_modules/ol/ol.css";

const MainView = () => {

    const [ features, setFeatures ] = useState([]);

    useEffect( () => {

        fetch('/mock-geojson-api.json')
          .then(response => response.json())
          .then( (fetchedFeatures) => {
            const wktOptions = {
              dataProjection: 'EPSG:28992',
              featureProjection: 'EPSG:3857'
            }
            const parsedFeatures = new GeoJSON().readFeatures(fetchedFeatures, wktOptions)
            setFeatures(parsedFeatures)
    
          })
    
      },[])

    return (
        <MapComponent features={features} />
    );
};

export default MainView;
