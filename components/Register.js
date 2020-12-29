import React from 'react';
import { ScrollView,AsyncStorage } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Container,Content, Form,Item, View,Button, Toast, Text,  Label,Input,Icon } from 'native-base';
import HeaderBox from './HeaderBox.js'
import CountDown from 'react-native-countdown-component';

class Register extends React.Component {   
  constructor(props){   
    super(props);    
    this.Server = new Server();
    this.state = {
        type:(this.props.navigation.state && this.props.navigation.state.params) ? this.props.navigation.state.params.type : '',
        username:null,
        password:null,
        password2:null,
        name:null,
        SecurityCode : '',
        AfterFirstStep : false,
        AfterFinalStep : false,
        SmsToken : null,   
        Waiting:false,
        SendSmsAgain:0
    }
    this.Register=this.Register.bind(this);
    this.GetNewPassword=this.GetNewPassword.bind(this);
    this.Login=this.Login.bind(this);

    
    
   

  }  

  GetNewPassword(){
    let that = this;
    this.setState({
      Waiting:true,
      HasError:null
    })
     let SCallBack = function(response){
           
       var text = response.data.result; 

       if(isNaN(text)){
            
          that.setState({
            HasError:text,
             Waiting:false
          })
          return;
        }
        var SmsPanel=2;
        if(SmsPanel==1){
                  
            that.Server.send('https://marketapi.sarvapps.ir/MainApi/GetSmsToken',{
              "UserApiKey":"b684bd5c7cc186e5c870c19b",
              "SecretKey":"sj@907@4286"
            },function(response){
                    that.setState({
                    SmsToken:response.data.result.TokenKey
                  })
            that.Server.send("https://marketapi.sarvapps.ir/MainApi/sendsms",{
                    token: response.data.result.TokenKey,
                    text: "رمز عبور شما در فروشگاه آنلاین آنیا \n"+text+"\n در اولین فرصت رمز عبور خود را تغییر دهید",
                    mobileNo : that.state.username
                  },function(response){
                    that.setState({
                      Waiting:false,
                      HasError:'رمز عبور جدید به شماره تلفن همراه شما ارسال شد'
                    })     

                
                    console.log(response)



                  },function(error){
                      that.setState({
                      Waiting:false
                    })
                      alert(error)   
            })

            },function(error){
              that.setState({
                      Waiting:false
                    })
                      alert(error)   
            })

           } else{

            that.Server.send("https://marketapi.sarvapps.ir/MainApi/sendsms",{
                    token: response.data.result.TokenKey,
                    text: "رمز عبور شما در فروشگاه آنلاین آنیا : \n"+text+"\n در اولین فرصت رمز عبور خود را تغییر دهید",
                    mobileNo : that.state.username
                  },function(response){
                    that.setState({
                      Waiting:false,
                      HasError:'رمز عبور جدید به شماره تلفن همراه شما ارسال شد'
                    })     

                



                  },function(error){
                      that.setState({
                      Waiting:false
                    })
                      alert(error)   
            })
          }
                 
          }
          let ECallBack = function(error){   
              alert(error)      
          }  
        
   that.Server.send("https://marketapi.sarvapps.ir/MainApi/GetNewPass",{
        username: that.state.username
      },SCallBack,ECallBack)

  }
  Register(Again) {
 
    let that = this;
    if(!that.state.AfterFirstStep || Again){
      if(!that.state.username || (that.state.username && that.state.username.length != 10)){
       
        Toast.show({
          text: "تعداد ارقام تلفن همراه صحیح نیست",
          textStyle: { fontFamily:'IRANYekanMobileLight',textAlign:'center' },
          type: "danger"
        })
        return;
      }
      if(that.state.password != that.state.password2){
       
        Toast.show({
          text: "رمز عبور و تکرار آن متفاوت است",
          textStyle: { fontFamily:'IRANYekanMobileLight',textAlign:'center' },
          type: "danger"
        })
        return;
      }
    let SCallBack = function(response){
          if(response.data.result[0] && response.data.result[0].status=="1"){
              Toast.show({
                text: response.data.msg,
                textStyle: { fontFamily:'IRANYekanMobileLight',textAlign:'center' },
                type: "danger"
              })
              return;
        }
        var SmsPanel=!that.state.SendSmsAgain  ? 1 : 2 ;

        that.setState({
          AfterFirstStep : true,
          SendSmsAgain:that.state.SendSmsAgain==1 ? 2 : 0
        })  
         var SecCode = response.data.SecurityCode;

        if(SmsPanel==1){      
            that.Server.send('https://marketapi.sarvapps.ir/MainApi/GetSmsToken',{
              "UserApiKey":"b684bd5c7cc186e5c870c19b",
              "SecretKey":"sj@907@4286"
            },function(response){
                    that.setState({
                    SmsToken:response.data.result.TokenKey
                  })
                  Toast.show({
                    text: "کد امنیتی به "+that.state.username+" پیامک شد ",
                    textStyle: { fontFamily:'IRANYekanMobileLight',textAlign:'right' },
                    type: "info"
                  })
            that.Server.send("https://marketapi.sarvapps.ir/MainApi/sendsms2",{
                    token: response.data.result.TokenKey,
                    text: "کد امنیتی ثبت نام در فروشگاه آنلاین آنیا : \n"+SecCode,
                    mobileNo : that.state.username
                  },function(response){



                  },function(error){
                      alert(error)   
            })

            },function(error){
                      alert(error)   
            })


          }else{
      
            that.Server.send("https://marketapi.sarvapps.ir/MainApi/sendsms",{
              token: response.data.result.TokenKey,
              text: "کد امنیتی ثبت نام در فروشگاه آنلاین آنیا : \n"+SecCode,
              mobileNo : that.state.username
            },function(response){

              Toast.show({
                text: "کد امنیتی به "+that.state.username+" پیامک شد ",
                textStyle: { fontFamily:'IRANYekanMobileLight',textAlign:'right' },
                type: "info"
              })

            },function(error){
                alert(error)   
           })
          }
    

                 
          }
          let ECallBack = function(error){      
              alert(error)   
          }     
        console.warn(that.state.password)
   that.Server.send("https://marketapi.sarvapps.ir/MainApi/Register",{
        username: that.state.username,
        password: that.state.password,
        Step: "1"
      },SCallBack,ECallBack)
     
    }
if(this.state.AfterFirstStep && !Again){
      if(this.state.SecurityCode == "" ){
        Toast.show({
          text:"کد امنیتی پیامک شده را وارد کنید",
          textStyle: { fontFamily:'IRANYekanMobileLight',textAlign:'center' },
          type: "danger"
        })

        return;

      }
let SCallBack = function(response){
              if(response.data.msg){
                Toast.show({
                  text: response.data.msg,
                  textStyle: { fontFamily:'IRANYekanMobileLight',textAlign:'center' },
                  type: "danger"
                })
            
              return;
            }

          that.Server.send("https://marketapi.sarvapps.ir/MainApi/Register",{
            username: that.state.username,
            password: that.state.password,
            Step: "3"
          },function(response){
           // localStorage.setItem("api_token",response.data.token);
           Toast.show({
              text: "ثبت نام شما با موفقیت انجام شد",
              textStyle: { fontFamily:'IRANYekanMobileLight',textAlign:'right' },
              type: "success"
            })
            that.setState({
              AfterFinalStep : true
            })  
            that.Login();  
            //that.props.navigation.navigate('Login',{username:that.state.username,password:that.state.password}) 

            },function(error){
               alert(error)   
            })
            
       }  

      let ECallBack = function(error){
              alert(error)   
          }  
        
   that.Server.send("https://marketapi.sarvapps.ir/MainApi/Register",{
        username: that.state.username,
        password: that.state.password,
        SecurityCode: that.state.SecurityCode,
        Step: "2"
      },SCallBack,ECallBack)
      
     

    }





 
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
           AsyncStorage.setItem('api_token', response.data.token);
           
           that.props.dispatch({
             type: 'LoginTrueUser',    
             CartNumber:response.data.CartNumber
           })
           that.props.navigation.navigate('Home',{p:'LoginTrue'}) 
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
              <HeaderBox navigation={this.props.navigation} title={'ثبت نام'} goBack={true} />

        <Content>
        <ScrollView>   
         {this.state.type=='' &&
 
  <View>
        <Text style={{textAlign:'center',marginTop:25,fontFamily:'IRANYekanMobileBold',fontSize:25,color:'#333'}}>ثبت نام</Text>
          <Form style={{marginTop:35}}>
           
            <Item inlineLabel>
              <Input value={this.state.username} keyboardType="number-pad" name="username"  placeholder="9120000000"  onChangeText={(text) => this.setState({username:text})  }  />
              <Label style={{fontFamily:'IRANYekanMobileLight'}}>موبایل</Label>

            </Item>
            <Item inlineLabel >
               <Input value={this.state.password} secureTextEntry={true} keyboardType="number-pad" name="password"   onChangeText={(text) => this.setState({password:text})  }  />
               <Label style={{fontFamily:'IRANYekanMobileLight'}}>رمز عبور</Label>
            </Item>
            <Item inlineLabel >
               <Input value={this.state.password2} secureTextEntry={true} keyboardType="number-pad" name="password2"   onChangeText={(text) => this.setState({password2:text})  }  />
               <Label style={{fontFamily:'IRANYekanMobileLight'}}>تکرار رمز عبور</Label>
            </Item>  
            {this.state.AfterFirstStep &&
            <Item inlineLabel >
            <Input value={this.state.SecurityCode} secureTextEntry={true} keyboardType="number-pad" name="SecurityCode"   onChangeText={(text) => this.setState({SecurityCode:text})  }  />
             
            <Label style={{fontFamily:'IRANYekanMobileLight'}}>کد امنیتی</Label>
					  </Item>
           
            } 
            
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:45}}>
            {!this.state.AfterFirstStep ?
                    <Button rounded success onPress ={() => this.Register(0)}>
                      <Icon name='arrow-back' />
                      <Text style={{fontFamily:'IRANYekanMobileBold',textAlign:'center'}}>ثبت نام</Text>
                    </Button>
            :
            this.state.AfterFirstStep && !this.state.SecurityCode ?
                    <Button rounded success disabled>
                      <Icon name='arrow-back' />
                      <Text style={{fontFamily:'IRANYekanMobileBold',textAlign:'center'}}>ادامه ثبت نام</Text>
                    </Button>   
                    :
                    <Button rounded success onPress ={() => this.Register(0)} >
                    <Icon name='arrow-back' />
                    <Text style={{fontFamily:'IRANYekanMobileBold',textAlign:'center'}}>ادامه ثبت نام</Text>
                  </Button>   
            }
            </View> 
            {this.state.AfterFirstStep && this.state.SendSmsAgain ==0 &&
            <View style={{marginTop:10,marginBottom:10}}>
                <Label style={{fontFamily:'IRANYekanMobileLight',fontSize:12,textAlign:'center'}}>در صورت دریافت نکردن پیامک کد تایید مجددا تلاش کنید</Label>
                <CountDown
                until={90}
                onFinish={() => this.setState({   
                  SendSmsAgain:1
                })}
                size={20}
                timeToShow={['M', 'S']}
                timeLabels={{m: '',s: ''}}
                />
             </View>
            }
            {this.state.SendSmsAgain == 1 &&  
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:45}}>
                <Button rounded primary onPress ={() => this.Register(1)} >
                      <Icon name='refresh' />
                      <Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'center'}}>ارسال مجدد پیامک کد تایید</Text>
                    </Button>
             </View>
            }
         
          </Form>   
 
  </View>
 }{this.state.type=='changePass' &&

 <View>
   <Text style={{textAlign:'center',marginTop:25,fontFamily:'IRANYekanMobileBold',fontSize:25,color:'#333'}}>بازیابی رمز عبور</Text>
    
 
  <Form style={{marginTop:35}}>
           
            <Item inlineLabel>
              <Input value={this.state.username} keyboardType="number-pad" name="username"                        onChangeText={(text) => this.setState({username:text})  }  />
              <Label style={{fontFamily:'IRANYekanMobileLight'}}>موبایل</Label>

            </Item>
             
     

          <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:45}}>
                <Button rounded success onPress ={this.GetNewPassword}>
                      <Icon name='arrow-back' />
                      <Text style={{fontFamily:'IRANYekanMobileBold',textAlign:'center'}}>دریافت رمز عبور</Text>
                    </Button>
            </View>
          {this.state.Waiting &&
          <View style={{marginTop:15}}>
              <Label style={{textAlign:'center',padding:10}}>لطفا صبر کنید</Label>
              </View>
          }
          <View style={{marginTop:15}}>
          <Label style={{textAlign:'center',fontFamily:'IRANYekanMobileLight'}}>{this.state.HasError}</Label>
          </View>
         
          </Form>   
 </View>
 
 
 }


          
         </ScrollView> 
         </Content> 
     </Container>             
    
           
    );
  }
}


function mapStateToProps(state) {        
  return {
    CartNumber : state.CartNumber
  }
}
export default connect(mapStateToProps)(Register)  

