import React, { useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as MapboxDraw from "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import "./index.css";
import { GlobalContext } from "../context/GlobalContext";

const styles = {
  width: "98%",
  height: "88%",
  position: "absolute",
  marginTop: "-10px",
};

const LotesEncuestas = () => {
  const URL = process.env.REACT_APP_URL;

  const { dataLotes } = useContext(GlobalContext);

  const [geoJSON, setGeoJSON] = useState([]);
  // const [dataGeoJSON, setDataGeoJSON] = useState([]);
  const [map, setMap] = useState(null);

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoiZ29uemFsb2I5OCIsImEiOiJjazZtM2V2eHowbHJ2M2xwdTRjMXBncDJjIn0.C0dqUfziJu3E1o8lFxmfqQ";
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;

    //console.log('ENTRANDO');

    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-streets-v11",
        center: [-63.1617707, -35.004224],
        zoom: 5,
      });

      map.on("load", () => {
        setMap(map);
        map.resize();

        const draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: false,
            point: false,
            trash: false,
          },
          userProperties: true,
        });
        map.addControl(draw);
        map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

        //* DIBUJAR PARA TODOS LOS LOTES
        if (geoJSON.length > 0 && geoJSON[0].length > 0) {
          for (let j = 0; j < geoJSON.length; j++) {
            random = random + 1;
            item = j + random;

            map.addSource(`lote-${item}`, {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "Polygon",
                      coordinates: [geoJSON[j]],
                    },
                  },
                ],
              },
            });

            map.addLayer({
              id: `lote-layer-${item}-line`,
              type: "line",
              source: `lote-${item}`,
              paint: {
                "line-color": "rgba(255,212,2,1)",
                "line-opacity": 0.8,
              },
            });

            map.addLayer({
              id: `lote-layer-${item}-fill`,
              type: "fill",
              source: `lote-${item}`,
              paint: {
                "fill-color": "rgba(255,212,2,0.6)",
              },
            });
          }
        }
      });

      //!

      //! INICIO - CENTRAR MAPBOX

      //* CENTRAR PARA TODOS LOS LOTES
      var random = 0;
      var item = 0;
      if (geoJSON.length > 0 && geoJSON[0].length > 0) {
        var maxX = geoJSON[0][0];
        var minX = geoJSON[0][0];
        var maxY = geoJSON[0][1];
        var minY = geoJSON[0][1];

        for (let i = 0; i < geoJSON.length; i++) {
          const coord = geoJSON[i];

          if (coord[0] > maxX) {
            maxX = coord[0];
          } else if (coord[0] < minX) {
            minX = coord[0];
          }

          if (coord[1] > maxY) {
            maxY = coord[1];
          } else if (coord[1] < minY) {
            minY = coord[1];
          }
        }
        var bounds = [
          [maxX, maxY],
          [minX, minY],
        ];

        //* centrado de viewport con turf
        var geojsonBounds = turf.bbox({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                coordinates: [bounds[0]],
                type: "Polygon",
              },
            },
            {
              type: "Feature",
              properties: {},
              geometry: {
                coordinates: [bounds[1]],
                type: "Polygon",
              },
            },
          ],
        });
        map.fitBounds(geojsonBounds, { padding: 10, zoom: 12 });
      }

      //! FIN - CENTRAR MAPBOX
    };
    if (!map) initializeMap({ setMap, mapContainer });
  });




  //! CONVERSION DEL DATA LOTES A GEOJSON
  function convertirGeoJSON(dataLotes) {
    setGeoJSON([]);
    var result = [];
    for (var i = 0; i < dataLotes.length; i++) {
      var lot_geojson = JSON.parse(dataLotes[i].lot_geojson);
      var coordinates = [];
      for (var j = 0; j < lot_geojson.length; j++) {
        var lon = lot_geojson[j][0];
        var lat = lot_geojson[j][1];
        coordinates.push([lon, lat]);
      }
      result.push(coordinates);
    }
    setGeoJSON(result);
    console.log("result geojson: ", result);
    return result;
  }

  useEffect(() => {
    if (dataLotes && dataLotes[0]?.lot_geojson.length > 0) {
      convertirGeoJSON(dataLotes);
    }
  }, [dataLotes]);

  return (
    <>
      <div ref={(el) => (mapContainer.current = el)} style={styles} />
    </>
  );
};

export default LotesEncuestas;
