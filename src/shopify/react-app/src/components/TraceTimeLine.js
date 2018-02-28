import React, { Component } from 'react';
import Loading from './Loading';
import * as axios from 'axios';
import {
    Spinner,
    Card,
    Page
} from '@shopify/polaris';
import { Row, Col, Container } from 'reactstrap';
import {Timeline, TimelineEvent} from 'react-event-timeline';
import TimelineContent from './TimelineContent';

class TraceTimeLine extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            array: [],
            timeline: "",
            istimelineLoading: true
        };
    }

    handleClick = (index, isClosed) => {

        if(!isClosed){
        //reset all values in array to false -> (sets all cards' "isOpen" attributes to false)
        this.state.array.fill(false);

        }

        //set only this card's collapse attribute to true
        var temp = this.state.array.slice();
        temp[index] = !(temp[index]);
        // replace array with modified temp array
        this.setState({array: temp});

    }

    componentDidMount() {
        const traceURL = "/shopify/tracified/trace/" + this.props.match.params.orderID + "/" + this.props.match.params.itemID;
        axios({
            method: 'get',
            url: traceURL,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
        })
            .then(response => {
                let timeline = response.data.tabs[2];
                let itms = timeline.items;
                let arr = [];

                itms.map((e,i) => {
                    arr.push(false);
                    return true;
                });

                this.setState({
                    timeline: timeline,
                    istimelineLoading: false,
                    array: arr
                });
            });

    }

    render() {

        let timelineTopStyle = {
            backgroundColor: 'rgba(0,0,0,0.8)', 
            height: 110, 
            width: 220,
            marginLeft: 10,
            padding: 10
        };

        if (this.state.istimelineLoading) {
            return <Loading />;
        }
        else {
            return (
                <div style={{backgroundColor: '#f4f6f8'}}>
                    <div style={timelineTopStyle}>
                        <h1 style={{color: 'white', textAlign: 'center'}}>
                            <span style={{color: 'white'}}>
                            Traci
                            </span>
                            <span style={{color: 'green'}}>
                            fied
                            </span> 
                        </h1>
                        
                        <p style={{color: 'white', fontSize: 12, textAlign: 'center', marginBottom: 1}}>Ordered ID:&nbsp;{this.props.match.params.orderID}</p>
                        <p style={{color: 'white', fontSize: 12, textAlign: 'center', marginBottom: 1}}>Item Name:&nbsp;{this.props.match.params.itemName}</p>
                    
                    </div>
                    <div style={{paddingLeft: 30}}>
                        <Timeline>
                        {this.state.timeline.items.map((stage, index) => {

                            let titleText = (index+1)+". "+stage.title;
                            let descriptionText = stage.description;

                            var ico = (<svg height="30" width="30" >
                                            <image width="30" height="30" xlinkHref={stage.icon}  />    
                                        </svg>);

                            var stageData = stage.data;

                            return(
                                <TimelineEvent
                                    key={index}
                                    title={titleText}
                                    titleStyle={{fontSize:17, fontWeight: "bold"}}
                                    subtitle={descriptionText}
                                    subtitleStyle={{fontSize:15}}
                                    icon={ico}
                                    contentStyle={{fontSize:13}}
                                    bubbleStyle={{border: "none"}}
                                    // onclick={this.showMessage}
                                >

                                    <div id={index}>
                                        <TimelineContent 
                                            collapseArray={this.state.array} 
                                            collapseArrayKey={index} 
                                            data={stageData}
                                            componentID={"component"+index} 
                                            onClick={this.handleClick}
                                        />
                                    </div>    
                                </TimelineEvent>                                    
                            );

                        })}
                        </Timeline>
                    </div>      
                </div>
            );
        }
    }
}

export default TraceTimeLine;
