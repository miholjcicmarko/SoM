/** The script to run the program on the webpage */

async function loadexampleData () {

    let data_demo = await d3.csv("./data/demo.csv");

    let dataobject = {
        "demo": data_demo
    }

    return dataobject;

}

let exampleData = loadexampleData();

Promise.all([exampleData]).then(data => {

    let preData = data[0];

    function updateData (id, data) {
        if (id === "demo") {
            selectedData.newData(preData["demo"]);
            selectedData.preloaded = true;
            document.getElementById('csvUpload').value= null;
        }
        else if (id === "custom") {
            selectedData.newData(data);
            selectedData.preloaded = false;
            d3.select("#demoButton").classed("button_select", false);
        }
    }

    function performAnalysis (data, custom) {

        if (data === null) {
            alert("Error! Select Demo or Upload Data");
        }
        else {
            let plots = new visuals(data, custom);
            for (let i = 1; i < 5; i++) {
                plots.updateChart(0,1,i);
            }
        }


    }

    let selectedData = new dataSelection (preData, updateData, performAnalysis);

})