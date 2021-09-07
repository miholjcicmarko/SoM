/** The script to run the program on the webpage */

// async function loadexampleData () {

//     let data = d3.csv("./data/Evaluation_Report.csv");

//     return data;

// }

//let exampleData = loadexampleData();

let exampleData = d3.csv("./data/Evaluation_Report.csv");

Promise.all([exampleData]).then(data => {

    let preData = data[0];

    let bars = new visuals(preData);

})