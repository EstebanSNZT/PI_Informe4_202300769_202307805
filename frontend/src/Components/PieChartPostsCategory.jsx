import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChartPostsCategory = () => {

    const PieChartPostCategoryRef = useRef(null);
    const [categorys, setCategorys] = useState([]);

    useEffect(() => {

        fetch(`http://localhost:5000/getCategoryReports`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                setCategorys(res);
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        if (categorys.length === 0) return;

        const data = {
            labels: categorys.map(category => category.nombre),
            datasets: [{
                label: 'Número de Posts',
                data: categorys.map(category => category.posts),
                backgroundColor: [
                    '#AD1D12',
                    '#12AD8C',
                    '#BEB911',
                    '#1EBE11',
                ],
                hoverOffset: 5
            }]
        };

        const config = {
            type: 'pie',
            data: data,
        };

        const myChart = new Chart(PieChartPostCategoryRef.current, config);

        return () => myChart.destroy();
    }, [categorys]);

    return (
        <div style={{ width: "500px", height: "500px" }}>
            <canvas ref={PieChartPostCategoryRef}></canvas>
        </div>
    );
};

export default PieChartPostsCategory;