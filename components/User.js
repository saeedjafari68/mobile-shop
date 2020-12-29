import React from 'react';
import { TouchableOpacity} from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Container,Content,Form,Item, View,Button, CheckBox,List, ListItem,Header,Title, Text,Right, Left, Body, Icon,Label,Input,Toast,Segment,Radio } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {AsyncStorage} from 'react-native';
import HeaderBox from './HeaderBox.js'
import SideBar from './SideBar.js'   
import { Drawer } from 'native-base';

class User extends React.Component {   
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
    this.GetFactors = this.GetFactors.bind(this);
    this.GetPayment = this.GetPayment.bind(this);
    this.openDrawer = this.openDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    
   

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
                  
                  that.GetFactors([1,2,3,4]);      


              },function(error){
                  //alert(error)   
              })
          },function(error){
              //alert(error)   
          })
      })
  
  }
  closeDrawer(){
    this.drawer._root.close();
  }
  openDrawer(){
    
    this.drawer._root.open();
  
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
  
 
  GetFactors(params){   
    let that = this;
    var Stat = [];
    if(this.state.Stat1)
      Stat.push("-2");
    if(this.state.Stat2)
      Stat.push("-1");
    if(this.state.Stat3)
      Stat.push("0");
    if(this.state.Stat4)
      Stat.push("1");
    if(this.state.Stat5)
      Stat.push("2");
    if(this.state.Stat6)
      Stat.push("3"); 
    if(this.state.Stat7)
      Stat.push("4");   
    /*if(params){
      Stat=params
    } */  
    let param={            
      user_id:this.state.UserId,
      Stat:Stat
    };    

    let SCallBack = function(response){

      response.data.result.map(function(v,i){
        v.radif=i+1;  
        if(v.status=="-2")
          v.statusDesc="درخواست لغو توسط خریدار"
        if(v.status=="-1")
          v.statusDesc="لغو شده"
        if(v.status=="0")
          v.statusDesc="پرداخت نشده"
        if(v.status=="1")
          v.statusDesc="پرداخت شده"  
        if(v.status=="2")
          v.statusDesc="آماده ارسال"  
        if(v.status=="3")
          v.statusDesc="ارسال شده"
        if(v.status=="4")
          v.statusDesc="پایان"  
      })
      console.warn(response.data.result)
      that.setState({
        GridDataFactors : response.data.result
      })
      that.GetPayment(1);
    };
    let ECallBack = function(error){    
      console.log(error)
    }
    this.Server.send("https://marketapi.sarvapps.ir/MainApi/getFactors",param,SCallBack,ECallBack)
  }
  GetPayment(p){
    let that = this;
    let param={
      user_id:this.state.UserId,
      OkPayment:p==1 ? 1 : 0      
    };
      this.setState({   
        paymentOk:p==1 ? true : false,
        paymentNotOk:p==2 ? true : false
      })
    let SCallBack = function(response){   
      response.data.result.map(function(v,i){
        v.radif=i+1;
      })
      that.setState({
        GridDataPayment : response.data.result
      })
    };
    let ECallBack = function(error){
      console.log(error)
    }
    this.Server.send("https://marketapi.sarvapps.ir/MainApi/getPayment",param,SCallBack,ECallBack)
  }
 
 
  render() {
   const {navigate} = this.props.navigation;
                    
    return (   
      <Container>
        <Drawer
        side="right"
        ref={(ref) => { this.drawer = ref; }}
        content={<SideBar navigator={this.navigator} navigation={this.props.navigation} />}
        onClose={() => this.closeDrawer()} >
      <HeaderBox navigation={this.props.navigation} title={'محیط کاربری'} goBack={true} NewCartNumber={this.state.CartNumber} />
      <Header hasSegment style={{backgroundColor:'#cad9de4f'}}>
          <Left>
            <Button transparent onPress={this.openDrawer}>
              <Icon name="settings" style={{fontSize:30,color:'#333'}} />
            </Button>
          </Left>
          <Body style={{textAlign:'right',marginTop:5}}>
            {this.state.username &&
            <View>
            <Title style={{fontFamily:'IRANSansMobile',color:'#333',fontSize:15}}> {this.state.name}  {this.ConvertNumToFarsi(this.state.username)} </Title>

            </View>
            }
            </Body>
          <Right>
            <Button transparent>
              <Icon name="exit" style={{fontSize:30,color:'#333'}} />
            </Button>
          </Right>
        </Header>
      <Segment style={{backgroundColor:'#cad9de4f'}} >
        
        <Button first active={this.state.selected === 1}  onPress={() => this.setState({ selected: 1 })}>
          <Text style={{fontFamily:'IRANSansMobile',color:'#333'}} >سوابق خرید</Text>

        </Button>
        <Button active={this.state.selected === 2}  onPress={() => this.setState({ selected: 2 })}>
          <Text style={{fontFamily:'IRANSansMobile',color:'#333'}} >سفارشات جاری</Text>
        </Button>
        <Button last active={this.state.selected === 3}  onPress={() => this.setState({ selected: 3 })}>
          <Text style={{fontFamily:'IRANSansMobile',color:'#333'}} >آخرین پرداختها</Text>
        </Button>
      </Segment>
      <Content padder>
      
      { this.state.selected==1 &&
        <View >
         <List>
            {this.state.GridDataFactors.map((v, i) => {
            return(
            <ListItem thumbnail>
              <Left>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>{v.statusDesc}</Text>
              </Left>
              <Body>
                <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>تومان {this.ConvertNumToFarsi(v.Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</Text>
                <Text note numberOfLines={1} style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>{this.ConvertNumToFarsi(v.Date)}</Text>
              </Body>
              <Right>
              
                <Button transparent >
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>جزئیات</Text>
                </Button>
              </Right>
            </ListItem>
            )
            })
          }
          </List>
      </View>

          }
          { this.state.selected==2 &&
          <View>
          <View>
          <Grid style={{display:'none'}}>
          <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat1:!this.state.Stat1
                })
              }} >
         
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>درخواست لغو شده توسط من</Text>
              </Col>
              <Col style={{width:40}}>
              <CheckBox checked={this.state.Stat1} 
                  onPress={() =>{
                    this.setState({
                      Stat1:!this.state.Stat1
                    })
                  }}
              />
              </Col>
            
              
            </Row>
            <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat2:!this.state.Stat2
                })
              }}>
              
              
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>لغو شده</Text>
              </Col>
              <Col style={{width:40}} >
              <CheckBox checked={this.state.Stat2} onPress={() =>{
                this.setState({
                  Stat2:!this.state.Stat2
                })
              }}  
              />
              </Col>
              
            </Row>
           
            <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat3:!this.state.Stat3
                })
              }}>
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>پرداخت نشده</Text>
              </Col>
              <Col style={{width:40}}>
              <CheckBox checked={this.state.Stat3} onPress={() =>{
                this.setState({
                  Stat3:!this.state.Stat3
                })
              }} 
              />
              </Col>
              
              
            </Row>
            <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat4:!this.state.Stat4
                })
              }} >
              
              
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>پرداخت شده</Text>
              </Col>
              <Col style={{width:40}}>
              <CheckBox checked={this.state.Stat4} onPress={() =>{
                this.setState({
                  Stat4:!this.state.Stat4
                })
              }} 
              />
              </Col>
              
            </Row>
            <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat5:!this.state.Stat5
                })
              }} >
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>آماده ارسال</Text>
              </Col>
              <Col style={{width:40}}>
              <CheckBox checked={this.state.Stat5}  onPress={() =>{
                this.setState({
                  Stat5:!this.state.Stat5
                })    
              }}
              />
              </Col>
              
              
            </Row>
            <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat6:!this.state.Stat6
                })
              }} >
             
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>ارسال شده</Text>
              </Col>
              <Col style={{width:40}}>
              <CheckBox checked={this.state.Stat6} onPress={() =>{
                this.setState({
                  Stat6:!this.state.Stat6
                })
              }} 
              />
              </Col>
              
            </Row>
            <Row style={{marginBottom:5}} onPress={() =>{
                this.setState({
                  Stat7:!this.state.Stat7
                })
              }} >
              <Col>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'right',color:'gray',fontSize:12}}>پایان یافته</Text>
              </Col>
              <Col style={{width:40}}>
              <CheckBox checked={this.state.Stat7}  onPress={() =>{
                this.setState({
                  Stat7:!this.state.Stat7
                })
              }}
              />
              </Col>
              
              
            </Row>
            <Row style={{marginBottom:5}}  >
              <Col>
                  <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                    <Button iconLeft light onPress={this.GetFactors}>
                          <Text style={{fontFamily:'IRANSansMobile',textAlign:'center'}}>به روز رسانی اطلاعات</Text>
                        </Button>
                  </View>  
                
            </Col>
             
              
              
            </Row>
            </Grid>
         
            <List>
            {this.state.GridDataFactors.map((v, i) => {
            return(
            <ListItem thumbnail>
              <Left>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>{v.statusDesc}</Text>
              </Left>
              <Body>
                <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>تومان {this.ConvertNumToFarsi(v.Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</Text>
                <Text note numberOfLines={1} style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>{this.ConvertNumToFarsi(v.Date)}</Text>
              </Body>
              <Right>
              
                <Button transparent >
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>جزئیات</Text>
                </Button>
              </Right>
            </ListItem>
            )
            })
          }
          </List>
          </View>
          
          </View>   

          }
          { this.state.selected==3 &&
            <View>
          {this.state.GridDataPayment.map((v, i) => {
            return(
            <ListItem thumbnail>
              <Left>
              <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>تومان {this.ConvertNumToFarsi(v.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</Text>
              </Left>
              <Body>
                <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>{v.refId}</Text>
                <Text note numberOfLines={1} style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>رسید تراکنش</Text>
              </Body>
              <Right>
              
                <Button transparent >
                  <Text style={{fontFamily:'IRANSansMobile',textAlign:'center',fontSize:12}}>{v.date && v.date.split(",")[0]}</Text>
                </Button>
              </Right>
            </ListItem>
            )
            })
          }
           
           </View>


          }
      </Content>
      </Drawer>
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
export default connect(mapStateToProps)(User)  

