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
            document.getElementById('csv').value= null;
        }
        else if (id === "custom") {
            selectedData.newData(data);
            // unselect the button here
            //document.getElementById("covidButton").style.color = "white";
            //document.getElementById("covidButton").style.backgroundColor = "rgb(134, 124, 189)";
            selectedData.preloaded = false;
        }
    }

    function performAnalysis (data, custom) {

        if (data === null) {
            alert("Error! Select Demo or Upload Data");
        }
        else {
            let plots = new visuals(data, custom);
        }


    }

    let selectedData = new dataSelection (preData, updateData, performAnalysis);

})