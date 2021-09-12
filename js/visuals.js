class PlotData {

    constructor (id, xVal, yVal) {
        this.id = id;
        this.xVal = parseInt(xVal);
        this.yVal = parseInt(yVal);
    }

}

class visuals {

    constructor (data) {

        this.data = data;
        this.variables = [];
        for (let i = 1; i < data.columns.length; i++) {
            this.variables.push(data.columns[i]);
        }

        this.drawChart();

    }

    drawChart () {

        let margin = {top: 10, right: 20, bottom: 10, left: 20};
        
        let w = 500 - margin.right - margin.left;
        let h = 400 - margin.bottom - margin.top;

        let x_var = this.variables[0];
        let y_var = this.variables[1];

        let xdata = [];
        let ydata = [];

        for (let i = 0; i < this.data.length; i++) {
            xdata.push(parseInt(this.data[i][x_var]));
            ydata.push(parseInt(this.data[i][y_var]));
        }

        let svg = d3.select("#chart")
            .append('svg')
            .attr("id", "plot-svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom);

        let xScale = d3
            .scaleLinear()
            .domain([0, d3.max(xdata)])
            .range([0, w]);

        let yScale = d3
            .scaleLinear()
            .domain([d3.max(ydata), 0])
            .range([margin.bottom,h]);  
            
        let yaxis = svg.append("g")
                    .attr("id", "y-axis");
        
        yaxis.call(d3.axisLeft(yScale).ticks(5))
                .attr("transform", "translate(" + margin.left + "," + "0)")
                .attr("class", "axis_line");

        let xaxis = svg.append("g")
                    .attr("id", "x-axis")
                    .attr("transform", "translate(" +margin.left+ "," +(h)+")")
                    .call(d3.axisBottom(xScale));

        let plotData_arr = [];

        for (let i = 0; i < this.data.length; i++) {
            let datapoint = new PlotData(this.data[i]["ID"], this.data[0][x_var],
                                        this.data[i][y_var]);
                plotData_arr.push(datapoint);
        }

        d3.select('#plot-svg').selectAll("circle")
            .data(plotData_arr)
            .join("circle")
            .attr('cx', (d) => xScale(d.xVal))
            .attr('cy', (d) => yScale(d.yVal))
            .attr('r', (d) => 5)
            .attr("transform", "translate("+margin.left+",0)")
            .attr("id", function (d,i) { return d.id.toUpperCase()});
    }

    drawCharts (number, newBars) {

        if (newBars === true) {
            let divBar = document.getElementById("bar")
            while (divBar.firstChild) {
                divBar.removeChild(divBar.firstChild);
            }
        }

        let dataBar = [];

        for (let i = 0; i < this.dataValues.length; i++) {
            if (this.dataValues[i]["numberOfSwipes"] === number) {
                let node = {
                    "numberOfSwipes": i,
                    "Zions": this.dataValues[i]["zions"],
                    "Others": this.dataValues[i]["other"]
                };
                dataBar.push(node);
            }
        }

        let margin = {top: 10, right: 20, bottom: 10, left: 20};
        
        let w = 500 - margin.right - margin.left;
        let h = 400 - margin.bottom - margin.top;

        let var_id = "numberOfSwipes";
        let that = this;

        let xlargeScale = d3.scaleBand()
                .domain(dataBar.map(d => d[var_id]))
                .range([margin.left, w - margin.right])

        let xcatsScale = d3.scaleBand()
                .domain(["Zions", "Others"])
                .range([0, xlargeScale.bandwidth()])
                .paddingInner(0.1);

        let yScale = d3.scaleLinear()
                .domain([d3.max([dataBar[0]["Zions"], dataBar[0]["Others"]])+20,0])
                .range([0,h-10]);

        let svg = d3.select("#bar")
                .append("svg")
                .attr("id", "bars")
                .attr("width", w + margin.right + margin.left)
                .attr("height", h + margin.top + margin.bottom);

        d3.select('#bar')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.append("g")
            .selectAll("g")
            .data(dataBar)
            .join("g")
            .attr("transform", d => `translate(${xlargeScale(d[var_id])+30},5)`)
            .selectAll("rect")
            .data(d => that.companies.map(key => ({key, value: d[key]})))
            .join("rect")
            .attr("x", d => xcatsScale(d.key))
            .attr("y", function(d,i) {
               return yScale(d.value);
            })
            .attr("width", xcatsScale.bandwidth())
            .attr("height", function(d,i) {
               return yScale(0) - yScale(d.value);
            })
            .attr("fill", "steelblue")
            .attr("id", (d,i) => d.key+"");
    
        let yaxis = svg.append("g")
                    .attr("id", "y-axis");
        
        yaxis.call(d3.axisLeft(yScale).ticks(5))
                .attr("transform", "translate(" + 50 + "," + "5)")
                .attr("class", "axis_line");

        let xaxis = svg.append("g")
                    .attr("id", "x-axis")
                    .attr("transform", "translate(" +50+ "," +(h-5)+")")
                    .call(d3.axisBottom(xcatsScale));

        svg.append("text")
                .text("Cost ($)")
                .attr("transform", "translate(15,"+(h/2)+")rotate(-90)")
                .attr("text-anchor", "middle");

        let bars = d3.selectAll("#bar").selectAll("rect");

        this.tooltip(bars);
    }

    updateChart (number) {
        let that = this;

        d3.selectAll(".tooltip").remove();

        let new_num = +number;

        this.activeNumber = new_num;

        this.drawBars(new_num, true);

    }

    tooltip (onscreenData) {
        let that = this;
        let tooltip = d3.select('.tooltip');

        onscreenData.on('mouseover', function(d,i) {

            let pageX = d.clientX + 5;
            let pageY = d.clientY + 5;
            
            d3.select(this).classed("hovered",true);

            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
        
            tooltip.html(that.tooltipDivRender(d))
                .style("left", (pageX) + "px")
                .style("top", (pageY) + "px");
            });

        onscreenData.on("mouseout", function(d,i) {
            d3.select(this).classed("hovered",false);

            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    }

    tooltipDivRender (data){
        let company = data.currentTarget.id;
        let cost = data.currentTarget.__data__.value;

        return "<h5>" + company + "<br/>" + 
            "Cost: $" + cost + "<br/>" + 
            "Amount of Swipes: " + this.activeNumber;

    }    

}