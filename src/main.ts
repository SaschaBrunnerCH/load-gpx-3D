import EsriMap from "esri/Map";
import SceneView from "esri/views/SceneView";
import GeoJSONLayer from "esri/layers/GeoJSONLayer";
import Expand from "esri/widgets/Expand";
import DropTarget from "./widgets/DropTarget";
import { readFileAsText } from "./utils/readFileAsText";
import ElevationProfile from "esri/widgets/ElevationProfile";
import ElevationProfileLineGround from "esri/widgets/ElevationProfile/ElevationProfileLineGround";

import { gpx } from "togeojson";
import { whenNotOnce } from "esri/core/watchUtils";
import { SimpleRenderer } from "esri/renderers";
import { LineSymbol3D, LineSymbol3DLayer } from "esri/symbols";

let map: EsriMap;
let view: SceneView;

map = new EsriMap({
    basemap: "satellite",
    ground: "world-elevation"
});

view = new SceneView({
    map: map,
    container: "viewDiv",
    qualityProfile: "high",
    environment: {
        atmosphere: { quality: "high" }
    },
    ui: {
        components: ["attribution"]
    }
});

(window as any).view = view;

const infoExpand = new Expand({
    expandIconClass: "esri-icon-description",
    expandTooltip: "Instructions",
    expanded: true,
    view: view,
    content: document.getElementById("infoDiv")
});
view.ui.add(infoExpand, "top-left");

const epw = new ElevationProfile({
    view,
    profiles: [new ElevationProfileLineGround({ color: [0, 132, 255] })],
    visibleElements: {
        selectButton: false,
        sketchButton: false,
        settingsButton: false
    }
});

view.ui.add(epw, "top-right");

view.container.addEventListener("dragenter", closeInstructions, false);

function closeInstructions() {
    infoExpand.expanded = false;
};

view.when(function () {
    let target = new DropTarget({
        view: view,
        drop: (dataTransfer: DataTransfer) => {
            const files = dataTransfer.files;
            const file = files[0];
            return file;
        }
    });
    view.ui.add(target);
    target.on("drop", async (event) => {

    })
    target.on("drop", async (event) => {

        const gpxcontent = await readFileAsText(event.item);
        const geojson = [
            JSON.stringify(
                gpx(new DOMParser().parseFromString(gpxcontent, "text/xml"))
            )
        ];
        const geojsonurl = URL.createObjectURL(
            new Blob(geojson, {
                type: "text/plain"
            })
        );

        const template = {
            title: "{name}",
            content: "Route {time}"
        };

        const geojsonLayer = new GeoJSONLayer({
            url: geojsonurl,
            title: event.item.name.replace(/(.*)\.gpx/, "$1"),
            popupTemplate: template,
            renderer: new SimpleRenderer({
                symbol: new LineSymbol3D({
                    symbolLayers: [
                        new LineSymbol3DLayer({
                            material: { color: "white" },
                            size: "6px"
                        }),
                        new LineSymbol3DLayer({
                            material: { color: "red" },
                            size: "3px"
                        })
                    ]
                })
            }),
            elevationInfo: {
                mode: "on-the-ground"
            }
        });

        map.add(geojsonLayer);

        await geojsonLayer.load();

        selectLayer(geojsonLayer);

        await whenNotOnce(view, "updating");
        const screenshot = await view.takeScreenshot({ width: 200, height: 200 });
        const slide = document.createElement("div");
        slide.style.backgroundImage = `url('${screenshot.dataUrl}')`;
        document.getElementById("slides").appendChild(slide);

        slide.textContent = geojsonLayer.title;
        slide.classList.add("slide");

        slide.addEventListener("dblclick", (ev) => {
            selectLayer(geojsonLayer, false);
            ev.stopPropagation();
            ev.preventDefault();
        });

        slide.addEventListener("click", (ev) => {
            selectLayer(geojsonLayer, true);
            ev.stopPropagation();
            ev.preventDefault();
        });
    });
});

async function selectLayer(layer: GeoJSONLayer, animate = true): Promise<void> {
    const extent = layer.fullExtent.clone();
    extent.expand(3);

    view.goTo({ target: extent }, { animate });
    const { features } = await layer.queryFeatures();

    if (features.length) {
        console.log("selected feature 1 of", layer.title);
        epw.input = features[0];
    } else {
        epw.input = null;
    }

}
