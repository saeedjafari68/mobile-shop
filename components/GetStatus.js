



import React from 'react';
import { connect } from "react-redux"
import Server from './Server.js'
import { Header, View,Button, Text, Left,Right, Item ,Input} from 'native-base';


class GetStatus extends React.Component {   
  constructor(props){           
    super(props);    
    this.Server = new Server();
    
           
  }  
  ConvertNumToFarsi(text) {
    if(!text)
      text=0;
    text=text.toString();  
    var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return text.replace(/[0-9]/g, function (w) {
      return id[+w]
    });
  }
  render() { 
    if(this.props.p=="cart")  
      return (   
            this.ConvertNumToFarsi(this.props.CartNumber)
      );  
    

  }
}
function mapStateToProps(state) {        
  return {
    CartNumber : state.CartNumber,
    isAuth:state.CartNumber
  }
}
export default connect(mapStateToProps)(GetStatus)  