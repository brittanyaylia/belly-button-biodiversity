// bar chart, bubble chart & gauge 


var idSelect = d3.select("#selDataset");
var demographicsTable = d3.select("#sample-metadata");
var barChart = d3.select("#bar");
var bubbleChart = d3.select("bubble");
var gaugeChart = d3.select("gauge");

// create a function to populate dropdown menu 
function init() {

    // reset any previous data
    resetData();

    // read in samples from JSON file
    d3.json("data/samples.json").then((data => {

        //  use a forEach to loop over each name in the array data.names to populate dropdowns with IDs
        data.names.forEach((name => {
            var option = idSelect.append("option");
            option.text(name);
        })); // close forEach

        // get the first ID from the list for initial charts as a default
        var initId = idSelect.property("value")

        // plot charts with initial ID
        plotCharts(initId);

    })); 

} 

// create a function to reset divs
function resetData() {

    demographicsTable.html("");
    barChart.html("");
    bubbleChart.html("");

}; 

// create a function to read JSON and plot charts
function plotCharts(id) {

    // read in the JSON data
    d3.json("data/samples.json").then((data => {

        // filter the metadata 
        var individualMetadata = data.metadata.filter(participant => participant.id == id)[0];

        // get the wash frequency 
        var wfreq = individualMetadata.wfreq;

        // iterate through metadata
        Object.entries(individualMetadata).forEach(([key, value]) => {

            var newList = demographicsTable.append("ul");
            newList.attr("class", "list-group list-group-flush");

            // append a li item to the unordered list tag
            var listItem = newList.append("li");

            // change the class attributes of the list item for styling
            listItem.attr("class", "list-group-item p-1 demo-text bg-transparent");

            // add the key value pair from the metadata to the demographics list
            listItem.text(`${key}: ${value}`);

        }); 

        // filter the samples 
        var individualSample = data.samples.filter(sample => sample.id == id)[0];

        // create arrays to store sample data
        var otuIds = [];
        var otuLabels = [];
        var sampleValues = [];

        // iterate through each key to retrieve data for plotting
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

        // get the top 10 values, labels and ids
        var topOtuIds = otuIds[0].slice(0, 10).reverse();
        var topOtuLabels = otuLabels[0].slice(0, 10).reverse();
        var topSampleValues = sampleValues[0].slice(0, 10).reverse();

        // store the ids with "OTU" for labelling y-axis
        var topOtuIdsFormatted = topOtuIds.map(otuID => "OTU " + otuID);

        // trace
        var traceBar = {
            x: topSampleValues,
            y: topOtuIdsFormatted,
            text: topOtuLabels,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: "thistle"
            }
        };

        // data array for plotting
        var dataBar = [traceBar];

        // plot layout
        var layoutBar = {
            height: 500,
            width: 600,
            font: {
                family: 'Montserrat'
            },
            hoverlabel: {
                font: {
                    family: 'Montserrat'
                }
            },
            title: {
                text: `<b>Top 10 Bacteria Cultures Found</b>`,
                font: {
                    size: 18,
                    color: 'black'
                }
            },
            yaxis: {
                tickfont: { size: 14 }
            }
        }


        // plot the bar chart 
        Plotly.newPlot("bar", dataBar, layoutBar);

        // plot bubble chart

        // trace
        var traceBub = {
            x: otuIds[0],
            y: sampleValues[0],
            text: otuLabels[0],
            mode: 'markers',
            marker: {
                size: sampleValues[0],
                color: otuIds[0],
                colorscale: 'Picnic'
            }
        };

        // data array for the plot
        var dataBub = [traceBub];

        // plot layout
        var layoutBub = {
            font: {
                family: 'Montserrat'
            },
            hoverlabel: {
                font: {
                    family: 'Montserrat'
                }
            },
            xaxis: {
                title: "<b>OTU ID</b>",
                color: 'black'
            },
            yaxis: {
                title: "<b>Sample Values</b>",
                color: 'black'
            },
            showlegend: false,
        };

        // plot the bubble chart
        Plotly.newPlot('bubble', dataBub, layoutBub);

    })); 

}; 

// change in the dropdown select menu
function optionChanged(id) {

    // reset the data
    resetData();

    // plot the charts for this id
    plotCharts(id);


} 

// call the init() function for default data
init();