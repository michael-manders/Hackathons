import React, { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Elevator from "../components/Elevator";

import "../assets/css/Visualization.css";

export default class Visualization extends React.Component {
    constructor(props) {
        super(props);
        // make a variable for saving the dataset in
        this.state = {
            dataset: null,
            workorders: null,
            currentAsset: "Electrical Panel",
        };

        // this.updateContent = this.updateContent.bind(this);
    }

    setCurrentAsset = (data) => {
        this.setState({ currentAsset: data }, () => {
            this.updateContent("HVAC");
        });
    };

    async componentDidMount() {
        // fetch the dataset from the API
        await fetch("http://10.9.223.92:5000/getData")
            .then((res) => res.json())
            .then((data) => {
                // save the dataset in the state
                this.setState({
                    dataset: data.data,
                });

                // console.log("dataset loaded");
            });

        await fetch("http://10.9.223.92:5000/getWorkOrders-api")
            .then((res) => res.json())
            .then((data) => {
                // save the dataset in the state
                this.setState({
                    workorders: data.data,
                });

                console.log(data);

                // console.log("workorders loaded");
            });

        this.updateContent("HVAC");
    }

    updateContent(type) {
        type = this.state.currentAsset;

        // get the dataset from the state
        let dataset = this.state.dataset;

        let items = dataset.inventory;
        // filter items
        items = items.filter((item) => {
            return item.type === type;
        });

        // sort by time until repair and exclude ones that are negative
        let sorted = items
            .sort((a, b) => {
                return a.time_until_repair - b.time_until_repair;
            })
            .filter((item) => {
                return item.time_until_repair > 0;
            });

        document.getElementById("atrisk-list").innerHTML = "";

        for (let i = 0; i < sorted.length; i++) {
            const item = document.createElement("div");

            let time = sorted[i].time_until_repair;
            let level = "";
            if (time > 10000) {
                level = "low";
            } else if (time > 4500) {
                level = "medium";
            } else if (time > 0) {
                level = "high";
            }

            item.className = "item" + " " + level;
            item.innerHTML = `
                <div class="attribute top">
                    <div class="item-name key">ID</div>
                    <div class="item-name value">${sorted[i].id}</div>
                </div>

                <div class="attribute top">
                    <div class="item-time key">Floor</div>
                    <div class="item-name value">
                        ${parseInt(sorted[i].floor)}
                    </div>
                </div>

                <div class="attribute top">
                    <div class="item-time key">Time Until Next Repair</div>
                    <div class="item-name value">
                        ${parseInt(sorted[i].time_until_repair)}
                    </div>
                </div>

                <div class="attribute bottom">
                    <div class="last-serviced key">Last Serviced on</div>
                    <div class="last-serviced value">
                        ${sorted[i].last_repair_date}
                    </div>
                </div>

                <div class="attribute bottom">
                    <div class="last-serviced key">Operation Time</div>
                    <div class="last-serviced value">
                        ${sorted[i].op_time}
                    </div>
                </div>

                <div class="attribute bottom">
                    <div class="service-frequency key">Service Frequency</div>
                    <div class="service-frequency value">
                        ${parseInt(sorted[i].avg_time_between_repairs)}
                    </div>
                </div>
            `;

            document.getElementById("atrisk-list").appendChild(item);
        }

        // now make the image of the the item graph thing
        let points = [];
        for (let month in dataset.problematic_months[type]) {
            month = parseInt(month);
            points.push([month, dataset.problematic_months[type][month]]);
        }

        // sort the points by x value
        points = points.sort((a, b) => {
            return a[0] - b[0];
        });

        let x = [];
        let y = [];

        for (let i = 0; i < points.length; i++) {
            x.push(points[i][0]);
            y.push(points[i][1]);
        }

        // console.log(x, y);

        let spline = this.cubicSpline(x, y);

        let graph = document.getElementById("graph");
        graph.innerHTML = "";

        const MONTHS = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "June",
            "July",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
        ];

        let canvas = document.createElement("canvas");
        graph.appendChild(canvas);
        // get element width and height
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;

        canvas.width = width;
        canvas.height = height;

        let ctx = canvas.getContext("2d");
        // cet context width
        ctx.width = width;
        ctx.height = height;

        // draw x and y axis
        const graphColor = "#f6fcfd";
        const chartColor = "#d9633f";
        const max = Math.max(...y) + 2;
        const min = Math.min(...y) - 2;

        let range = max - min;
        let delta = (height - height / 8) / range + 2;

        // draw x axis
        ctx.beginPath();
        ctx.moveTo(0, height - height / 8);
        ctx.lineTo(width, height - height / 8); // Updated to stretch across the canvas
        ctx.strokeStyle = graphColor;
        ctx.stroke();

        // draw y axis
        ctx.beginPath();
        ctx.moveTo(height / 4, delta - 3);
        ctx.lineTo(height / 4, height);
        ctx.strokeStyle = graphColor;
        ctx.stroke();

        // draw the x axis labels
        for (let i = 0; i < 12; i++) {
            // Changed the starting index to 0
            ctx.beginPath();
            ctx.moveTo((width / 12) * (i + 1) - 30, height - height / 8);
            ctx.lineTo((width / 12) * (i + 1) - 30, height - height / 8 + 10);
            ctx.strokeStyle = graphColor;
            ctx.stroke();

            ctx.font = "12px Arial";
            ctx.fillStyle = graphColor;
            ctx.fillText(MONTHS[i], (width / 12) * (i + 1) - 40, height - 5); // Updated to use MONTHS[i] instead of MONTHS[i - 1]
        }

        let y_axis_top = 20;
        let y_axis_bottom = height - height / 8 - 20;
        let r_start = height / 4 - 10;
        // draw the y axis labels
        for (let i = 0; i <= 1; i += 0.2) {
            let val = Math.round((min - max) * i + max);
            ctx.beginPath();
            ctx.moveTo(r_start, y_axis_top - (y_axis_top - y_axis_bottom) * i);
            ctx.lineTo(
                r_start + 10,
                y_axis_top - (y_axis_top - y_axis_bottom) * i
            );
            ctx.strokeStyle = graphColor;
            ctx.stroke();

            ctx.font = "15px Arial";
            ctx.fillStyle = graphColor;
            ctx.fillText(
                val,
                25,
                y_axis_top - (y_axis_top - y_axis_bottom) * i + 5
            );
        }

        y_axis_top = height - height / 8 - delta * max + height / 2 + 0;
        y_axis_bottom = height - height / 8 - delta * min + height / 2 - 80;
        delta = (y_axis_top - y_axis_bottom) / range;

        // draw the chart
        ctx.beginPath();
        ctx.moveTo(r_start + 35, y_axis_top - spline(1.01) * delta - 50);
        for (let i = 1; i <= 12; i += 0.01) {
            ctx.lineTo(
                r_start + (width / 12) * (i - 1) + 35,
                y_axis_top - spline(i) * delta - 50
            );
        }

        ctx.strokeStyle = chartColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // crop the canvas
        let croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = width - width / 13;
        croppedCanvas.height = height;
        let croppedCtx = croppedCanvas.getContext("2d");
        croppedCtx.drawImage(canvas, 0, 0, width - width / 13, height);

        // draw the image
        let img = document.createElement("img");
        img.src = croppedCanvas.toDataURL();
        graph.appendChild(img);

        // delete the canvas elements
        canvas.remove();
        croppedCanvas.remove();

        // work orders

        let workorders = undefined;

        try {
            workorders = this.state.workorders;
        } catch (err) {
            return;
        }

        if (workorders == undefined) return;

        // filter workorders
        workorders = workorders.filter((item) => {
            return item.type == type;
        });

        let workOrdersContainer = document.getElementById("workorders-list");
        workOrdersContainer.innerHTML = "";

        for (let workorder of workorders) {
            let order = document.createElement("div");
            order.className = "workorder";

            order.innerHTML = `
                <div class="attribute top">
                    <div class="key">Name</div>
                    <div class="value">${workorder.name}</div>
                </div>

                <div class="attribute top">
                    <div class="key">Floor</div>
                    <div class="value">${workorder.floor}</div>
                </div>

                <div class="attribute bottom wide">
                    <div class="key">Description</div>
                    <div class="value">${workorder.text}</div>
                </div>`;

            workOrdersContainer.appendChild(order);
        }
    }

    cubicSpline(x, y) {
        const n = x.length - 1;
        const h = [];
        const alpha = [];
        const l = [];
        const mu = [];
        const z = [];
        const c = [];
        const b = [];
        const d = [];

        // Step 1: Calculate h values.
        for (let i = 0; i < n; i++) {
            h[i] = x[i + 1] - x[i];
        }

        // Step 2: Calculate alpha values.
        for (let i = 1; i < n; i++) {
            alpha[i] =
                (3 / h[i]) * (y[i + 1] - y[i]) -
                (3 / h[i - 1]) * (y[i] - y[i - 1]);
        }

        // Step 3: Calculate l and mu values.
        l[0] = 1;
        mu[0] = 0;
        z[0] = 0;

        for (let i = 1; i < n; i++) {
            l[i] = 2 * (x[i + 1] - x[i - 1]) - h[i - 1] * mu[i - 1];
            mu[i] = h[i] / l[i];
            z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
        }

        // Step 4: Calculate c, b, and d values.
        l[n] = 1;
        z[n] = 0;
        c[n] = 0;

        for (let j = n - 1; j >= 0; j--) {
            c[j] = z[j] - mu[j] * c[j + 1];
            b[j] =
                (y[j + 1] - y[j]) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3;
            d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
        }

        // Return the spline function.
        function splineFunction(xValue) {
            for (let i = 0; i < n; i++) {
                if (xValue >= x[i] && xValue <= x[i + 1]) {
                    const dx = xValue - x[i];
                    return y[i] + b[i] * dx + c[i] * dx ** 2 + d[i] * dx ** 3;
                }
            }
            return null; // Outside the range of the spline.
        }

        return splineFunction;
    }

    render() {
        // const [currentAsset = "Electrical Panel", setCurrentAsset] =
        // useState("");
        const { currentAsset } = this.state;
        return (
            <div id="visualization">
                <Navbar></Navbar>
                <div id="container">
                    {/* <Sidebar func={setCurrentAsset} data={currentAsset} /> */}
                    <Sidebar func={this.setCurrentAsset} data={currentAsset} />
                    <div id="content">
                        <div id="atrisk">
                            <div id="atrisk-title">AT RISK</div>
                            <div id="atrisk-list"></div>
                        </div>
                        <div id="workorders">
                            <div id="workorders-title">WORK ORDERS</div>
                            <div id="workorders-list"></div>
                        </div>

                        <h1 id="graphTitle">Failures by Month</h1>
                        <div id="graph"></div>
                    </div>
                    {/* <Elevator /> */}
                </div>
            </div>
        );
    }
}
