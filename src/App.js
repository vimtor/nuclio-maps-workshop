import React, {useEffect, useState} from "react";
import {ComposableMap, Geographies, Geography, ZoomableGroup} from "react-simple-maps";
import ReactTooltip from "react-tooltip";

const geographyUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"

function App() {
    const [visitedCountries, setVisitedCountries] = useState([]);
    const [tooltipContent, setTooltipContent] = useState("");

    useEffect(() => {
        setVisitedCountries(JSON.parse(localStorage.getItem("visitedCountries")) || []);
    }, [])

    useEffect(() => {
        localStorage.setItem("visitedCountries", JSON.stringify(visitedCountries));
    }, [visitedCountries])

    return (
        <section>
            <h1>✈️ You visited {visitedCountries.length} of 177 countries</h1>
            <ReactTooltip>{tooltipContent}</ReactTooltip>
            <ComposableMap height={400} projectionConfig={{scale: 300}}>
                <ZoomableGroup data-tip="" zoom={1} center={[350, 20]}>
                    <Geographies geography={geographyUrl}>
                        {({geographies}) =>
                            geographies.map(geo => {
                                const visited = visitedCountries.includes(geo.rsmKey)
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        className={`geography ${visited ? "visited" : "unvisited"}`}
                                        geography={geo}
                                        onMouseEnter={() => {
                                            setTooltipContent(geo.properties.NAME);
                                        }}
                                        onMouseLeave={() => {
                                            setTooltipContent("");
                                        }}
                                        onClick={() => {
                                            if (visited) {
                                                setVisitedCountries(visitedCountries.filter(country => country !== geo.rsmKey))
                                            } else {
                                                setVisitedCountries([...visitedCountries, geo.rsmKey])
                                            }
                                        }}
                                    />
                                )
                            })}
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
        </section>
    );
}

export default App;
