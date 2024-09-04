import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChartPostsLikes = () => {
  const [posts, setPosts] = useState([]);
  const PieChartPostLikesRef = useRef(null);

  useEffect(() => {

    fetch(`http://localhost:5000/getPostsAdmin`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        setPosts(res.sort(function (a, b) { return (b.likes.length) - (a.likes.length); }).slice(0, 5));
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;

    const data = {
      labels: posts.map(post => `Publicación ${post.id} - ${post.fecha}`),
      datasets: [{
        label: 'Número de Likes',
        data: posts.map(post => post.likes.length),
        backgroundColor: [
          '#F34927',
          '#F5E32E',
          '#2787F3',
          '#B344F7',
          '#47F744',
        ],
        hoverOffset: 5
      }]
    };

    const config = {
      type: 'pie',
      data: data,
    };

    const myChart = new Chart(PieChartPostLikesRef.current, config);

    return () => myChart.destroy();
  }, [posts]);

  return (
    <div style={{ width: "500px", height: "500px" }}>
      <canvas ref={PieChartPostLikesRef}></canvas>
    </div>
  );
};

export default PieChartPostsLikes;