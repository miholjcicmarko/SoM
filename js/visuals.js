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

        this.color = d3.scaleOrdinal(d3.schemeAccent)
                .domain([0,this.data.length]);

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

        d3.select('#chart')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);

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
            let datapoint = new PlotData(this.data[i]["ID"], this.data[i][x_var],
                                        this.data[i][y_var]);
                plotData_arr.push(datapoint);
        }

        let that = this;

        d3.select('#plot-svg').selectAll("circle")
            .data(plotData_arr)
            .join("circle")
            .attr('cx', (d) => xScale(d.xVal))
            .attr('cy', (d) => yScale(d.yVal))
            .attr('r', (d) => 5)
            .attr("transform", "translate("+margin.left+",0)")
            .attr("fill", (d,i) => that.color(i))
            .attr("id", function (d,i) { return d.id.toUpperCase()});

        let data_circ = d3.selectAll("#plot-svg").selectAll("circle");

        that.tooltip(data_circ);

    }

    drawCharts (number, newBars) {

        if (newBars === true) {
            let divBar = document.getElementById("bar")
            while (divBar.firstChild) {
                divBar.removeChild(divBar.firstChild);
            }
        }

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
        let id = data.currentTarget.id;

        return "<h5>" + id + "<br/>" + 

    }    

}