import React from 'react';
import { StyleSheet ,ScrollView,TouchableWithoutFeedback,ImageBackground,Linking,TouchableOpacity } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'           
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home'
import Login from './Login'
import User from './User'

const Tab = createBottomTabNavigator();


class MyTab extends React.Component {   

  constructor(props){   
    super(props);    

    this.Server = new Server();
    this.state = {
            MaxObj:[],
            GotoLogin:false,
            GotoCart:false,
            day:0,
            hours:0,
            minutes:0,
            seconds:0,
            Products:[],
            Products4:[],
            username:null,
            userId:null,
            name:"",  
            CartNumber:0,
            films: [],
            Cat:[],
            query: '',
            CatData2:null,
            CatData1:null,
            CatData4:null,
            CatData3:null,
            OffData:[],
            LoginTrue:false,
            BestShops:null,
            visibleLoader:false   
    }

 }  

  componentDidMount() {


  }
     
  render() { 
     

    return (  
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home}  />
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="User" component={User} />
      </Tab.Navigator>
    );     
  }
}    

function mapStateToProps(state) {        
  return {
    CartNumber : state.CartNumber
  }
}
export default connect(mapStateToProps)(MyTab)  

