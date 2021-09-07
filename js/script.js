/** The script to run the program on the webpage */

let data = d3.csv("./data/Evaluation_Report.csv");

Promise.all([data]).then(data => {

    let preData = data[0];

    let bars = new visual(preData);

})