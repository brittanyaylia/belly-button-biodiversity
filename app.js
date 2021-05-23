// Belly Button Biodiversity - Plotly.js

// build bar and bubble chart 

// create metadata for given sample
function buildMetadata(selection) {

    // read in the json data
    d3.json("samples.json").then((sampleData) => {

        console.log(sampleData);

        // parse to get the metadata
        var parsedData = sampleData.metadata;
        console.log("parsed data inside buildMetadata function")
        console.log(parsedData);

        var sample = parsedData.filter(item => item.id == selection);
        console.log("showing sample[0]:");
        console.log(sample[0]);

        // specify metadata location
        var metadata = d3.select("#sample-metadata").html("");

        Object.entries(sample[0]).forEach(([key, value]) => {
            metadata.append("p").text(`${key}: ${value}`);
        });

        console.log("next again");
        console.log(metadata);
    });
}

// create charts for given sample
function buildCharts(selection) {

    // read in the json data
    d3.json("samples.json").then((sampleData) => {

        // parse the data to get the sample's OTU data
        var parsedData = sampleData.samples;
        console.log("parsed data inside buildCharts function")
        console.log(parsedData);

        var sampleDict = parsedData.filter(item => item.id == selection)[0];
        console.log("sampleDict")
        console.log(sampleDict);


        var sampleValues = sampleDict.sample_values; 
        var barChartValues = sampleValues.slice(0, 10).reverse();
        console.log("sample_values")
        console.log(barChartValues);

        var idValues = sampleDict.otu_ids;
        var barChartLabels = idValues.slice(0, 10).reverse();
        console.log("otu_ids");
        console.log(barChartLabels);

        var reformattedLabels = [];
        barChartLabels.forEach((label) => {
            reformattedLabels.push("OTU " + label);
        });

        console.log("reformatted");
        console.log(reformattedLabels);

        var hovertext = sampleDict.otu_labels;
        var barCharthovertext = hovertext.slice(0, 10).reverse();
        console.log("otu_labels");
        console.log(barCharthovertext);

        // create bar chart 

        var barChartTrace = {
            type: "bar",
            y: reformattedLabels,
            x: barChartValues,
            text: barCharthovertext,
            orientation: 'h'
        };

        var barChartData = [barChartTrace];

        Plotly.newPlot("bar", barChartData);

        // create bubble chart

        var bubbleChartTrace = {
            x: idValues,
            y: sampleValues,
            text: hovertext,
            mode: "markers",
            marker: {
                color: idValues,
                size: sampleValues
            }
        };

        var bubbleChartData = [bubbleChartTrace];

        var layout = {
            showlegend: false,
            height: 600,
            width: 1000,
            xaxis: {
                title: "OTU ID"
            }
        };

        Plotly.newPlot("bubble", bubbleChartData, layout);
    });
}

// page load function
function init() {

    // read in json data
    d3.json("samples.json").then((sampleData) => {

        // parse data to get sample names
        var parsedData = sampleData.names;
        console.log("parsed data inside init function")
        console.log(parsedData);

        // add dropdown options
        var dropdownMenu = d3.select("#selDataset");

        parsedData.forEach((name) => {
            dropdownMenu.append("option").property("value", name).text(name);
        })

        // use first sample for initial plots
        buildMetadata(parsedData[0]);

        buildCharts(parsedData[0]);

    });
}

function optionChanged(newSelection) {

    // update metadata 
    buildMetadata(newSelection); 
    // update charts
    buildCharts(newSelection);
}

// initialize dashboard on page load
init();