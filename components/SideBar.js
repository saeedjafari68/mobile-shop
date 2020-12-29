import React from 'react';
import { TouchableOpacity} from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Container,Content,Form,Item, View,Button, CheckBox,List, ListItem,Header,Title, Text,Right, Left, Body, Icon,Label,Input,Toast,Segment,Radio } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';
import HeaderBox from './HeaderBox.js'

class SideBar extends React.Component {   
  constructor(props){   
    super(props);    
    this.state = {
      username : null,
      password :  null,
      password2 : null,
      name : null,
      address: null,
      status: null,
      selected:2,
      api_token:null,
      GridDataPayment:[],
      GridDataFactors:[],
      paymentNotOk:false,
      paymentOk:false,
      Stat1:false,
      Stat2:false,
      Stat3:true,
      Stat4:true,
      Stat5:true,            
      Stat6:true,
      Stat7:false

    }
    this.Server = new Server();
    this.updateUserInformation = this.updateUserInformation.bind(this);
    
   

  }  
  ConvertNumToFarsi(text){
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return text.toString().replace(/[0-9]/g, function(w){
     return id[+w]
    });
  }
  componentDidMount() {
      let that = this;
      AsyncStorage.getItem('api_token').then((value) => {   
        that.setState({
            api_token : value
          })
          that.Server.send("https://marketapi.sarvapps.ir/MainApi/checktoken",{
              token:that.state.api_token
          },function(response){
              that.setState({
                UserId : response.data.authData.userId
              })
              that.Server.send("https://marketapi.sarvapps.ir/MainApi/getuserInformation",{
                user_id:that.state.UserId
              },function(response){
                  that.setState({
                    username :  response.data.result[0].username,
                    password :  response.data.result[0].password,
                    password2 : response.data.result[0].password,
                    name : response.data.result[0].name,
                    address: response.data.result[0].address,
                    status: response.data.result[0].status,

                  })
                  


              },function(error){
                  //alert(error)   
              })
          },function(error){
              //alert(error)   
          })
      })
  
  }

  updateUserInformation(){
          let that = this;
        if(this.state.password != this.state.password2 || this.state.password == ""){
            Toast.show({
              text: "رمز عبور و تکرار آن صحیح نیست",
              textStyle: { fontFamily:'IRANSansMobile',textAlign:'right' },
              type: "danger"
            })
            return;
          }   
        that.Server.send("https://marketapi.sarvapps.ir/AdminApi/ManageUsers",{
                level:"0",
                status:that.state.status,
                username:that.state.username,
                pass:that.state.password,
                name:that.state.name,
                address:that.state.address,      

              },function(response){
                Toast.show({
                  text: 'ویرایش اطلاعات انجام شد',
                  textStyle: { fontFamily:'IRANSansMobile',textAlign:'right' },
                  type: "success"
                })


              },function(error){
                  //alert(error)   
              })
  }
  
 
  
 
 
  render() {
   const {navigate} = this.props.navigation;
                    
    return (   
      <Container>
      
      
      <Content padder>
      
        <View >
            <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',paddingRight:10,fontSize:15,marginTop:20}}>ویرایش اطلاعات شخصی</Text>
     
        <Form style={{marginTop:5}}>
         
          <Item floatingLabel >
          <Input value={this.state.name} name="name" style={{fontFamily:'IRANSansMobile',textAlign:'right'}}   onChangeText={(text) => this.setState({name:text})  }  />
          <Label style={{fontFamily:'IRANSansMobile',textAlign:'right'}}>نام و نام خانوادگی</Label>

        </Item>
        
        <Item floatingLabel  >
           <Input value={this.state.password} style={{fontFamily:'IRANSansMobile',textAlign:'right'}} secureTextEntry={true} keyboardType="number-pad" name="password"   onChangeText={(text) => this.setState({password:text})  }  />
           <Label style={{fontFamily:'IRANSansMobile',textAlign:'right'}}>رمز عبور</Label>
        </Item>
        <Item floatingLabel  >
           <Input value={this.state.password2}  style={{fontFamily:'IRANSansMobile',textAlign:'right'}} secureTextEntry={true} keyboardType="number-pad" name="password2"   onChangeText={(text) => this.setState({password2:text})  }  />
           <Label style={{fontFamily:'IRANSansMobile',textAlign:'right'}}>تکرار رمز عبور</Label>
        </Item>
        <Item floatingLabel >
          <Input value={this.state.address} style={{fontFamily:'IRANSansMobile',textAlign:'right'}}  name="address"    onChangeText={(text) => this.setState({address:text})  }  />
          <Label style={{fontFamily:'IRANSansMobile',textAlign:'right'}}>آدرس کامل پستی</Label>

        </Item>
        <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:45}}>
            <Button iconLeft info onPress={this.updateUserInformation}>
                  <Icon name='arrow-back' />
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>ثبت اطلاعات</Text>
                </Button>
        </View>  
        <View style={{flex:1,flexDirection:'row',marginTop:60,justifyContent:'flex-start'}}>
        
          </View> 
       
       
      </Form>
      </View>

          
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
export default connect(mapStateToProps)(SideBar)  

