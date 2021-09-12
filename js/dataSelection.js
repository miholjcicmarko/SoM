class dataSelection {

    constructor (data, updateData, performAnalysis) {
        this.data = null;
        this.updateData = updateData;
        this.performAnalysis = performAnalysis;

        let that = this;

        let demoData = d3.select("#demoButton");

        demoData.on("click", function() {
            document.getElementById("demoButton").style.color = "black"
            document.getElementById("demoButton").style.backgroundColor = "silver"
            that.updateData("demo");
            that.preloaded = "demo";
        });

        let csv_file = d3.select("#csv");
        csv_file.on("change", function () {
            let reader = new FileReader();
            
            reader.readAsText(this.files[0]);

            reader.onload = function () {
                let textData = reader.result;
                textData = textData.split("/\r\n|\n/");
                let customData = jQuery.csv.toObjects(textData[0]);
                that.updateData("custom", customData);
            }
        });

        let performButton = d3.select("#performButton");
        performButton.on("click", function () {
            that.performAnalysis(that.data, that.numArch, that.preloaded);
        });

    }

    newData (data) {
        this.data = data;
    }

}