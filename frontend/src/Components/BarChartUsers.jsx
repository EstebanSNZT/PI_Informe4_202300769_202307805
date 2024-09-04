import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';


const BarCharUsers = () => {
    const BarChartUsersRef = useRef(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {

        fetch(`http://localhost:5000/getUsersReports`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                setUsers(res.sort(function (a, b) { return b.posts - a.posts;}).slice(0, 5));
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        if (users.length === 0) return;

        const colors = ['#FF9F40', '#FFCE56', '#FF7F0E', '#4BC0C0', '#9966FF', '#FF6384', '#32A852', '#36A2EB', '#D62728', '#9467BD'];

        const data = {
            labels: users.map(user => (user.codigo + "\n" + user.nombres + " " + user.apellidos)),
            datasets: [{
                label: 'Número de Posts del Usuario',
                data: users.map(user => user.posts),
                backgroundColor: colors.slice(0, users.length),
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        const myChart = new Chart(BarChartUsersRef.current, config);

        return () => myChart.destroy();
    }, [users]);

    return (
        <div style={{ width: "500px", height: "500px"}}>
            <canvas ref={BarChartUsersRef} style={{ width: "100%", height: "100%" }}></canvas>
        </div>
    );
};

export default BarCharUsers;