class PlotData {

    constructor (id, xVal, yVal) {
        this.id = id;
        this.xVal = parseInt(xVal);
        this.yVal = parseInt(yVal);
    }

}

class visuals {

    constructor (data, custom, updateX, updateY) {

        this.data = data;
        this.variables = [];
        this.updateX = updateX;
        this.updateY = updateY;

        if (custom === false) {
            for (let i = 1; i < data.columns.length; i++) {
                this.variables.push(data.columns[i]);
            }
        }
        else if (custom === true) {
            this.variables = Object.keys(data[0])
            this.variables.shift();
        }

        this.color = d3.scaleOrdinal(d3.schemeAccent)
                .domain([0,this.data.length]);

        this.drawChart(0,1);
        this.drawDropDown();

    }

    drawChart (xIndicator, yIndicator) {

        let margin = {top: 10, right: 20, bottom: 10, left: 20};
        
        let w = 500 - margin.right - margin.left;
        let h = 400 - margin.bottom - margin.top;

        let x_var = this.variables[xIndicator];
        let y_var = this.variables[yIndicator];

        let xdata = [];
        let ydata = [];

        for (let i = 0; i < this.data.length; i++) {
            xdata.push(parseInt(this.data[i][x_var]));
            ydata.push(parseInt(this.data[i][y_var]));
        }

        d3.select('#scatter-plot')
            .append('div').attr('id', 'chart-view');

        d3.select('#chart-view')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);

        let svg = d3.select("#chart-view")
            .append('svg')
            .classed('plot-svg', true)
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom);

        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g').classed('wrapper-group', true);
    
        let xaxis = svgGroup.append("g")
            .classed("x-axis", true)
            .attr("id", "x-axis");

        let yaxis = d3.select(".plot-svg").append("g")
            .classed("y-axis", true)
            .attr("id", "y-axis");

        xaxis.append("text")
            .classed("axis-label-x", true)
            .attr("transform", "translate("+(5*this.margin.left)+"," +(2*this.margin.top)+")")
            .attr("text-anchor", "middle")
            .attr("class", "axis-label")
            .attr("class", "x-label");

        yaxis.append("text")
            .classed("axis-label-y", true)
            .attr("transform", "translate(-"+(1.2*this.margin.bottom) + ","+(2.5*this.margin.left)+")rotate(-90)")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("class", "y-label"); 

        let dropdownWrap = d3.select('#chart').append('div').classed('dropdown-wrapper', true);

        let xWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        xWrap.append('div').classed('x-label', true)
            .append('text')
            .text('X Axis Data');

        xWrap.append('div').attr('id', 'dropdown_x').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data');

        yWrap.append('div').attr('id', 'dropdown_y').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        d3.selectAll('#dropdown_x')
            .on("change", function (d) {
                let dropdownX = d;
            })

        d3.selectAll('#dropdown_y')
            .on("change", function (d){
                let dropdownY = d;
            })

        let xScale = d3
            .scaleLinear()
            .domain([0, d3.max(xdata)])
            .range([0, w]);

        let yScale = d3
            .scaleLinear()
            .domain([d3.max(ydata), 0])
            .range([margin.bottom,h]);  
            
        //let yaxis = svg.append("g")
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

        let data_circ = d3.selectAll("#chart").selectAll("circle");

        that.tooltip(data_circ);

    }

        /**
     * Setting up the drop-downs
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     */
    drawDropDown(xIndicator, yIndicator) {

        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper');
        let dropData = [];

        for (let key in this.data) {
            dropData.push({
                indicator: key,
                indicator_name: this.data[key][0].indicator_name
            });
        }

        /* X DROPDOWN */
        let dropX = dropDownWrapper.select('#dropdown_x').select('.dropdown-content').select('select');

        let optionsX = dropX.selectAll('option')
            .data(dropData);

        optionsX.exit().remove();

        let optionsXEnter = optionsX.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsXEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsX = optionsXEnter.merge(optionsX);

        let selectedX = optionsX.filter(d => d.indicator === xIndicator)
            .attr('selected', true);

        dropX.on('change', function (d, i) {
            let xValue = this.options[this.selectedIndex].value;
            let yValue = dropY.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

        /* Y DROPDOWN */
        let dropY = dropDownWrapper.select('#dropdown_y').select('.dropdown-content').select('select');

        let optionsY = dropY.selectAll('option')
            .data(dropData);

        optionsY.exit().remove();

        let optionsYEnter = optionsY.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsY = optionsYEnter.merge(optionsY);

        optionsYEnter.append('text')
            .text((d, i) => d.indicator_name);

        let selectedY = optionsY.filter(d => d.indicator === yIndicator)
            .attr('selected', true);

        dropY.on('change', function (d, i) {
            let yValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            that.updatePlot(xValue, yValue);
        });

    }

    // drawCharts (number, newBars) {

    //     if (newBars === true) {
    //         let divBar = document.getElementById("bar")
    //         while (divBar.firstChild) {
    //             divBar.removeChild(divBar.firstChild);
    //         }
    //     }

    //     svg.append("text")
    //             .text("Cost ($)")
    //             .attr("transform", "translate(15,"+(h/2)+")rotate(-90)")
    //             .attr("text-anchor", "middle");

    //     let bars = d3.selectAll("#bar").selectAll("rect");

    //     this.tooltip(bars);
    // }

    // updateChart (number) {
    //     let that = this;

    //     d3.selectAll(".tooltip").remove();

    //     let new_num = +number;

    //     this.activeNumber = new_num;

    //     this.drawBars(new_num, true);

    // }

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

        return "<h5>" + id + "<br/>";

    }    

}