// bar, bubble and gauge plots 

var idSelect = d3.select("#selDataset");
var demographicsTable = d3.select("#sample-metadata");
var barChart = d3.select("#bar");
var bubbleChart = d3.select("bubble");
var gaugeChart = d3.select("gauge");

// initially populate dropdown menu using the first id
function init() {

    // reset previous data
    resetData();

    // read in samples from JSON file
    d3.json("data/samples.json").then((data => {

        //  populate dropdowns with IDs
        data.names.forEach((name => {
            var option = idSelect.append("option");
            option.text(name);
        })); // close forEach

        // get the first id from the list 
        var initId = idSelect.property("value")

        // plot charts with initial 
        plotCharts(initId);

    })); 

} // 

// reset divs to prepare for new data
function resetData() {

    demographicsTable.html("");
    barChart.html("");
    bubbleChart.html("");
    gaugeChart.html("");

}; 

// read JSON and plot charts
function plotCharts(id) {

    // read in the JSON data
    d3.json("data/samples.json").then((data => {

        // filter the metadata 
        var individualMetadata = data.metadata.filter(participant => participant.id == id)[0];

        // get the wash frequency 
        var wfreq = individualMetadata.wfreq;

        // iterate through each key 
        Object.entries(individualMetadata).forEach(([key, value]) => {

            var newList = demographicsTable.append("ul");
            newList.attr("class", "list-group list-group-flush");

            // append a li item to the unordered list 
            var listItem = newList.append("li");

            // change the class attributes 
            listItem.attr("class", "list-group-item p-1 demo-text bg-transparent");

            // add the key value pair 
            listItem.text(`${key}: ${value}`);

        }); // close forEach

        // filter the samples
        var individualSample = data.samples.filter(sample => sample.id == id)[0];

        // store sample data
        var otuIds = [];
        var otuLabels = [];
        var sampleValues = [];

        // retrieve data for plotting
        Object.entries(individualSample).forEach(([key, value]) => {

            switch (key) {
                case "otu_ids":
                    otuIds.push(value);
                    break;
                case "sample_values":
                    sampleValues.push(value);
                    break;
                case "otu_labels":
                    otuLabels.push(value);
                    break;
                    // case
                default:
                    break;
            } 

        }); 

        // top 10 values, labels and ids
        var topOtuIds = otuIds[0].slice(0, 10).reverse();
        var topOtuLabels = otuLabels[0].slice(0, 10).reverse();
        var topSampleValues = sampleValues[0].slice(0, 10).reverse();

        // store the ids with "OTU" for y-axis
        var topOtuIdsFormatted = topOtuIds.map(otuID => "OTU " + otuID);

        // trace
        var traceBar = {
            x: topSampleValues,
            y: topOtuIdsFormatted,
            text: topOtuLabels,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(29,145,192)'
            }
        };

        // data array for plot
        var dataBar = [traceBar];

        // plot layout
        var layoutBar = {
            height: 500,
            width: 600,
            font: {
                family: 'Quicksand'
            },
            hoverlabel: {
                font: {
                    family: 'Quicksand'
                }
            },
            title: {
                text: `<b>Top OTUs for Test Subject ${id}</b>`,
                font: {
                    size: 18,
                    color: 'rgb(34,94,168)'
                }
            },
            xaxis: {
                title: "<b>Sample values<b>",
                color: 'rgb(34,94,168)'
            },
            yaxis: {
                tickfont: { size: 14 }
            }
        }


        // plot bar chart 
        Plotly.newPlot("bar", dataBar, layoutBar);

        // trace
        var traceBub = {
            x: otuIds[0],
            y: sampleValues[0],
            text: otuLabels[0],
            mode: 'markers',
            marker: {
                size: sampleValues[0],
                color: otuIds[0],
                colorscale: 'YlGnBu'
            }
        };

        // data array for the plot
        var dataBub = [traceBub];

        // plot layout
        var layoutBub = {
            font: {
                family: 'Quicksand'
            },
            hoverlabel: {
                font: {
                    family: 'Quicksand'
                }
            },
            xaxis: {
                title: "<b>OTU Id</b>",
                color: 'rgb(34,94,168)'
            },
            yaxis: {
                title: "<b>Sample Values</b>",
                color: 'rgb(34,94,168)'
            },
            showlegend: false,
        };

        // plot the bubble chart
        Plotly.newPlot('bubble', dataBub, layoutBub);

        // ----------------------------------
        // PLOT GAUGE CHART (OPTIONAL)
        // ----------------------------------

        // null = zero
        if (wfreq == null) {
            wfreq = 0;
        }

        // indicator trace 
        var traceGauge = {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            type: "indicator",
            mode: "gauge",
            gauge: {
                axis: {
                    range: [0, 9],
                    tickmode: 'linear',
                    tickfont: {
                        size: 15
                    }
                },
                bar: { color: 'rgba(8,29,88,0)' }, // making gauge bar transparent 
                steps: [
                    { range: [0, 1], color: 'rgb(255,255,217)' },
                    { range: [1, 2], color: 'rgb(237,248,217)' },
                    { range: [2, 3], color: 'rgb(199,233,180)' },
                    { range: [3, 4], color: 'rgb(127,205,187)' },
                    { range: [4, 5], color: 'rgb(65,182,196)' },
                    { range: [5, 6], color: 'rgb(29,145,192)' },
                    { range: [6, 7], color: 'rgb(34,94,168)' },
                    { range: [7, 8], color: 'rgb(37,52,148)' },
                    { range: [8, 9], color: 'rgb(8,29,88)' }
                ]
            }
        };

        // determine angle for each wfreq segment 
        var angle = (wfreq / 9) * 180;

        // calculate end points for triangle pointer path
        var degrees = 180 - angle,
            radius = .8;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: to create needle shape (triangle)
        // M aX aY L bX bY L cX cY Z
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            cX = String(x),
            cY = String(y),
            pathEnd = ' Z';
        var path = mainPath + cX + " " + cY + pathEnd;

        gaugeColors = ['rgb(8,29,88)', 'rgb(37,52,148)', 'rgb(34,94,168)', 'rgb(29,145,192)', 'rgb(65,182,196)', 'rgb(127,205,187)', 'rgb(199,233,180)', 'rgb(237,248,217)', 'rgb(255,255,217)', 'white']

        // trace to draw the circle where the needle is centered
        var traceNeedleCenter = {
            type: 'scatter',
            showlegend: false,
            x: [0],
            y: [0],
            marker: { size: 35, color: '850000' },
            name: wfreq,
            hoverinfo: 'name'
        };

        // data array from the traces
        var dataGauge = [traceGauge, traceNeedleCenter];

        // layout 
        var layoutGauge = {

            // draw the pointer shape 
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],
            font: {
                family: 'Quicksand'
            },
            hoverlabel: {
                font: {
                    family: 'Quicksand',
                    size: 16
                }
            },
            title: {
                text: `<b>Test Subject ${id}</b><br><b>Belly Button Washing Frequency</b><br><br>Scrubs per Week`,
                font: {
                    size: 18,
                    color: 'rgb(34,94,168)'
                },
            },
            height: 500,
            width: 500,
            xaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1],
                fixedrange: true 
            },
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-0.5, 1.5],
                fixedrange: true 
            }
        };

        // plot gauge chart
        Plotly.newPlot('gauge', dataGauge, layoutGauge);


    })); 

}; 

// change in the dropdown select menu function
function optionChanged(id) {

    // reset the data
    resetData();

    // plot the charts for this id
    plotCharts(id);


} 

// call the init() function for default data
init();