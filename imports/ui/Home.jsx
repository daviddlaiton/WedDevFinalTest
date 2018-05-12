import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import * as d3 from "d3";
import "./css/Home.css";
import AccountsUIWrapper from "./AccountsUIWrapper.jsx";

export class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            schedules: [],
            agencies: [],
            routes: [],
            graphTitleAgency: "San Francisco Muni",
            graphTitleRoute: "N-Judah",
            filterAgency: "San Francisco Muni/sf-muni",
            filterRoute: "N-Judah/N"
        }

        this.handleAgencyChange = this.handleAgencyChange.bind(this);
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleRouteChange(e) {
        this.setState({ filterRoute: e.target.value });
    }

    handleAgencyChange(e) {
        this.setState({ filterAgency: e.target.value });

        let filAgency = e.target.value;
        Meteor.call("routes.getRoute", filAgency, (err, result) => {
            if (err) throw err;
            console.log("routes");
            console.log(result);
            let r = result.route[0].title + "/" + result.route[0].tag;
            this.setState({ routes: result.route, filterRoute: r });
        });


    }

    handleSearch() {
        let titleArr = this.state.filterAgency.split("/");
        let title = titleArr[0];


        let titleRArr = this.state.filterRoute.split("/");
        let titleR = titleRArr[0];
        this.setState({ graphTitleAgency: title, graphTitleRoute: titleR })
        this.getData();
        this.renderGraph();
        console.log("realiza el update");
    }


    componentDidMount() {
        this.getData();
    }

    renderGraph() {
        console.log("renderizando el grafiquiño");
        console.log(this.state.schedules);
        if (true) {
            if (this.state.schedules.length > 0) {

                selectedRoute = this.state.schedules[0];
                let buses = []

                for (let bus of selectedRoute.tr) {
                    let route = bus.stop.filter((d) => d.content !== "--");
                    route.forEach((d) => d.date = new Date(+d.epochTime));
                    buses.push(route);
                }


                const svg = d3.select(this.svg);
                //No sé si éste sea el bug, pero al querer actualizar el SVG el nuevo gráfico se sobreponia al anterior.
                svg.html("");
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
        else {
            console.log("no es un arreglisho")
        }
    }


    getData() {

        let filAgency = this.state.filterAgency;
        let filRoute = this.state.filterRoute;
        Meteor.call("routes.getSchedules", filAgency, filRoute, (err, result) => {
            if (err) throw err;
            console.log("schedules");
            console.log(result);
            this.setState({ schedules: result.route });
        });

        Meteor.call("agencies.getAll", (err, result) => {
            if (err) throw err;
            console.log("agencies");
            console.log(result);
            this.setState({ agencies: result.agency });
        });

        Meteor.call("routes.getRoute", filAgency, (err, result) => {
            if (err) throw err;
            console.log("routes");
            console.log(result);
            this.setState({ routes: result.route });
        });
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="jumbotron">
                        <h1 className="mainTitle">San Francisco buses schedule</h1>
                        <img className="busLogo" src="https://upload.wikimedia.org/wikipedia/commons/4/44/Metrobuscabildo.png" alt="Bus Logo" width="100" height="100" />
                    </div>
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-4">
                            <AccountsUIWrapper />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-1"></div>
                        <div className="col-md-10">
                            <h3>Graph</h3>
                            <br />
                            <h5>This graph shows information of agency <strong> {this.state.graphTitleAgency}</strong> and route <strong>  {this.state.graphTitleRoute} </strong></h5>
                            {
                                this.renderGraph()
                            }
                            <svg
                                width="1000"
                                height="500"
                                ref={(svg) => this.svg = svg}></svg>
                        </div>
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
                                                        <option key={i} className="dropdown-item"> {r.title + "/" + r.tag} </option>
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
                    </div>
                </div>
            </div>
        )
    }
}
