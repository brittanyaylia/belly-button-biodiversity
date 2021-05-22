// step 1: plotly 

var idSelect = d3.select("#selDataset");
var demographicsTable = d3.select("#sample-metadata");
var barChart = d3.select("#bar");
var bubbleChart = d3.select("bubble");

// horizontal bar chart 

//dropdown menu
function init() {

    // reset data
    resetData();

    // read in data from json
    d3.json("data/samples.json").then((data => {

        //populate dropdown 
        data.names.forEach((name => {
            var option = idSelect.append("option");
            option.text(name);
        }));

        // select firstid from data list
        var initId = idSelect.property("value")

        // plot
        plotCharts(initId);
    }));
}

