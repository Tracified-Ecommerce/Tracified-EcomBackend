import React, {Component} from 'react';
import TraciLogo from '../assets/tracified_logo.png';

class TracifiedLogo extends Component{
    render(){
        var logoStyle={
            height: '250px'             
        }

        var backStyle={
            backgroundColor:"black",
            textAlign: 'center'
        }

        // var wrapperStyle={
        //     width:'100%'
        // }

        return(
            <div style={backStyle}>
                <img src={TraciLogo} style={logoStyle}/>
            </div>
        );
    }
}

export default TracifiedLogo;