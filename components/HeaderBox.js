import React from 'react';
import { Platform,TouchableOpacity,Image,ImageBackground,StyleSheet} from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Header, View,Button, Text, Left,Right, Item ,Input} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
     
let cards = [];              
const image = { uri: "https://image.freepik.com/free-photo/feminine-rhombus-frame_53876-90183.jpg" };

class HeaderBox extends React.Component {   
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
            CatData:[],
            CartNumber:0
    } 
    this.findUser = this.findUser.bind(this);
    this.logout = this.logout.bind(this);
    this.refresh = this.refresh.bind(this);
  }  

  findUser(){

    let that = this;
      AsyncStorage.getItem('CartNumber').then((value) => {
                        console.log(value) 
              that.setState({   
                CartNumber:value      
              })
           })
    AsyncStorage.getItem('api_token').then((value) => {    
       let SCallBack = function(response){

         

           that.setState({
             username:response.data.authData.username,
             userId : response.data.authData.userId,
				     name : response.data.authData.name
           })                 
    } 
    let ECallBack = function(error){
     //alert(error)   
    }  
        
   this.Server.send("https://marketapi.sarvapps.ir/MainApi/checktoken",{token:value},SCallBack,ECallBack) 

    } )
  }   
  componentWillReceiveProps(){
    if(this.props.NewCartNumber)
      this.setState({
        CartNumber:this.props.NewCartNumber  
      })
  }
  componentDidUpdate(){
     let that = this;  

    if((this.props.route && this.props.route.params ) && this.props.route.params.p=="LoginTrue")
     {
      this.findUser(); 
     } 
      
  }
  componentDidMount() { 
    this.findUser(); 
  }
   logout(){    
    AsyncStorage.setItem('api_token',"");
    AsyncStorage.setItem('CartNumber',"");
    this.setState({
      username:null  
    })
    this.props.dispatch({
      type: 'LoginTrueUser',    
      CartNumber:0
    })
  }
 refresh(){
   this.setState({
     CartNumber:this.props.CartNumber
   })
 }
 ConvertNumToFarsi(text){
  var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  if(!text)
    return text;
  return text.toString().replace(/[0-9]/g, function(w){
   return id[+w]
  });
}
 
  render() { 
    const {navigate} = this.props.navigation;    
           
    return ( 
 
     <View style={{height:45,backgroundColor:'#fff',borderBottomColor:'#ccc',borderBottomWidth:1}}>

     <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',flexWrap:'nowrap'}}  >
          
       
        <View style={{width:'100%',backgroundColor:'#eee'}}>      
  
        {this.props.goBack ?  
        <View style={{flex:1,flexDirection:'row-reverse'}}>
            <View style={{flexBasis:'90%'}}><Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'center',fontSize:20,marginTop:5,color:'#333'}}>{this.props.title}</Text></View>
            <View style={{flexBasis:'10%'}}>
              
            <TouchableOpacity style={{marginLeft:20,marginTop:5}} onPress={() => {

              if(this.props.CatData && this.props.CatData.length > 0) {
                this.props.CatData.pop();

              }
              (!this.props.CatData || (this.props.CatData && this.props.CatData.length <1)) ? this.props.navigation.goBack() : (this.props.navigation.navigate('Cat', {CatData: this.props.CatData,AfterBack:1})) }}  >
            <Icon  name='md-arrow-back' size={30}  style={{color:'#333'}} />
            </TouchableOpacity>
            </View>

        </View>           
        :
        <TouchableOpacity onPress={() => {  navigate('Search')}} style={{flex:1,flexDirection:'row',padding:5,borderRadius:5,margin:0,justifyContent:'center'}}  >
            <View style={{paddingTop:3,display:'flex',flexWrap:'nowrap',flexDirection:'row-reverse'}}> 
            <Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'right',fontSize:20,color:'#000'}}> 
            جستجو در
            </Text>
            <Text style={{fontFamily:'IRANYekanMobileBold',textAlign:'right',fontSize:20,color:'red'}}>   آنیا شاپ</Text>
                   
            </View>   
            <Icon active name='ios-search' style={Platform.OS==='android' ? {paddingTop:7,color:'#ccc',fontSize:19,paddingLeft:10} : {color:'#333'}} />
            
          </TouchableOpacity>
        }   
      </View>
   
 
          
        </View> 
         
     </View> 
         
          
    );  
  }
}

const styles = StyleSheet.create({
  
  image:{
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  }
});

function mapStateToProps(state) {        
  return {
    CartNumber : state.CartNumber
  }
}
export default connect(mapStateToProps)(HeaderBox)  

