import { Meteor } from "meteor/meteor";
import React from "react";
import * as d3 from "d3";
import "./css/Home.css"

export class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            schedules: [],
            agencies: [],
            routes: [],
            filterAgency: "",
            filterRoute: ""
        }

        this.handleAgencyChange = this.handleAgencyChange.bind(this);
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    handleRouteChange(e) {
        this.setState({ filterRoute: e.target.value });
    }

    handleAgencyChange(e) {
        this.setState({ filterAgency: e.target.value });
    }

    handleSearch() {

    }


    componentDidMount() {
        this.getData();
    }

    renderGraph() {
        if (this.state.schedules.length > 0) {

            selectedRoute = this.state.schedules[0];
            console.log

            let buses = []

            for (let bus of selectedRoute.tr) {
                let route = bus.stop.filter((d) => d.content !== "--");
                route.forEach((d) => d.date = new Date(+d.epochTime));
                buses.push(route);
            }
            const svg = d3.select(this.svg);
            const height = svg.attr("height");
            const width = svg.attr("width");
            const margin = ({ top: 20, right: 30, bottom: 30, left: 150 });
            const minDate = d3.min(buses[1], d => d.date);
            const maxDate = new Date(minDate.getTime() + 22 * 60 * 60 * 1000); // minDate + 24 hours
            const x = d3.scaleTime()
                .domain([minDate, maxDate])
                .range([margin.left, width - margin.right]);
            const y = d3.scaleBand()
                .domain(d3.range(buses[1].length))
                .rangeRound([height - margin.bottom, margin.top]);

            const xAxis = g => g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x))
            // .call(g => g.select(".domain").remove());
            const yAxis = g => g
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y)
                    .tickFormat((d) => selectedRoute.header.stop[d].content));

            const line = d3.line()
                .x(d => x(d.date))
                .y((d, i) => y(i) + y.bandwidth() / 2);

            svg.append("g")
                .call(xAxis);

            svg.append("g")
                .call(yAxis);

            svg.selectAll(".routes")
                .data(buses)
                .enter()
                .append("path")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("d", line);
        }
    }


    getData() {
        Meteor.call("routes.getSchedules", (err, result) => {
            if (err) throw err;
            this.setState({ schedules: result.route });
        });

        let va = "sf-muni";

        Meteor.call("agencies.getAll", va, (err, result) => {
            if (err) throw err;
            this.setState({ agencies: result.agency });
        });

        Meteor.call("routes.getAll", (err, result) => {
            if (err) throw err;
            this.setState({ routes: result.route });
        });
    }

    get

    renderRoutesDropdown() {
        if (this.state.schedules.route !== undefined) {
            this.state.schedules.route.map((r, i) => {
                console.log(r)
                return (
                    <option key={i}>{r.tag + " " + r.serviceClass + " " + r.direction}</option>
                )
            })
        }
    }

    renderAgenciesDropdown() {
    }



    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="jumbotron">
                        <h1 className="mainTitle">San Francisco buses schedule</h1>
                        <img className="busLogo" src="https://upload.wikimedia.org/wikipedia/commons/4/44/Metrobuscabildo.png" alt="Bus Logo" width="100" height="100" />
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8">
                            <div className="filters">
                                <h3>Filter your selection</h3>
                                <br />
                                <h4>By agency</h4>
                                <div className="formFilter">
                                    <form>
                                        <label>
                                            <select onChange={this.handleAgencyChange}>
                                                {
                                                    this.state.agencies.map((r, i) => (
                                                        <option key={i} className="dropdown-item"> {r.title} </option>
                                                    ))
                                                }
                                            </select>
                                        </label>
                                    </form>
                                </div>
                                <br />
                                <h4>By route</h4>
                                <div className="formFilter">
                                    <form>
                                        <label>
                                            <select onChange={this.handleRouteChange}>
                                                {
                                                    this.state.routes.map((r, i) => (
                                                        <option key={i} className="dropdown-item"> {r.title} </option>
                                                    ))
                                                }
                                            </select>
                                        </label>
                                    </form>
                                </div>
                                <br />
                                <button type="button" className="btn btn-primary" onClick={this.handleSearch}>Search</button>
                                <br />
                                <h5><strong>Advice:</strong> Changes may take a while to be shown.</h5>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-1"></div>
                            <div className="col-md-10">
                                <h3>Graph</h3>
                                {
                                    this.renderGraph()
                                }
                                <svg
                                    width="1000"
                                    height="500"
                                    ref={(svg) => this.svg = svg}></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}