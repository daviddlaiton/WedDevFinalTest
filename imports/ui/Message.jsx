import { Meteor } from "meteor/meteor";
import React, { Component } from "react";

export default class  extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            user : ""
        }

        this.handleClickComment = this.handleClickComment.bind(this);
    }
    componentDidMount(){

        Meteor.call("comments.getUser",this.props.commentId,(err, result) => {
            this.setState({user: result})
        });
    }

    handleClickComment(){
        this.props.onMessage(this.props.agency, this.props.route);
    }

    render()
    {
        return(
            <div>
                {
                   <p className="commentDetail"  onClick={this.handleClickComment}> <strong className="nameComment">{this.state.user }</strong> sayed : <strong>{this.props.comment}</strong> in <strong>
                    {String(this.props.date)}</strong> while seeing the time table of the agency <strong> {this.props.agency.split("/")[0]} </strong> 
                    and route <strong>{this.props.route.split("/")[0]}</strong></p>
                }
            </div>
        )
    }
}