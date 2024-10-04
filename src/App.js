import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import './App.css';

Chart.register(...registerables);

function App() {
    const canvasRef = useRef(null);
    const [chart, setChart] = useState(null);
    const [inputs, setInputs] = useState({ x1: '', y1: '', x2: '', y2: '' });
    const [algorithm, setAlgorithm] = useState('basic'); // 'basic' or 'dda'
    const [showResultTable, setShowResultTable] = useState(false);
    const [showResultTableDDA, setShowResultTableDDA] = useState(false);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');

        if (chart) {
            chart.destroy();
        }

        const newChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Line Graph',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'X' } },
                    y: { title: { display: true, text: 'Y' } }
                }
            }
        });

        setChart(newChart);
        return () => {
            newChart.destroy();
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAlgorithmChange = (e) => {
        setAlgorithm(e.target.value);
    };

    const validateInputs = () => {
        const { x1, y1, x2, y2 } = inputs;
        return x1 && y1 && x2 && y2;
    };

    const clearTableAndGraph = () => {
        if (chart) {
            chart.data.labels = [];
            chart.data.datasets[0].data = [];
            chart.update();
        }
    };

    const calculateLineEquation = () => {
        const { x1, y1, x2, y2 } = inputs;
        const x1Num = parseFloat(x1);
        const y1Num = parseFloat(y1);
        const x2Num = parseFloat(x2);
        const y2Num = parseFloat(y2);

        const m = (y2Num - y1Num) / (x2Num - x1Num);
        const b = y1Num - m * x1Num;

        clearTableAndGraph();

        for (let x = x1Num; x <= x2Num; x += 1) {
            const y = m * x + b;
            addPointToGraph(x, y);
        }

        chart.update();
        setShowResultTable(true);
        setShowResultTableDDA(false);
    };

    const calculateDDA = () => {
        const { x1, y1, x2, y2 } = inputs;
        const x1Num = parseFloat(x1);
        const y1Num = parseFloat(y1);
        const x2Num = parseFloat(x2);
        const y2Num = parseFloat(y2);

        const dx = x2Num - x1Num;
        const dy = y2Num - y1Num;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        const xIncrement = dx / steps;
        const yIncrement = dy / steps;

        clearTableAndGraph();
        let x = x1Num;
        let y = y1Num;

        for (let k = 0; k <= steps; k++) {
            const roundedX = Math.round(x);
            const roundedY = Math.round(y);
            addPointToGraph(roundedX, roundedY);
            x += xIncrement;
            y += yIncrement;
        }

        chart.update();
        setShowResultTableDDA(true);
        setShowResultTable(false);
    };

    const addPointToGraph = (x, y) => {
        chart.data.labels.push(x);
        chart.data.datasets[0].data.push(y);
    };

    const clearInputs = () => {
        setInputs({ x1: '', y1: '', x2: '', y2: '' });
        clearTableAndGraph();
        setShowResultTable(false);
        setShowResultTableDDA(false);
    };

    const calculate = () => {
        if (!validateInputs()) {
            alert("Please fill in all fields.");
            return;
        }

        if (algorithm === 'basic') {
            calculateLineEquation();
        } else if (algorithm === 'dda') {
            calculateDDA();
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-5 bg-white rounded-lg shadow-md">
            <h1 className="text-center text-2xl font-bold text-gray-800 mb-5">Computer Graphics</h1>
            <div className="mb-5">
                <label className="block">X1:</label>
                <input type="number" name="x1" value={inputs.x1} onChange={handleInputChange} className="p-2 border border-gray-300 rounded w-full" />
                <label className="block mt-3">Y1:</label>
                <input type="number" name="y1" value={inputs.y1} onChange={handleInputChange} className="p-2 border border-gray-300 rounded w-full" />
                <label className="block mt-3">X2:</label>
                <input type="number" name="x2" value={inputs.x2} onChange={handleInputChange} className="p-2 border border-gray-300 rounded w-full" />
                <label className="block mt-3">Y2:</label>
                <input type="number" name="y2" value={inputs.y2} onChange={handleInputChange} className="p-2 border border-gray-300 rounded w-full" />
            </div>

            <div className="mb-5">
                <label className="block text-gray-700 mb-2">Select Algorithm:</label>
                <div className="flex mb-3">
                    <label className="mr-4">
                        <input
                            type="radio"
                            value="basic"
                            checked={algorithm === 'basic'}
                            onChange={handleAlgorithmChange}
                            className="mr-2"
                        />
                        Basic Line
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="dda"
                            checked={algorithm === 'dda'}
                            onChange={handleAlgorithmChange}
                            className="mr-2"
                        />
                        DDA
                    </label>
                </div>
            </div>

            <button onClick={calculate} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-5">
                Calculate
            </button>
            <button onClick={clearInputs} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mb-5">
                Clear
            </button>

            <canvas ref={canvasRef} id="graphCanvas" className="border border-gray-300 rounded" width="400" height="200"></canvas>

          
        </div>
    );
}

export default App;
