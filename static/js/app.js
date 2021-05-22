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

// reset divs 
function resetData() {

    demographicsTable.html("");
    barChart.html("");
    bubbleChart.html("");
    gaugeChart.html("");

}; 

// plot charts
function plotCharts(id) {

    // read in json data
    d3.json("data/samples.json").then((data => {

        // filter the metadata for the ID chosen
        var individualMetadata = data.metadata.filter(participant => participant.id == id)[0];

        // get the wash frequency for gauge chart later
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

        // data for plotting charts 

        // filter for the id chosen
        var individualSample = data.samples.filter(sample => sample.id == id)[0];

        // create arrays to store data
        var otuIds = [];
        var otuLabels = [];
        var sampleValues = [];

        // Iterate through each key and value in the sample to retrieve data for plotting
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
 
         // store the ids with "OTU" for labelling y-axis
         var topOtuIdsFormatted = topOtuIds.map(otuID => "OTU " + otuID);

         // plot bar chart 
         
         //trace 
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

        // array for plotting
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
                colorscale: 'YlGnBu'
            }
        };

        // array for plot
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

    })); 
};