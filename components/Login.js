import React from 'react';
import { ScrollView } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import { Container,Content, Form,Item, View,Button, Toast, Text, Icon,Label,Input } from 'native-base';
import {AsyncStorage} from 'react-native';
import HeaderBox from './HeaderBox.js'
import { StackActions, CommonActions } from '@react-navigation/native';

class Login extends React.Component {   
  constructor(props){   
    super(props);    
    this.state = {
      username:(this.props.route && this.props.route.params && this.props.route.params.username) ? this.props.route.params.username : "",
      password:(this.props.route && this.props.route.params&& this.props.route.params.password) ? this.props.route.params.password : "",
      Autenticated:false,
      visibleLoader:false
    }
    this.Login = this.Login.bind(this);
    this.Server = new Server();   
  
   

  }  
  
  getCartNumber(id){
    let that=this;
    
    let param={
          UId : id
    };

    let SCallBack = function(response){
            var CartNumber=0;
            response.data.result.map((res,index) =>{
                CartNumber+=parseInt(res.number);
            })     
            AsyncStorage.setItem('CartNumber',CartNumber.toString());
             that.props.dispatch({
                type: 'LoginTrueUser',    
                CartNumber:CartNumber
              })
                 

     };
     let ECallBack = function(error){
    }
    this.Server.send("https://marketapi.sarvapps.ir/MainApi/getCartPerId",param,SCallBack,ECallBack)
  }
  Login() {
    let that = this;
    let SCallBack = function(response){
          that.setState({
            visibleLoader:false
          })
           if(!response.data.token){
              Toast.show({
                text: response.data.result[0],
                textStyle: { fontFamily:'IRANYekanMobileLight',textAlign:'right' },
                type: "danger"
              })
              return;       
           }
           that.getCartNumber(response.data.result[0]._id)   
           AsyncStorage.setItem('api_token', response.data.token);
           that.setState({
              Autenticated:true
           }) 
           that.props.dispatch({      
             type: 'LoginTrueUser',    
             CartNumber:response.data.CartNumber
           })
         //that.props.navigation.navigate('Tab1',{p:'LoginTrue'}) 
         //that.props.navigation.dispatch(CommonActions.goBack()) 
         that.props.navigation.dispatch(StackActions.replace('Tabs', {
              screen: 'Home'
          }));       

        
    } 
    let ECallBack = function(error){   
      that.setState({
        visibleLoader:false
       })
    }  
     this.setState({
      visibleLoader:true
     })   
     this.Server.send("https://marketapi.sarvapps.ir/MainApi/getuser",{username:this.state.username,password:this.state.password},SCallBack,ECallBack) 
  
  }
 
  render() {
   const {navigate} = this.props.navigation;
                
    return (   
    <Container>
        <HeaderBox navigation={this.props.navigation} title={'ورود به سامانه'} goBack={true} />

        
        <Content>
        <ScrollView>
          <Text style={{textAlign:'center',marginTop:25,fontFamily:'IRANYekanMobileBold',fontSize:25,color:'#333'}}>ورود به محیط کاربری</Text>
          <Form style={{marginTop:35}}>
            <Item inlineLabel>
              <Input value={this.state.username} keyboardType="number-pad" name="username" placeholder="9120000000"   onChangeText={(text) => this.setState({username:text})  }  />
              <Label style={{fontFamily:'IRANYekanMobileLight'}}>نام کاربری</Label>

            </Item>
            <Item inlineLabel >
               <Input value={this.state.password} secureTextEntry={true} keyboardType="number-pad" name="password"   onChangeText={(text) => this.setState({password:text})  }  />
               <Label style={{fontFamily:'IRANYekanMobileLight'}}>رمز عبور</Label>
            </Item>
            
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:45}}>
                   <Button  rounded  info onPress={this.Login} >
                      <Icon name='arrow-back' />
                      <Text style={{fontFamily:'IRANYekanMobileBold',textAlign:'center'}}>ورود</Text>
                    </Button>
            </View>  
            
            <View style={{flex:1,flexDirection:'row',marginTop:60,justifyContent:'flex-start'}}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:15}}>
                <Button rounded  warning onPress={() => navigate('Register')}>
                      <Icon name='arrow-back' />
                      <Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'center'}}>ثبت نام</Text>
                    </Button>
            </View> 
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:15}}>
                <Button rounded  warning onPress={() => navigate('Register',{type:'changePass'})}>
                      <Icon name='arrow-back' />
                      <Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'center'}}>بازیابی رمز عبور</Text>
                    </Button>
            </View> 
              </View> 
           
           
          </Form>
          {this.state.visibleLoader &&
              <View style={{position:'absolute',left:'50%',bottom:100}}>
              <Image style={{width:50,height:50,justifyContent: 'center',
                alignItems: 'center'}}
                              source={require('../assets/loading.gif')}
                            />
                          </View>
              }
         </ScrollView> 
         </Content> 
     </Container>   
           
    );
  }
}


function mapStateToProps(state) {        
  return{
    CartNumber : state.CartNumber,
    isAuth:state.isAuth
  }
}
export default connect(mapStateToProps)(Login)  

