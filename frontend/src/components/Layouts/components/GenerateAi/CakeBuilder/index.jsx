import React, { useState, useRef, useContext } from 'react';
import html2canvas from 'html2canvas';
import CakeControl from '../CakeControl';
import CakeCanvas from '../CakeCanvas';
import ImageDownloader from '~/components/Layouts/components/ImageDownloader';
import { AddToCartContext } from '~/components/Layouts/DefaultLayout';
import { createInstance } from '~/redux/interceptors';
import { loginSuccess } from '~/redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { generateImage, editImage } from '~/api/apiAI';
import { uploadcloudinary } from '~/api/apiAI';
import axios from 'axios';

function CakeBuilder() {
    const [numLayers, setNumLayers] = useState(null);
    const [shape, setShape] = useState(null);
    const [baseColor, setBaseColor] = useState(null);
    const [midCream, setMidCream] = useState(null);
    const [topColorSecondLayer, setTopColorSecondLayer] = useState(null);
    const [topCream, setTopCream] = useState(null);
    const [sugar, setSugar] = useState(null);
    const [layers, setLayers] = useState([]);
    const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const inputRef = useRef(null);
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    let instance = createInstance(user, dispatch, loginSuccess);
    const { setIsLogin } = useContext(AddToCartContext);
    const cakeCanvasRef = useRef(null);
    const imagePath = '/src/assets/images_ai/';

    // const apiInstance = axios.create(); 

    const resetCake = () => {
        setNumLayers(null);
        setShape(null);
        setBaseColor(null);
        setMidCream(null);
        setTopColorSecondLayer(null);
        setTopCream(null);
        setSugar(null);
        setLayers([]);
        setGeneratedImageUrl(null);
    };

    const updateLayers = (newLayer, layerType, removeShapeLayer = false) => {
        setLayers((prev) => {
            let updated = prev.filter((l) => l.type !== layerType);
            if (removeShapeLayer) updated = updated.filter((l) => l.type !== 'shape');
            if (newLayer) updated.push(newLayer);
            const order = ['shape', 'base', 'midCream', 'topColorSecondLayer', 'topCream', 'sugar'];
            updated.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
            return updated;
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        const { itemType, itemName } = data;
        switch (itemType) {
            case 'numLayers':
                handleSelectNumLayers(+itemName);
                break;
            case 'shape':
                handleSelectShape(itemName);
                break;
            case 'baseColor':
                handleSelectBaseColor(itemName);
                break;
            case 'midCream':
                if (numLayers === 2 && baseColor) handleSelectMidCream(itemName);
                break;
            case 'topColorSecondLayer':
                if (numLayers === 2 && midCream) handleSelectTopColorSecondLayer(itemName);
                break;
            case 'topCream':
                if ((numLayers === 1 && baseColor) || (numLayers === 2 && topColorSecondLayer)) handleSelectTopCream(itemName);
                break;
            case 'sugar':
                if (topCream) handleSelectSugar(itemName === 'yes');
                break;
            default:
                console.warn('Unknown itemType on drop:', itemType);
        }
    };

    // const buildPrompt = () => {
    //     let prompt = `A cake with ${numLayers === 1 ? 'one layer' : 'two layers'}, `;
    //     if (shape) prompt += `${shape} shape, `;
    //     if (baseColor) prompt += `base color ${baseColor}, `;
    //     if (numLayers === 2 && midCream) prompt += `mid cream ${midCream}, `;
    //     if (numLayers === 2 && topColorSecondLayer) prompt += `second layer color ${topColorSecondLayer}, `;
    //     if (topCream) prompt += `top cream ${topCream}, `;
    //     if (sugar) prompt += `with sugar icing.`;
    //     else if (sugar === false) prompt += `without sugar icing.`;
        
    //     prompt += ` Realistic photo, high quality, studio lighting.`;
    //     return prompt;
    // };

    // const handleGenerateImage = async () => {
    //     if (!user) {
    //       setIsLogin(true);
    //       return;
    //     }
    //     const isLastStepSelected = topCream !== null || sugar !== null;
    //     if (!isLastStepSelected) {
    //         const confirmGenerate = window.confirm(
    //             'Bạn chưa hoàn thành các bước tùy chỉnh cuối cùng của bánh. Bạn có muốn tạo ảnh không?'
    //         );
    //         if (!confirmGenerate) {
    //             return;
    //         }
    //     }

    //     const prompt = buildPrompt();
    //     console.log("Generating image with prompt:", prompt);

    //     setIsGenerating(true);
    //     setGeneratedImageUrl(null);

    //     try {
    //         // const token = localStorage.getItem('userToken');
            
    //         // if (!token) {
    //         //     alert("Bạn cần đăng nhập để tạo ảnh.");
    //         //     setIsGenerating(false);
    //         //     return;
    //         // }

    //         const response = await generateImage(prompt, instance);
    //         console.log(response);
    //         if (response && response.file_url) {
    //             setGeneratedImageUrl(response.file_url);
    //             await uploadcloudinary(image, instance);
    //         } else if (response && response.message) {
    //             alert(`Lỗi tạo ảnh: ${response.message}`);
    //         } else {
    //             alert('Không thể tạo ảnh. Vui lòng thử lại.');
    //         }
    //     } catch (error) {
    //         console.error('Error generating image:', error);
    //         alert('Đã xảy ra lỗi khi tạo ảnh. Vui lòng thử lại sau.');
    //     } finally {
    //         setIsGenerating(false);
    //     }
    // };

    const handleEditImage = async () => {
        if (!user) {
          setIsLogin(true);
          return;
        }
        const isLastStepSelected = topCream !== null || sugar !== null; 
        
        if (!isLastStepSelected) {
            const confirmGenerate = window.confirm(
                'Bạn chưa hoàn thành các bước tùy chỉnh cuối cùng của bánh. Bạn có muốn tạo ảnh không?'
            );
            if (!confirmGenerate) {
                return;
            }
        }

        setIsGenerating(true);
        setGeneratedImageUrl(null);

        try {
            // const token = localStorage.getItem('userToken');
            
            // if (!token) {
            //     alert("Bạn cần đăng nhập để tạo ảnh.");
            //     setIsGenerating(false);
            //     return;
            // }

            const canvas = await html2canvas(cakeCanvasRef.current, {
                backgroundColor: null,
                scale: 2,
            });

            const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

            const formData = new FormData();
            formData.append('file', imageBlob, 'cake_design.png');
            // console.log("handleEditImage: Instance BEFORE API call:", instance);
            // console.log("handleEditImage: Is instance valid BEFORE API call?", instance && typeof instance.post === 'function');
            // const response = await editImage(user.access_token, formData, instance);
            const response = await editImage(formData, instance);
            console.log(response);
            if (response && response.file_url) {
                setGeneratedImageUrl(response.file_url);
                await uploadcloudinary(generatedImageUrl, instance);
            } else if (response && response.message) {
                alert(`Lỗi tạo ảnh: ${response.message}`);
            } else {
                alert('Không thể tạo ảnh. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error generating image:', error);
            alert('Đã xảy ra lỗi khi tạo ảnh. Vui lòng thử lại sau.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectNumLayers = (count) => {
        resetCake();
        setNumLayers(count);
    };

    const handleSelectShape = (s) => {
        setShape(s);
        setBaseColor(null);
        setMidCream(null);
        setTopColorSecondLayer(null);
        setTopCream(null);
        setSugar(null);
        setLayers([{ type: 'shape', image: `${s}_form.png` }]);
    };

    const handleSelectBaseColor = (c) => {
        setBaseColor(c);
        setMidCream(null);
        setTopColorSecondLayer(null);
        setTopCream(null);
        setSugar(null);
        updateLayers({ type: 'base', image: `${shape}_base_${c}.png` }, 'base', true);
    };

    const handleSelectMidCream = (c) => {
        setMidCream(c);
        setTopColorSecondLayer(null);
        setTopCream(null);
        setSugar(null);
        updateLayers({ type: 'midCream', image: `${shape}_mid_${c}.png` }, 'midCream');
    };

    const handleSelectTopColorSecondLayer = (c) => {
        setTopColorSecondLayer(c);
        setTopCream(null);
        setSugar(null);
        updateLayers({ type: 'topColorSecondLayer', image: `${shape}_base_${c}.png` }, 'topColorSecondLayer');
    };

    const handleSelectTopCream = (c) => {
        setTopCream(c);
        setSugar(null);
        updateLayers({ type: 'topCream', image: `${shape}_top_${c}.png` }, 'topCream');
    };

    const handleSelectSugar = (yes) => {
        setSugar(yes);
        if (yes) updateLayers({ type: 'sugar', image: `${shape}_sugar.png` }, 'sugar');
        else updateLayers(null, 'sugar');
    };

    const skip = (typesToSkip) => {
        setLayers((prevLayers) => {
            const updated = prevLayers.filter((layer) => !typesToSkip.includes(layer.type));
            if (typesToSkip.includes('sugar')) setSugar(null);
            if (typesToSkip.includes('topCream')) setTopCream(null);
            if (typesToSkip.includes('topColorSecondLayer')) setTopColorSecondLayer(null);
            if (typesToSkip.includes('midCream')) setMidCream(null);
            if (typesToSkip.includes('base')) setBaseColor(null);
            if (typesToSkip.includes('shape')) setShape(null);
            return updated;
        });
    };

    return (
        <div className="flex w-full flex-col gap-8 p-4 lg:flex-row">
            <div className="w-full lg:w-1/2">
                <CakeControl
                    numLayers={numLayers}
                    shape={shape}
                    baseColor={baseColor}
                    midCream={midCream}
                    topColorSecondLayer={topColorSecondLayer}
                    topCream={topCream}
                    sugar={sugar}
                    onSelectNumLayers={handleSelectNumLayers}
                    onSelectShape={handleSelectShape}
                    onSelectBaseColor={handleSelectBaseColor}
                    onSelectMidCream={handleSelectMidCream}
                    onSelectTopColorSecondLayer={handleSelectTopColorSecondLayer}
                    onSelectTopCream={handleSelectTopCream}
                    onSelectSugar={handleSelectSugar}
                    onSkipShape={() => skip(['shape', 'base', 'midCream', 'topColorSecondLayer', 'topCream', 'sugar'])}
                    onSkipBaseColor={() => skip(['base', 'midCream', 'topColorSecondLayer', 'topCream', 'sugar'])}
                    onSkipMidCream={() => skip(['midCream', 'topColorSecondLayer', 'topCream', 'sugar'])}
                    onSkipTopColorSecondLayer={() => skip(['topColorSecondLayer', 'topCream', 'sugar'])}
                    onSkipTopCream={() => skip(['topCream', 'sugar'])}
                    onSkipSugar={() => skip(['sugar'])}
                />
            </div>

            <div className="relative w-full lg:w-1/2">
                <div className="sticky top-4 flex flex-col items-center gap-4">
                    <div
                        ref={cakeCanvasRef}
                        className="flex h-[320px] w-[320px] items-center justify-center rounded bg-gray-100 px-[10px] shadow-inner"
                    >
                        <div className="translate-x-[3px]">
                            <CakeCanvas
                                layers={layers.map((layer) => ({ ...layer, src: `${imagePath}${layer.image}` }))}
                                numLayers={numLayers}
                                onDrop={handleDrop}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            // onClick={handleGenerateImage}
                            onClick={handleEditImage}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white shadow hover:bg-blue-700"
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Đang tạo...' : 'Tạo ảnh'}
                        </button>
                        <button
                            onClick={resetCake}
                            className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Hiển thị ảnh được tạo từ API */}
                    {generatedImageUrl && (
                        <div className="mt-8 flex flex-col items-center gap-4">
                            <h3 className="text-lg font-semibold">Ảnh đã tạo từ AI:</h3>
                            <img
                                src={generatedImageUrl}
                                alt="AI Generated Cake"
                                className="w-[300px] h-[300px] object-contain rounded-lg shadow-md"
                            />
                            {/* <button
                                onClick={handleDownloadGeneratedImage}
                                className="rounded-lg bg-green-600 px-5 py-2 text-white shadow hover:bg-green-700"
                            >
                                Tải ảnh
                            </button> */}
                            <ImageDownloader imageUrl={generatedImageUrl} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CakeBuilder;
