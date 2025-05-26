import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as fabric from 'fabric';
import api from '../lib/api';
import SidebarPanel from './canvas/SidebarPanel';
import TopMenu from './canvas/TopMenu';
import LayerPanel from './canvas/LayerPanel';

export default function CanvasEditor() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [waitingForQrImage, setWaitingForQrImage] = useState(false);
    const { id } = useParams();

    const isInitializingRef = useRef(false);
    const undoStackRef = useRef([]);
    const redoStackRef = useRef([]);

    const BASE_IMAGES = {
        moble: '/base-moble.png',
        catifa: '/base-catifa.png',
        lampara: '/base-lampara.png',
    };
    const IMAGE_PATHS = {
        moble: "m 71.04348,367.54385 c 9.03015,-9.86667 30.36437,-2.07448 44.36737,-4.56699 134.95289,0.32771 269.9211,-0.89342 404.86184,1.13317 12.32581,1.02737 6.47421,44.83625 21.18001,28.7753 -1.15224,-23.06764 8.46107,15.95646 12.26764,24.9648 -1.37816,16.11288 21.21356,15.27551 11.79333,-0.34187 -4.38282,-21.54585 -8.70198,-43.10603 -12.67529,-64.73174 23.96245,3.20128 14.49969,-23.08782 16.13868,-37.796 -0.12215,-35.34512 0.21044,-70.69352 -0.11988,-106.03615 -11.11876,-18.07161 -35.14964,-25.55224 -56.03847,-22.74795 -138.67601,0.78247 -277.35879,1.41107 -416.029105,-0.13209 -22.640377,-1.56282 -57.283004,-3.72003 -59.774889,25.13251 0.532926,45.78639 -1.039741,91.86618 0.73169,137.47182 27.22301,-0.99275 3.432411,35.74704 4.692545,52.35202 -1.825038,9.23669 -12.355334,41.13218 6.415705,26.36742 3.886933,-20.70078 17.641074,-32.59945 20.364646,-53.32731 l 0.907623,-3.26008 0.916982,-3.25681 z",
        catifa: "m 555.12341,791.13074 c 24.08608,-7.17125 50.46776,1.64003 75.24215,1.47191 40.65226,8.42049 28.3669,-39.55595 30.41775,-63.71741 -3.4823,-19.94024 0.16454,-45.8026 -0.74407,-62.03979 0,-27.15006 0,-54.30011 0,-81.45016 2.64261,-18.55139 -3.69456,-47.80836 -0.34228,-71.18062 -0.12303,-55.65383 0.17473,-111.95049 0.21373,-167.89134 -1.3934,-41.45035 1.34994,-83.19418 0.18947,-124.69884 C 656.17269,178.6713 660.5664,135.35064 659.03614,92.1076 651.74638,67.373184 678.96761,12.569227 639.26121,13.984263 617.48423,8.5901953 586.80218,13.2859 558.49064,11.997759 c -26.14023,4.526206 -53.70096,-1.193804 -81.31711,-2.043144 -26.56947,3.675536 -51.22,-3.4080994 -80.6366,1.901767 -22.52742,0.863253 -51.95221,-0.217592 -76.04827,0.02658 -21.63793,-0.894291 -45.6481,-1.081735 -64.15129,0.236277 -22.33674,-0.04392 -43.74209,-2.2002056 -68.90868,0.721095 -29.2257,-5.6732342 -56.27736,4.722784 -45.2284,37.53167 -1.46848,30.694136 0.88239,61.369315 -0.80772,92.054105 2.43706,53.23817 0.74615,106.07213 0.56419,159.35854 0.31618,25.99348 1.54274,55.19976 1.89757,81.74597 -4.38425,34.08113 0.8429,68.92969 -0.86236,103.93698 2.00288,22.90487 -2.3035,54.0873 -0.0389,70.1839 -0.94781,31.7557 1.33146,64.13606 0.0386,96.37494 -2.03248,28.1349 -0.40453,57.32188 1.97163,84.03204 -5.30701,27.39369 -5.32831,60.54244 29.26976,51.95895 27.45981,3.02392 53.34258,-2.13972 78.59214,2.84068 35.43644,-0.23693 70.68431,-0.27891 106.16011,-2.90206 23.80467,2.51135 42.42347,1.15004 64.97647,0.0455 28.5442,-1.75433 49.24912,3.90932 78.38578,-1.99186 17.86935,2.33667 35.83548,-0.97823 52.77585,3.12106 z",
        lampara: "m 692.51367,1264.8918 c -9.90843,-49.542 -2.24711,-100.1128 -0.72471,-147.0808 12.20166,-23.1808 28.27501,-67.8536 43.24341,-87.3352 -64.68935,1.0559 -56.97411,-82.35214 0.71466,-79.76694 -32.79371,-51.25405 37.45287,-31.40571 75.98987,-34.70637 125.42108,-3.81079 251.8854,-1.20953 376.3716,-14.95022 -2.2211,-68.29074 -22.7977,-138.59934 -33.3392,-207.31818 C 1121.2411,505.84066 1089.0755,317.66995 1054.3838,130.001 1003.1416,71.667943 913.82205,75.979901 842.44979,63.344124 709.88266,51.904669 575.93331,53.228737 443.27218,62.101406 382.26414,70.347979 317.94831,78.392752 262.79916,107.42622 c -42.9883,67.56382 -33.70443,159.89725 -55.01326,237.46161 -31.06967,183.6716 -66.83576,366.7211 -94.68909,550.80724 61.49617,25.0041 142.52,9.57437 211.59993,17.14396 88.17619,0.22805 169.64026,4.01843 257.29787,4.16988 -24.43848,32.72499 9.84304,37.97302 33.01257,57.62785 28.96694,44.92144 -53.35209,44.85844 -43.87085,67.73914 34.96914,32.9498 38.07111,76.0672 46.1109,110.4079 17.90551,119.3736 -36.2963,230.2284 -55.14365,345.2342 -25.13207,63.3412 38.93103,123.1178 33.28956,169.3294 11.99484,46.351 -66.32472,80.756 -84.09063,127.5969 -35.60695,24.358 -94.97498,11.605 -118.37352,52.6952 -26.60495,36.4808 -64.52275,73.5157 -68.86114,119.158 41.30311,51.0071 121.86878,38.5552 182.94034,51.6608 116.34342,12.0045 230.85117,9.2396 346.73132,-3.6967 28.02117,-10.4 103.59174,-1.848 130.96396,-53.1743 -13.72481,-43.5805 -44.41243,-80.4336 -70.41497,-115.8969 -43.14156,-48.7548 -145.90252,-27.0962 -157.85275,-112.8137 -62.52252,-30.9627 -62.65925,-91.1856 -16.22122,-135.5535 36.68082,-113.6306 -38.57676,-221.5307 -47.7007,-332.4335",
    };

    const saveState = () => {
        if (!canvas || isInitializingRef.current) return;
        const json = canvas.toJSON(['src']);
        const lastState = undoStackRef.current[undoStackRef.current.length - 1];
        if (JSON.stringify(lastState) !== JSON.stringify(json)) {
            undoStackRef.current.push(json);
            redoStackRef.current = [];
        }
    };

    // Inicialitza Fabric.js
    useEffect(() => {

        const canvasWidth = Math.min(window.innerWidth * 0.9, 1000);
        const canvasHeight = Math.min(window.innerHeight * 0.8, 1000);

        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: 'transparent',
            selection: false,
        });

        setCanvas(fabricCanvas);

        const addListeners = () => {
            fabricCanvas.on('object:added', () => {
                console.log('Objecte afegit');
                saveState();
            });
            fabricCanvas.on('object:modified', () => {
                console.log('Objecte modificat');
                saveState();
            });
            fabricCanvas.on('object:removed', () => {
                console.log('Objecte eliminat');
                saveState();
            });
        };

        addListeners();

        return () => {
            fabricCanvas.dispose();
        }
    }, []);

    // Segon useEffect per evitar errors quan canvas es null (només quan canvia el canvas o l'id)
    useEffect(() => {
        if (!canvas) return;
        isInitializingRef.current = true;

        api.get(`/designs/${id}`)
            .then(res => {
                const designData = res.data?.data;
                const designType = res.data?.type;
                const imgMoble = BASE_IMAGES[designType];
                const pathMoble = IMAGE_PATHS[designType];

                fabric.Image.fromURL(imgMoble).then((img) => {
                    const canvasW = canvas.getWidth();
                    const canvasH = canvas.getHeight();

                    const scaleX = canvasW / img.width;
                    const scaleY = canvasH / img.height;
                    const scale = Math.min(scaleX, scaleY);

                    img.scaleX = scale;
                    img.scaleY = scale;
                    img.originX = 'center';
                    img.originY = 'center';
                    img.left = canvasW / 2;
                    img.top = canvasH / 2;

                    canvas.backgroundImage = img;
                    canvas.requestRenderAll();

                    // clipPath (retall de la zona de dibuix)
                    setTimeout(() => {
                        const clipPath = new fabric.Path(pathMoble, {
                            originX: 'center',
                            originY: 'center',
                            left: canvasW / 2,
                            top: canvasH / 2,
                            absolutePositioned: true
                        });

                        // Escalat segons tipus
                        const clipScales = {
                            moble: 1.64,
                            catifa: 0.696,
                            lampara: 0.25,
                        };
                        const scaleFactor = clipScales[designType];
                        clipPath.scale(scaleFactor);

                        canvas.clipPath = clipPath;

                        canvas.requestRenderAll();
                    });
                }, 0);

                if (designData) {
                    canvas.loadFromJSON(designData, () => {
                        setTimeout(() => { // Per a que el renderAll s'executi correctament abans que el canvas carregui els objectes
                            canvas.renderAll();
                            canvas.calcOffset();
                            saveState();
                            isInitializingRef.current = false;

                        }, 0);
                    });
                } else {
                    isInitializingRef.current = false;
                }
            })
            .catch(err => {
                console.error('Error carregant el disseny:', err);
            });
    }, [canvas, id]);


    // useEffect per quan arriba l'imatge del QR, inserir-la automàticament
    useEffect(() => {
        if (!waitingForQrImage || !canvas) return;

        const interval = setInterval(async () => {
            try {
                console.log("ID:", id);
                const res = await api.get(`/designs/${id}`);
                const imageUrl = res.data?.image_url;
                const fullImageUrl = `http://localhost:3000${imageUrl}`;
                console.log("URL:", fullImageUrl);

                if (fullImageUrl) {
                    const img = await fabric.Image.fromURL(fullImageUrl);

                    const canvasW = canvas.getWidth();
                    const canvasH = canvas.getHeight();

                    const maxWidth = 150;
                    const scaleFactor = maxWidth / img.width;

                    img.scale(scaleFactor);

                    img.originX = 'center';
                    img.originY = 'center';
                    img.left = canvas.getWidth() / 2;
                    img.top = canvas.getHeight() / 2;

                    img.set({ src: fullImageUrl }); // Guardat imatges
                    canvas.add(img);
                    canvas.setActiveObject(img);
                    canvas.requestRenderAll();

                    await api.delete(`/designs/${id}/image`);

                    clearInterval(interval);
                    setWaitingForQrImage(false);
                }
            } catch (error) {
                console.error('Error comprovant imatge pujada:', error);
            }
        }, 2000);

        return () => {
            clearInterval(interval);
        }
    }, [waitingForQrImage, canvas, id]);


    const handleSave = async () => {
        if (!canvas) return;
        const jsonDisseny = canvas.toJSON(['src']);

        try {
            await api.put(`/designs/${id}`, { data: jsonDisseny/*, type: designType*/ });
            alert('Disseny desat correctament');
        } catch (err) {
            console.error('Error desant el disseny:', err);
            alert('No s’ha pogut desar');
        }
    };

    const handleUndo = () => {
        if (!canvas || undoStackRef.current.length === 0) return;
        const current = canvas.toJSON(['src']);
        redoStackRef.current.push(current);
        const prev = undoStackRef.current.pop();
        canvas.loadFromJSON(prev, () => {
            canvas.renderAll();
        });
    };

    const handleRedo = () => {
        if (!canvas || redoStackRef.current.length === 0) return;
        const current = canvas.toJSON(['src']);
        undoStackRef.current.push(current);
        const next = redoStackRef.current.pop();
        canvas.loadFromJSON(next, () => {
            canvas.renderAll();
        });
    };

    const handleExport = () => {
        if (!canvas) return;
        const dataURL = canvas.toDataURL({ format: 'png' });
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'disseny.png';
        a.click();
    };


    return (
        <div className="flex h-screen">
            <div className="flex flex-col">
                <TopMenu onSave={handleSave} onExport={handleExport} onUndo={handleUndo} onRedo={handleRedo} />
                <SidebarPanel canvas={canvas} onSave={handleSave} designId={id} onTriggerQr={() => setWaitingForQrImage(true)} />
            </div>
            <LayerPanel canvas={canvas} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <canvas ref={canvasRef} className="border border-black rounded-sm shadow-sm" />
            </div>
        </div >
    );
}
