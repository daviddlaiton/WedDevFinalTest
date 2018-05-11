import { Meteor } from "meteor/meteor";
import React from "react";
import * as d3 from "d3";

export class Home extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            schedules : []
        }
    }

    
    componentDidMount(){
        this.getData();
    }

    getData(){
        busSchedule = d3.json("https://gist.githubusercontent.com/john-guerra/6a1716d792a20b029392501a5448479b/raw/e0cf741c90a756adeec848f245ec539e0d0cd629/sfNSchedule")
        .then((result) =>{
            this.setState({schedules : result});
        });
    }

   

    render() {
        return (
            <div>
                <h2>San Francisco bus</h2>
                {
                    console.log(this.state.schedules.route)
                }

            </div>
        )
    }

}