import React from 'react';
import { StyleSheet ,ScrollView,TouchableWithoutFeedback,ImageBackground,Linking,TouchableOpacity } from 'react-native'; 
import { connect } from "react-redux"


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Main = createStackNavigator();
import Login from './Login'
import Products from './Products'
import Home from './Home'
import Cart from './Cart'
import Cat from './Cat'
import Comments from './Comments'
import Register from './Register'
import User from './User'
import Search from './Search'
import Server from './Server'
import Shops from './Shops'
class Tab1 extends React.Component {   

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
      <Main.Navigator screenOptions={{
          headerShown: false
        }} >
        <Main.Screen name="Home" component={Home} />
        <Main.Screen name="Search" component={Search} />
        <Main.Screen name="Register" component={Register} />
        <Main.Screen name="Comments" component={Comments} />
        <Main.Screen name="Cat" component={Cat} />
        <Main.Screen name="Server" component={Server} />
        <Main.Screen name="Cart" component={Cart} />
        <Main.Screen name="Shops" component={Shops} />
        <Main.Screen name="Products" component={Products} />
        <Main.Screen name="Login" component={Login} />


      </Main.Navigator>   
    );     
  }
}    

function mapStateToProps(state) {        
  return {
    CartNumber : state.CartNumber
  }
}
export default connect(mapStateToProps)(Tab1)  

