import React, { Component } from 'react';
import Login from './components/Login'
import Products from './components/Products'
import Home from './components/Home'
import Cart from './components/Cart'
import Cat from './components/Cat'
import Comments from './components/Comments'
import Register from './components/Register'
import User from './components/User'
import Search from './components/Search'
import Server from './components/Server'
import MyTab from './components/MyTab'
import { Icon } from 'native-base';
import Tab1 from './components/Tab1'
import Tab2 from './components/Tab2'
import Tab3 from './components/Tab3'
import Tab4 from './components/Tab4'
import GetStatus from './components/GetStatus'


import { Provider } from "react-redux"
import { createStore } from "redux"
import reducer from './components/reducer.js'
import * as Font from 'expo-font';
import {View,Text,I18nManager} from 'react-native'             
import { Root } from "native-base";
import {Platform, StyleSheet} from 'react-native';
import Shops from './components/Shops'
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import { createStackNavigator } from '@react-navigation/stack';

const Tabs = () =>{   
 return( <Tab.Navigator initialRouteName="خانه" screenOptions={({ route }) => ({
  
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === "خانه") {
      iconName ='home';
    } 
    else if (route.name === "دسته بندی") {  
      iconName ='paper';
    }
    else if (route.name === "سبد خرید") {
      iconName ='cart';
    }
    else if (route.name === "محیط کاربری") {
      iconName ='person';
    }

    // You can return any component that you like here!
    return <Icon name={iconName} size={size} color={color} />;
  },
  tabBarBadgeStyle:{
    fontFamily:'IRANYekanMobileBold',
    fontSize:20
  },
  tabBarBadge: route.name=="سبد خرید" ?  <GetStatus p="cart" /> : null,
 

})}      
tabBarOptions={{        
  activeTintColor: 'tomato',
  inactiveTintColor: 'gray',
  labelStyle:{
    fontFamily:'IRANYekanMobileBold',
    fontSize:13
  }
}} >
     <Tab.Screen name="محیط کاربری" component={Tab4} />     

   <Tab.Screen name="دسته بندی" component={Tab2}  />
   <Tab.Screen name="سبد خرید" component={Tab3}  />
   <Tab.Screen name="خانه" component={Tab1} />

        
        
       
         
       
        
              
  </Tab.Navigator>)
}
/*
const AppStackNavigator = createStackNavigator({
  Home: {                                
    screen: Home,
    mode: 'screen',
    headerMode: 'none',
    navigationOptions: {
        header:null,
        headerVisible: false,
    }      
  
  },
  Login: {                                                   
    screen: Login ,                            
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,
    }
  }, 
  Products: {                                                   
    screen: Products ,                            
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,
    }
  },
  Shops: {                                                   
    screen: Shops ,                            
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,
    }
  },
  Cart: {                                                   
    screen: Cart ,                            
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                       
        header:null,           
        headerVisible: false,
    }
  },
  Server: {                                
    screen: Server,
    mode: 'screen'  
  }
 ,
  Cat: {                                
    screen: Cat,
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,    
    }  
  },
  Comments:{
    screen: Comments,
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,    
    } 
  }
  ,
  Register: {                                
    screen: Register,
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,
    }  
  },
  User: {                                
    screen: User,
    mode: 'screen',          
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,
    }  
  },
  Search: {                                
    screen: Search,
    mode: 'screen',       
    headerMode: 'none',
    navigationOptions: {                    
        header:null,           
        headerVisible: false,
    }  
  }    
 },
  {
    initialRouteName: 'Home',
  }
 
 );
const Navigator = createAppContainer(AppStackNavigator);*/
const store = createStore(reducer)
const Main = createStackNavigator();
export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {           
      loading: false,
      fontLoaded:true

    }
    console.warn(this.props.CartNumber)   
  }    
async componentDidMount() {       
  
  await Font.loadAsync({
    'IRANYekanMobileLight': require('./assets/fonts/IRANYekanMobileLight.ttf'),
    'IRANYekanMobileBold': require('./assets/fonts/IRANYekanMobileBold.ttf'),
    'IRANSansMobile': require('./assets/fonts/IRANSansMobile.ttf'),
    'Roboto': require('native-base/Fonts/Roboto.ttf'),
    'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
  });
  this.setState({ fontLoaded: true });
  SplashScreen.hide()       
}

 componentWillMount() { 

  }
  render() {
    if(this.state.fontLoaded){
    return (    
      <Provider store={store}>
          <Root>
            <NavigationContainer>
              <Main.Navigator screenOptions={{
                  headerShown: false
                }} >
                <Main.Screen name="Tabs" component={Tabs}  />
                <Main.Screen name="Home" component={Home} />
                <Main.Screen name="Search" component={Search} />
                <Main.Screen name="User" component={User} />
                <Main.Screen name="Register" component={Register} />
                <Main.Screen name="Comments" component={Comments} />
                <Main.Screen name="Cat" component={Cat} />
                <Main.Screen name="Server" component={Server} />
                <Main.Screen name="Cart" component={Cart} />
                <Main.Screen name="Shops" component={Shops} />
                <Main.Screen name="Products" component={Products} />
                <Main.Screen name="Login" component={Login} />

              </Main.Navigator>
            </NavigationContainer>      
          </Root>
        </Provider>  
      
      );
      
    }else{
      return (  
        <View style={{marginTop:100}}>
            <Text>Please Wait ...</Text>
        </View>
      );

    }
  } 
}

