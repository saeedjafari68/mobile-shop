import React, { Component } from 'react';
import { ScrollView,TouchableOpacity,Linking  } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import { Container,Content, View,Button, Text, Form, Icon,Item,Input } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';
import HeaderBox from './HeaderBox.js'
import Ionicons from 'react-native-vector-icons/Ionicons';

class Cart extends React.Component {   
  constructor(props){   
    super(props);    
    this.Server = new Server();
    this.state = {
            UserId:null,
            api_token:null,
            lastPrice:"0",
            GridData:null,
            CartNumber:null,
            ItemCount:[],       
            GoToBank:false,
            SetAddress:false,
            address:"",
            username:null,
            visibleLoader:false


    }
    this.Payment = this.Payment.bind(this);
    this.AfterPayment = this.AfterPayment.bind(this);
    this.VerifyAndPayment = this.VerifyAndPayment.bind(this);

    

    
   

  }
  Payment(){
        let that = this;
        this.setState({
          visibleLoader:true
        })
        this.Server.send("https://marketapi.sarvapps.ir/MainApi/getuserInformation",{user_id:this.state.UserId},function(response){
          that.setState({
            visibleLoader:false,
            SetAddress:true,
            address:response.data.result[0].address,
            username:response.data.result[0].username,
            pass:response.data.result[0].password,
            name:response.data.result[0].name
          })
        },function(error){
          that.setState({
            visibleLoader:false
          })

        })
  }  
  VerifyAndPayment(){
    let that = this;
    this.setState({
      visibleLoader:true
    })
    this.Server.send("https://marketapi.sarvapps.ir/AdminApi/ManageUsers",{MyAccount:"1",level:"0",username:this.state.username,pass:this.state.pass,name:this.state.name,address:this.state.address},function(response){
          let products_id=[];
          for(let i=0;i<that.state.GridData.length;i++){
              products_id.push({_id:that.state.GridData[i].product_id,number:that.state.GridData[i].number,title:that.state.GridData[i].products[0].title,subTitle:that.state.GridData[i].products[0].subTitle,desc:that.state.GridData[i].products[0].desc,price:(that.state.GridData[i].number*that.state.GridData[i].price),SellerId:that.state.GridData[i].products[0].SellerId});
          }
          let param={    
                Amount: that.state.lastPrice,
                userId:that.state.UserId,
                products_id:products_id,
                InMobileApp:"1",
                needPay:true
          };       
          let SCallBack = function(response){                      
            console.warn(response)   
            let res =response.data.result;
                 that.setState({
                  GoToBank:true,
                  visibleLoader:false  
                })
                res = response.data.result ? response.data.result.SalePaymentRequestResult : {}; 
                if(res.Token > 0 && res.Status=="0"){
                    Linking.openURL("https://pec.shaparak.ir/NewIPG/?token="+res.Token)                               
                }          
  
               //  window.location = res;
           };
           let ECallBack = function(error){
            that.setState({
              visibleLoader:false
            })
          }
          that.Server.send("https://marketapi.sarvapps.ir/MainApi/payment2",param,SCallBack,ECallBack)

        },function(error){
          that.setState({
            visibleLoader:false
          })
        })
  }
  componentDidMount() {

      let that = this;
      let api_token="";
      this.setState({
        visibleLoader:true
      })



     








      
      AsyncStorage.getItem('api_token').then((value) => {
      api_token = value;
      that.Server.send("https://marketapi.sarvapps.ir/MainApi/checktoken",{
          token:api_token
        },function(response){
    
          that.setState({
            userId : response.data.authData.userId,
            levelOfUser:response.data.authData.levelOfUser,
            lastPrice : 0,
            api_token:api_token,
            UserId : response.data.authData.userId
            
          })
          that.Server.send('https://marketapi.sarvapps.ir/MainApi/getSettings',{
            token: api_token
          },function(response){
            that.setState({
                ActiveBank:response.data.result ? response.data.result.ActiveBank : "none",
                ActiveSms:response.data.result ? response.data.result.ActiveSms : "none",
                STitle:response.data.result ? response.data.result.STitle : "",
                visibleLoader:false
            })
            that.getCartItems();

          },function(error){
            alert(error)
          })

        },function(error){
            alert(error)
        })
      })
  }
  
 
  componentWillUnmount() {
 
 
  }
  ChangeCount(C,I,product_id){
      if(C==-1 && this.state.ItemCount[I] <= 1  )
          return;
      let ItemCount = this.state.ItemCount;
      ItemCount[I] = parseInt(ItemCount[I])+parseInt(C)+"";
      console.warn(ItemCount[I])
      
      let that = this;
      let param={  
              product_id :  product_id,
              user_id : this.state.UserId,
              number:C=="0" ? C : ItemCount[I]
        };

        let SCallBack = function(response){
                that.getCartItems();
         };
         let ECallBack = function(error){
                alert(error)
        }
        this.Server.send("https://marketapi.sarvapps.ir/MainApi/changeCart",param,SCallBack,ECallBack)

  }
  ConvertNumToFarsi(text){
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    if(!text)
      return text;
    return text.toString().replace(/[0-9]/g, function(w){   
     return id[+w]
    });
  }
  AfterPayment(){
    this.setState({
      GoToBank:false,
      SetAddress:false
    })
    this.getCartItems();
  }
  getCartItems(){
        let that=this;
        /*this.setState({
            lastPrice : 0
        })  */       
        let param={
              UId : this.state.UserId
        };

        let SCallBack = function(response){
                let lastPrice=0, 
                    CartNumber=0,
                    ItemCount=[];
                response.data.result.map((res,index) =>{
                    lastPrice+=res.number*res.price;
                    CartNumber+=parseInt(res.number);
                    ItemCount[index] = res.number+""

                })     
                AsyncStorage.setItem('CartNumber',CartNumber.toString());
                that.setState({
                    lastPrice:parseInt(lastPrice),
                    GridData:response.data.result,
                    CartNumber:CartNumber,
                    ItemCount:ItemCount
                })
                 that.props.dispatch({
                    type: 'LoginTrueUser',    
                    CartNumber:that.state.CartNumber
                  })
                     
    
         };
         let ECallBack = function(error){
                alert(error)
        }
        this.Server.send("https://marketapi.sarvapps.ir/MainApi/getCartPerId",param,SCallBack,ECallBack)
    }
  render() {
        const {navigate} = this.props.navigation;
        
                       
    return (   
    <Container>
      <HeaderBox navigation={this.props.navigation} title={'سبد خرید'} goBack={true} NewCartNumber={this.state.CartNumber} />
        
        <Content style={{marginBottom:40}}>   
          {this.state.GoToBank &&
          <View style={{position:'absolute',width:'100%',zIndex:2}}>
           <View style={{backgroundColor:'#fff',marginTop:100,height:180,margin:30,borderRadius:5,borderWidth:1,borderColor:'#ccc',borderStyle:'solid'}}>
           <View style={{paddingTop:10}}>
              <Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'center',fontSize:13}}>در حال اتصال به بانک</Text>   
            </View>
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:15}}>
              <Image style={{width:50,height:50,justifyContent: 'center',
                  alignItems: 'center'}}
                  source={require('../assets/loading.gif')}
                />
              </View>
            <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:50,marginTop:15}}>

            <Button  info  onPress={this.AfterPayment} >
                  <Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'center',fontSize:13}}>انجام شد</Text>
                </Button>
           </View>
             </View> 
          </View>

          }
        <View style={{backgroundColor:'#ba6dc7',padding:10,width:'100%'}}>
           <Text style={{textAlign:'center',fontFamily:'IRANYekanMobileBold',color:'#fff'}}>
            تعداد محصولات سبد خرید : {this.ConvertNumToFarsi(this.props.CartNumber)}
           </Text>    
           
         </View> 
        <ScrollView>
          <View style={{minHeight:200}} >
        {this.state.lastPrice !="0" &&
          <View >      
          
              <View style={{marginTop:25}}>
              <Text   style={{fontFamily:"IRANYekanMobileLight",textAlign:'center',marginTop:10,marginBottom:10}}>
                  مبلغ قابل پرداخت  
                  &nbsp;&nbsp;<Text style={{fontFamily:"IRANYekanMobileBold",fontSize:25,color:'red'}}>{this.ConvertNumToFarsi(this.state.lastPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</Text> &nbsp;&nbsp; 
                  تومان
              </Text>
              </View>
              {this.state.SetAddress &&
                <View>
                  <View>
                    <Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'center',color:'#70757a',fontSize:12}}>
                    محصول خریداری شده به آدرس زیر ارسال می شود  
                    </Text>
                    <Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'center',marginTop:10,color:'#70757a',fontSize:12}}>
                    در صورت تمایل می توانید آدرس را اصلاح کنید  
                    </Text>
                  </View>
                  <Form style={{marginBottom:35,marginRight:10,marginTop:10}}>
                    <Item inlineLabel>
                      <Input value={this.state.address}  name="address"  style={{borderColor:'#000',fontSize:13,textAlign:'right',fontFamily:'IRANYekanMobileLight'}}    onChangeText={(text) => this.setState({address:text})  }  />
                    </Item>
                  </Form>
                </View>
              }
              {!this.state.SetAddress ?
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:15}}>
                  <Button iconLeft success onPress={this.Payment}>
                    <Icon name='cart' />
                    <Text style={{fontFamily:'IRANYekanMobileBold',textAlign:'center'}}>پرداخت</Text>
                  </Button>
              </View>
             :
             <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:25,marginTop:15}}>
                  <Button iconLeft success onPress={this.VerifyAndPayment}>
                    <Icon name='cart' />
                    <Text style={{fontFamily:'IRANYekanMobileBold',textAlign:'center'}}>تایید آدرس و پرداخت</Text>
                  </Button>
              </View>
             }
        
        </View>
          }
                  </View>
           
          {this.state.lastPrice =="0" && this.state.CartNumber == 0 &&
          <View >
     
          <Text   style={{fontFamily:"IRANYekanMobileLight",textAlign:'center',marginTop:10,marginBottom:10}}>
                        سبد خرید خالی است
                        </Text>
            </View>

        }
         <Grid style={{border:'1px solid red'}}>
        {
        this.state.GridData && this.state.GridData.map((item, index) => (
          
          <Row style={{borderWidth: 1,borderColor: '#d6d7da'}}>
    <Col style={{verticalAlign:'middle',borderRightWidth: 1,borderColor: '#d6d7da',alignSelf:'center'}}>
    <TouchableOpacity  onPress={() => this.ChangeCount("0",index,item.products[0]._id)}><Icon name='close' style={{fontSize:30,textAlign:'center',color:'red'}}  /></TouchableOpacity>
      
    </Col>      
   <Col style={{borderRightWidth: 0.5,borderColor: '#eee',alignSelf:'center'}}>
  <Grid style={{marginBottom:10,marginTop:20}}>
    <Row>
      <Col>
          <TouchableOpacity onPress={() => this.ChangeCount(+1,index,item.products[0]._id)} ><Text style={{fontFamily:"IRANYekanMobileLight",fontSize:30,textAlign:'center'}}><Ionicons name="ios-arrow-dropup-circle" style={{ fontSize: 30, color: 'green' }} /></Text></TouchableOpacity>
      </Col> 
      </Row>
      <Row style={{marginTop:15}}> 
      <Col>
          <View>
            <Text style={{fontFamily:"IRANYekanMobileLight",fontSize:30,textAlign:'center',color:'#333'}}>
              {this.ConvertNumToFarsi(this.state.ItemCount[index])}
            </Text>
          </View>
      </Col>
      </Row>
      <Row>
      <Col>
          <TouchableOpacity  onPress={() => this.ChangeCount(-1,index,item.products[0]._id)}><Text style={{fontFamily:"IRANYekanMobileLight",fontSize:50,textAlign:'center'}}><Ionicons name="ios-arrow-dropdown-circle" style={{ fontSize: 30, color: 'red' }} /></Text></TouchableOpacity>
      </Col>
    </Row>
  </Grid>
  
  </Col>       
  <Col style={{width:'60%'}}>
      <View style={{padding:15}}>
        <Text style={{fontFamily:"IRANYekanMobileLight",textAlign:"center",fontSize:20,color:'#333'}}>
          {item.products[0].title}
        </Text>
      </View>
      {item.products[0].subTitle !="-" &&
      <View >
        <Text style={{fontFamily:"IRANYekanMobileLight",textAlign:"center",fontSize:13}}>
          {item.products[0].subTitle}
        </Text>
      </View>
      }
      {item.products[0].desc !="-" &&
      <View style={{padding:15,flex:1,justifyContent:'center',flexDirection:'row'}}>
        <View >
        <Image source={{uri:'https://marketapi.sarvapps.ir/' +item.products[0].fileUploaded.split("public")[1]}} style={{width:130,height:100}}   />

        </View>

      </View>
      }
      
  </Col>
</Row>
               
         )) 
      }  

        </Grid>
         </ScrollView> 
         </Content> 
         {this.state.visibleLoader &&
              <View style={{position:'absolute',bottom:50,left:'50%'}}>  
              <Image style={{width:50,height:50,justifyContent: 'center',
                  alignItems: 'center'}}
                  source={require('../assets/loading.gif')}
                />
              </View>
              }
     </Container>             
    
           
    );
  }
}


function mapStateToProps(state) {        
  return {
    CartNumber : state.CartNumber
  }
}
export default connect(mapStateToProps)(Cart)  

