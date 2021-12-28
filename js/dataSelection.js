class dataSelection {

    constructor (data, updateData, performAnalysis) {
        this.data = data;
        this.updateData = updateData;
        this.performAnalysis = performAnalysis;
        this.custom = false;

        let that = this;

        let demoData = d3.select("#demoButton");

        demoData.on("click", function() {
            d3.select("#demoButton").classed("button_select", true);
            //document.getElementById("demoButton").style.color = "black";
            //document.getElementById("demoButton").style.backgroundColor = "silver";
            that.updateData("demo");
        });

        let csv_file = d3.select("#csvUpload");
        csv_file.on("change", function () {
            let reader = new FileReader();
            
            reader.readAsText(this.files[0]);

            reader.onload = function () {
                let textData = reader.result;
                textData = textData.split("/\r\n|\n/");
                let customData = jQuery.csv.toObjects(textData[0]);
                that.custom = true;
                document.getElementById("demoButton").style.color = "white"
                document.getElementById("demoButton").style.backgroundColor = "rgb(134, 124, 189)"
                that.updateData("custom", customData);
            }
        });

        let performButton = d3.select("#performButton");
        performButton.on("click", function () {
            that.performAnalysis(that.data, that.custom);
        });

    }

    newData (data) {
        this.data = data;
    }

}