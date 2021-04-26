var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/views/SceneView", "esri/layers/GeoJSONLayer", "esri/widgets/Expand", "./widgets/DropTarget", "./utils/readFileAsText", "esri/widgets/ElevationProfile", "esri/widgets/ElevationProfile/ElevationProfileLineGround", "togeojson", "esri/core/watchUtils", "esri/renderers", "esri/symbols"], function (require, exports, Map_1, SceneView_1, GeoJSONLayer_1, Expand_1, DropTarget_1, readFileAsText_1, ElevationProfile_1, ElevationProfileLineGround_1, togeojson_1, watchUtils_1, renderers_1, symbols_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = __importDefault(Map_1);
    SceneView_1 = __importDefault(SceneView_1);
    GeoJSONLayer_1 = __importDefault(GeoJSONLayer_1);
    Expand_1 = __importDefault(Expand_1);
    DropTarget_1 = __importDefault(DropTarget_1);
    ElevationProfile_1 = __importDefault(ElevationProfile_1);
    ElevationProfileLineGround_1 = __importDefault(ElevationProfileLineGround_1);
    var map;
    var view;
    map = new Map_1.default({
        basemap: "satellite",
        ground: "world-elevation"
    });
    view = new SceneView_1.default({
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
    window.view = view;
    var infoExpand = new Expand_1.default({
        expandIconClass: "esri-icon-description",
        expandTooltip: "Instructions",
        expanded: true,
        view: view,
        content: document.getElementById("infoDiv")
    });
    view.ui.add(infoExpand, "top-left");
    var epw = new ElevationProfile_1.default({
        view: view,
        profiles: [new ElevationProfileLineGround_1.default({ color: [0, 132, 255] })],
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
    }
    ;
    view.when(function () {
        var _this = this;
        var target = new DropTarget_1.default({
            view: view,
            drop: function (dataTransfer) {
                var files = dataTransfer.files;
                var file = files[0];
                return file;
            }
        });
        view.ui.add(target);
        target.on("drop", function (event) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
        target.on("drop", function (event) { return __awaiter(_this, void 0, void 0, function () {
            var gpxcontent, geojson, geojsonurl, template, geojsonLayer, screenshot, slide;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFileAsText_1.readFileAsText(event.item)];
                    case 1:
                        gpxcontent = _a.sent();
                        geojson = [
                            JSON.stringify(togeojson_1.gpx(new DOMParser().parseFromString(gpxcontent, "text/xml")))
                        ];
                        geojsonurl = URL.createObjectURL(new Blob(geojson, {
                            type: "text/plain"
                        }));
                        template = {
                            title: "{name}",
                            content: "Route {time}"
                        };
                        geojsonLayer = new GeoJSONLayer_1.default({
                            url: geojsonurl,
                            title: event.item.name.replace(/(.*)\.gpx/, "$1"),
                            popupTemplate: template,
                            renderer: new renderers_1.SimpleRenderer({
                                symbol: new symbols_1.LineSymbol3D({
                                    symbolLayers: [
                                        new symbols_1.LineSymbol3DLayer({
                                            material: { color: "white" },
                                            size: "6px"
                                        }),
                                        new symbols_1.LineSymbol3DLayer({
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
                        return [4 /*yield*/, geojsonLayer.load()];
                    case 2:
                        _a.sent();
                        selectLayer(geojsonLayer);
                        return [4 /*yield*/, watchUtils_1.whenNotOnce(view, "updating")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, view.takeScreenshot({ width: 200, height: 200 })];
                    case 4:
                        screenshot = _a.sent();
                        slide = document.createElement("div");
                        slide.style.backgroundImage = "url('" + screenshot.dataUrl + "')";
                        document.getElementById("slides").appendChild(slide);
                        slide.textContent = geojsonLayer.title;
                        slide.classList.add("slide");
                        slide.addEventListener("dblclick", function (ev) {
                            selectLayer(geojsonLayer, false);
                            ev.stopPropagation();
                            ev.preventDefault();
                        });
                        slide.addEventListener("click", function (ev) {
                            selectLayer(geojsonLayer, true);
                            ev.stopPropagation();
                            ev.preventDefault();
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    function selectLayer(layer, animate) {
        if (animate === void 0) { animate = true; }
        return __awaiter(this, void 0, void 0, function () {
            var extent, features;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        extent = layer.fullExtent.clone();
                        extent.expand(3);
                        view.goTo({ target: extent }, { animate: animate });
                        return [4 /*yield*/, layer.queryFeatures()];
                    case 1:
                        features = (_a.sent()).features;
                        if (features.length) {
                            console.log("selected feature 1 of", layer.title);
                            epw.input = features[0];
                        }
                        else {
                            epw.input = null;
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
});
//# sourceMappingURL=main.js.map