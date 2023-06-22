import React, { useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as MapboxDraw from "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import './index.css';
import { GlobalContext } from "../context/GlobalContext";

const styles = {
    width: "100%",
    height: "78%",
    position: "absolute",
};

const LotesEncuestas = () => {
    const {
        setInfoLotes,
        idCliente,
        isTableUpdated,
        setIsTableUpdated,
        showFormAgregar,
        setValorGeoJSON,
        selectedLote,
        importarArchivo,
        coordenadasArchivo,
        selectedCampoGeojson,
        refrescarListLotes,
        setRefrescarListLotes,
        dataLotes, setDataLotes,
    } = useContext(GlobalContext);

    const URL = process.env.REACT_APP_URL;

    const [geoJSON, setGeoJSON] = useState([]);
    const [dataGeoJSON, setDataGeoJSON] = useState([]);
    const [map, setMap] = useState(null);

    const MAPBOX_TOKEN =
        "pk.eyJ1IjoiZ29uemFsb2I5OCIsImEiOiJjazZtM2V2eHowbHJ2M2xwdTRjMXBncDJjIn0.C0dqUfziJu3E1o8lFxmfqQ";
    const mapContainer = useRef(null);

    useEffect(() => {
        mapboxgl.accessToken = MAPBOX_TOKEN;

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
                //* instancia herramientas35.004224
                // if (showFormAgregar && !importarArchivo) {
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
                // }
                map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

                //!
                //* DIBUJAR PARA TODOS LOS LOTES
                if (geoJSON !== "") {
                    var random = 0;

                    for (let i = 0; i < geoJSON.length; i++) {
                        var item = 0;

                        for (let j = 0; j < geoJSON[i].length; j++) {
                            random = random + 1;
                            item = j + random;

                            const lote = geoJSON[i][j];
                            map.addSource(`lote-${item}`, {
                                type: "geojson",
                                data: {
                                    type: "FeatureCollection",
                                    features: [
                                        {
                                            type: "Feature",
                                            properties: {},
                                            geometry: {
                                                coordinates: [lote],
                                                type: "Polygon",
                                            },
                                        },
                                    ],
                                },
                            });

                            map.addLayer({
                                id: `lote-layer-${item}`,
                                type: "line",
                                source: `lote-${item}`,
                                paint: {
                                    "line-color": "rgba(255,212,2,1)",
                                    "line-opacity": 0.8,
                                },
                            });

                            map.addLayer({
                                id: `lote-fill-${item}`,
                                type: "fill",
                                source: `lote-${item}`,
                                paint: {
                                    "fill-color": "rgba(255,212,2,0.6)",
                                },
                            });
                        }
                    }
                }
            });
            //!

            //! INICIO - CENTRAR MAPBOX

            //* CENTRAR PARA TODOS LOS LOTES
            var random = 0;
            var loteL = [];
            var lotesT = [];
            for (let i = 0; i < geoJSON.length; i++) {
                var item = 0;
                for (let j = 0; j < geoJSON[i].length; j++) {
                    random = random + 1;
                    item = j + random;
                    loteL = geoJSON[i][j];
                }
                lotesT.push(loteL);
            }

            if (lotesT.length > 0 && lotesT[0].length > 0) {
                var maxX = lotesT[0][0];
                var minX = lotesT[0][0];
                var maxY = lotesT[0][1];
                var minY = lotesT[0][1];

                for (let i = 0; i < lotesT.length; i++) {
                    const coord = lotesT[i];

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
                map.fitBounds(geojsonBounds, { padding: 10, zoom: 10.3 });
            }

            //! FIN - CENTRAR MAPBOX

            //* geometria dibujada para subir a data base
            map.on("draw.create", (e) => {
                const coordinates = e.features[0].geometry.coordinates[0];
                const formattedCoordinates = JSON.stringify(
                    coordinates,
                    (key, value) => {
                        if (typeof value === "number") {
                            return value.toFixed(6);
                        }
                        return value;
                    }
                ).replace(/"/g, "");
                setValorGeoJSON(formattedCoordinates);
            });

            map.on("draw.update", (e) => {
                const features = e.features;
                const coordinates = features[0].geometry.coordinates[0];

                const formattedCoordinates = JSON.stringify(coordinates, (key, value) => {
                    if (typeof value === "number") {
                        return value.toFixed(6);
                    }
                    return value;
                }).replace(/"/g, "");
                setValorGeoJSON(formattedCoordinates);
            });
        };
        if (!map) initializeMap({ setMap, mapContainer });
    });

    // function infoGeoJSON(idCliente) {
    //     const data = new FormData();
    //     data.append("idC", idCliente);
    //     fetch(`${URL}info_geojson.php`, {
    //         method: "POST",
    //         body: data,
    //     }).then(function (response) {
    //         response.text().then((resp) => {
    //             const data = resp;
    //             const objetoData = JSON.parse(data);
    //             setDataGeoJSON(objetoData);
    //         });
    //     });
    // }


    //!Tengo que recorrer el dataLotes - Acordarse
    var result = [];
    function desarmarGeoJSON() {
        var lengthDG = dataLotes.lot_geojson.length;
        var coordLotes = [];
        for (let i = 0; i < lengthDG; i++) {
            const element = dataLotes.lot_geojson[i].lot_geojson;
            const parsedData = JSON.parse(element);
            for (let i = 0; i < parsedData.length; i++) {
                const pair = parsedData[i];
                const lon = parseFloat(pair[0]);
                const lat = parseFloat(pair[1]);
                coordLotes.push([lon, lat]);
            }
            result.push([coordLotes]);
            coordLotes = [];
        }
        console.log('result geojson: ',result )
        setGeoJSON(result);
    }

    

    // var coordSelect = [];
    // var coordSelectLotes = [];
    // function desarmarLoteSelect() {
    //     // Filtra el GeoJSON solo si selectedLote está definido y tiene la propiedad geojson
    //     if (selectedLote && selectedLote != null) {
    //         const coordinatesString = selectedLote;
    //         const coordenadasJSON = JSON.parse(coordinatesString);
    //         for (let i = 0; i < coordenadasJSON.length; i++) {
    //             const par = coordenadasJSON[i];
    //             const lonl = parseFloat(par[0]);
    //             const latl = parseFloat(par[1]);
    //             coordSelectLotes.push([lonl, latl]);
    //         }
    //         coordSelect.push([coordSelectLotes]);
    //         coordSelectLotes = [];
    //         setGeoJSON(coordSelect);
    //     } else {
    //         desarmarGeoJSON();
    //     }
    // }

    useEffect(() => {
        // if (dataLotes && dataLotes.lot_geojson && dataLotes.lot_geojson.length > 0) {
            desarmarGeoJSON();
        // }
    }, [dataLotes]);
    


    // useEffect(() => {
    //     infoGeoJSON(idCliente);
    // }, []);

    //* EJECUTA LAS FUNCIONES QUE TRAE LA INFO y TRAE LOS DATOS PARA LLENAR TABLA Lotes
    // useEffect(() => {
    //     if (isTableUpdated) {
    //         setIsTableUpdated(false);

    //         if (idCliente) {
    //             const data = new FormData();
    //             data.append("idCli", idCliente);
    //             fetch(`${URL}cliente_lotes.php`, {
    //                 method: "POST",
    //                 body: data,
    //             })
    //                 .then(function (response) {
    //                     response.text().then((resp) => {
    //                         const data = resp;
    //                         const objetoData = JSON.parse(data);
    //                         setInfoLotes(objetoData);
    //                     });
    //                 })
    //                 .catch((error) => {
    //                     console.log("Error fetching data:", error);
    //                 });
    //         }
    //     }
    //     // setRefrescarListLotes(true);
    // }, [idCliente, isTableUpdated]);

    return (
        <>
            <div ref={(el) => (mapContainer.current = el)} style={styles} />
        </>
    );
};

export default LotesEncuestas;