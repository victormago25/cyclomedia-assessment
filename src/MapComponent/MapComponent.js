// React import
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

// Openlayers import
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import MousePosition from "ol/control/MousePosition";
import { transform } from "ol/proj";
import { register } from "ol/proj/proj4";
import { createStringXY } from "ol/coordinate";
import { defaults } from "ol/control";
import XYZ from "ol/source/XYZ";
import OSM from "ol/source/OSM";

// proj4 import
import proj4 from "proj4";

import "ol/ol.css";

const MapComponent = ({ features }) => {
    const [map, setMap] = useState();
    const [featuresLayer, setFeaturesLayer] = useState();

    proj4.defs(
        "EPSG:28992",
        "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs"
    );

    register(proj4);

    const mapElement = useRef();

    const mapRef = useRef();
    mapRef.current = map;

    useEffect(() => {
        const mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(5),
            projection: "EPSG:28992",
            undefinedHTML: "&nbsp;",
        });

        const raster = new TileLayer({
            source: new OSM(),
        });

        const key = "Ndzl2PLC9HFIJEnpdH25";
        const attributions =
            '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
            '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

        // const raster = new TileLayer({
        //     source: new XYZ({
        //         attributions: attributions,
        //         url:
        //             "https://api.maptiler.com/tiles/nl-topraster/{z}/{x}/{y}.png?key=" +
        //             key,
        //         maxZoom: 20,
        //     }),
        // });

        const initalFeaturesLayer = new VectorLayer({
            source: new VectorSource(),
        });

        // create map
        const initialMap = new Map({
            target: mapElement.current,
            controls: defaults().extend([mousePositionControl]),
            layers: [raster, initalFeaturesLayer],
            view: new View({
                center: transform(
                    [142892.19, 470783.87],
                    "EPSG:28992",
                    "EPSG:3857"
                ),
                zoom: 8,
            }),
        });

        setMap(initialMap);
        setFeaturesLayer(initalFeaturesLayer);
    }, []);

    useEffect(() => {
        if (features.length) {
            featuresLayer.setSource(
                new VectorSource({
                    features: features,
                })
            );
            map.getView().fit(featuresLayer.getSource().getExtent(), {
                padding: [100, 100, 100, 100],
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [features]);

    return (
        <div>
            <div ref={mapElement} className="map-container"></div>
        </div>
    );
};

MapComponent.propTypes = {
    features: PropTypes.array,
};

export default MapComponent;
