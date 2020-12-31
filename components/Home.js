import React from 'react';
import { StyleSheet ,ScrollView,TouchableWithoutFeedback,ImageBackground,Linking,TouchableOpacity } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'           
import { Image } from 'react-native';
import { Container,Content,  View,Button, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Body, Icon } from 'native-base';
import {AsyncStorage} from 'react-native';
import { Drawer } from 'native-base';
import SideBar from './SideBar.js'   
import HeaderBox from './HeaderBox.js'
import Autocomplete from 'react-native-autocomplete-input';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Swiper from 'react-native-swiper'

//Drawer.defaultProps.styles.mainOverlay.elevation = 0;   
let cards = [];      
function Item({ title }) {       
  return (
    <View style={{margin:5}}>
      <Button ><Text  style={styles.Text}>{title}</Text></Button>
    </View>
  );        
}  
const image2 = { uri:  "http://sarvapps.ir/25097.jpg" };
const image = { uri: "http://sarvapps.ir/25102.jpg" };
const image3 = { uri: "https://aniashop.ir/static/media/a589912c.a589912c.svg" };
class Home extends React.Component {   
   static renderFilm(film) {
    const { title, subTitle, desc } = film;

    return (
      <View style={{marginBottom:100}}> 
        
      </View>
    );
  }
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
            visibleLoader:false,
            logo1 : null,
            link1:null,
            text1:null,
            logo2 : null,
            link2:null,
            text2:null,
            logo3 : null,
            link3:null,
            text3:null,
            logo4 : null,
            link4:null,
            text4:null,
            logo5 : null,
            link5:null,
            text5:null,
            logo6 : null,
            link6:null,
            text6:null,
            logo7 : null,
            link7:null,
            text7:null,
            logo8 : null,
            link8:null,
            text8:null,
            logo9 : null,
            link9:null,
            text9:null
    }
    this.openDrawer = this.openDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)

 }  

closeDrawer(){
  this.drawer._root.close();
}
openDrawer(){
  this.drawer._root.open();

}
ConvertNumToFarsi(text){
  if(!text)
    return text;
  var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return text.toString().replace(/[0-9]/g, function(w){
   return id[+w]
  });
}
  componentDidUpdate(){
    if(this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.p=="LoginTrue"){
      this.props.navigation.state.params.p="a";
      this.setState({
        LoginTrue:true
      })

    }  
  }        
  componentDidMount() {     
       
    let that = this;
    //that.getCats(); 
    //return;
    AsyncStorage.getItem('api_token').then((value) => {      
      
        that.Server.send("https://marketapi.sarvapps.ir/MainApi/checktoken",{
            token:value
        },function(response){
          that.props.dispatch({
            type: 'LoginTrueUser',    
            CartNumber:AsyncStorage.getItem('CartNumber').then((value) => that.props.dispatch({
                        type: 'LoginTrueUser',    
                        CartNumber:value
                      }))
          })       
        })
    })
    /*AsyncStorage.getItem('CartNumber').then((value) => that.props.dispatch({
      type: 'LoginTrueUser',    
      CartNumber:value
    }))*/
    this.setState({
      visibleLoader:true
    })
    let SCallBack = function(response){
              if(response.data.result[0]){
                var ExpireDate = response.data.result[0].ExpireDate,    
                    TodayDate = response.data.extra ? response.data.extra.TodayDate : null;

                if(ExpireDate >= TodayDate)       
                {        
                  
                  var distance = new Date(response.data.result[0].HarajDate_Latin+" 23:59:59") - new Date();

                  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                  that.setState({  
                    hours:hours,
                    minutes:minutes,
                    MaxObj:response.data.result
                  })
                   var x = setInterval(function() {
                         distance = new Date(response.data.result[0].HarajDate_Latin+" 23:59:59") - new Date();
                         hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                         minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                      

                        that.setState({     
                            hours:hours,
                            minutes:minutes    
                        })
                      
                        if (distance < 0) {
                          clearInterval(x);
                        }
                      }, 60000);                    
                }
              }    
              that.getPics()
          
    } 
    let ECallBack = function(error){ 

      that.setState({   
        visibleLoader:false
      })  
      that.getOffData(); 
    }  
        
   this.Server.send("https://marketapi.sarvapps.ir/MainApi/getProducts",{limit:0},SCallBack,ECallBack) 

  }
  
 getProducts(limit,type){
    let that = this;
    
    let SCallBack = function(response){
        if(type=="special")
        {

          that.setState({
            Products4:response.data.result
          })
          that.getProducts(1000);
                           
        }
        if(limit==1000){

          that.setState({          
            films:response.data.result    
          })
          //that.getCats();            
        }   
    } 
    let ECallBack = function(error){  
      that.setState({
        visibleLoader:false
      })    
      //that.getCats();                   
    } 
  if(limit==4)                              
     type="special"       
  this.Server.send("https://marketapi.sarvapps.ir/MainApi/getProducts",{type:type,limit:limit},SCallBack,ECallBack) 
                  

 }  
 getOffData(){     
  let that = this; 
  let SCallBack = function(response){
     that.setState({
        OffData:response.data.result.reverse()
     })
     that.GetBestShop();
       
        
  } 
  let ECallBack = function(error){
    that.setState({
      visibleLoader:false
    }) 
    that.GetBestShop();
  } 
  this.Server.send("https://marketapi.sarvapps.ir/MainApi/getProducts",{type:"bestOff",limit:10},SCallBack,ECallBack)
 }
 
 getPics(l,type){
  let that = this;
   let SCallBack = function(response){
    response.data.result.map(function(item,index){
      if(item.name=="file1"){
        that.setState({
          logo1 : 'https://marketapi.sarvapps.ir/' +item.fileUploaded.split("public")[1],
          link1:item.link,
          text1:item.text
        })

      }
      
     if(item.name=="file2")
       that.setState({
         logo2 : 'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1],
         link2:item.link,
         text2:item.text
       })
     if(item.name=="file3")
       that.setState({
         logo3 : 'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1],
         link3:item.link,
         text3:item.text
       })
     if(item.name=="file4")
       that.setState({
         logo4 : 'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1],
         link4:item.link,
         text4:item.text
       })
     if(item.name=="file5")
       that.setState({
         logo5 : 'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1],
         link5:item.link,
         text5:item.text
       })
     if(item.name=="file6")
       that.setState({
         logo6 : 'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1],
         link6:item.link,
         text6:item.text
       })
     if(item.name=="file7")
       that.setState({
         logo7 : 'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1],
         link7:item.link,
         text7:item.text
       })
     if(item.name=="file8")
       that.setState({
         logo8 : 'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1],
         link8:item.link,
         text8:item.text
       }) 
     if(item.name=="file9")
       that.setState({
         logo9 : 'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1],
         link9:item.link,
         text9:item.text
       })
    })
    that.getCats(); 
    
    
         
   } 
   let ECallBack = function(error){      
    that.setState({
      visibleLoader:false
    }) 
    that.getCats(); 

   } 
   this.Server.send("https://marketapi.sarvapps.ir/MainApi/getPics",{},SCallBack,ECallBack)
  

 }
 GetBestShop(){

  let that = this;   
  let SCallBack = function(response){
     that.setState({
        BestShops:response.data.result
     })
     that.getProducts(1000,"special");

     
       
        
  } 
  let ECallBack = function(error){
    that.setState({
      visibleLoader:false
    })
    that.getProducts(1000,"special");

  } 
  this.Server.send("https://marketapi.sarvapps.ir/MainApi/getShops",{ type: "best"},SCallBack,ECallBack)
 

}
getCats(){
  let that = this;
  let SCallBack = function(response){
     that.setState({
         Cat:response.data.result,
         visibleLoader:false

     })   
     that.getSubCat(response.data.result[0],1)   
       
        
  } 
  let ECallBack = function(error){      
   that.setState({
     visibleLoader:false
   }) 
  } 
  this.Server.send("https://marketapi.sarvapps.ir/MainApi/GetCategory",{condition:{Parent:{ "$in": [ null, "" ] }}},SCallBack,ECallBack)
   
    

}
 getSubCat(param,lastIndex){   
  let that = this; 
 
  if(lastIndex==1)
    that.setState({     
      visibleLoader:true     
    }) 
  that.Server.send("https://marketapi.sarvapps.ir/MainApi/GetCategory",{CatId:param._id,getSubCat:1},function(response){
        let res = {
          name : param.name,                 
          id:    param._id,
          pic:   param.pic,
          data : response.data.result    
        }     
       
        switch(lastIndex){ 
          case 1 :{
            that.setState({     
              CatData1: res      
            })   

            break;
          }
          case 2 :{
            that.setState({     
              CatData2: res
            })
            break;
          }
          case 3 :{
            that.setState({     
              CatData3: res
            })
            break;
          }
          case 4 :{
            that.setState({     
              CatData4: res
            })
            break;      
          }
        }
             
        if(that.state.Cat[lastIndex])
          that.getSubCat(that.state.Cat[lastIndex],lastIndex+1);
        else{
          that.getOffData(); 
          that.setState({     
            visibleLoader:false
          })   
        }
                     
    
      } ,function(error){
        that.setState({
          visibleLoader:false
        })
      })
  }
  render() { 
    const {navigate} = this.props.navigation;    
     

    return (  
    <Container>               
      {/*this.props.CartNumber != null && this.props.CartNumber != 0 &&  
        <TouchableOpacity onPress={() => navigate('Cart')} style={{position:'absolute',bottom:0,zIndex:3,backgroundColor:'#ba6dc7',padding:10,width:'100%'}} >
          <View style={{flex:1,flexDirection:'row',justifyContent:'space-evenly'}} >
                      
              <View>
            <Text style={{textAlign:'center',fontFamily:'IRANYekanMobileBold',color:'#fff'}}>
            مشاهده سبد خرید ({this.ConvertNumToFarsi(this.props.CartNumber)}) 
            </Text>
            </View>   
            <View>
            <Icon name='cart'  style={{color:'#fff',fontSize:25}} />
              </View>  
          </View> 
         </TouchableOpacity>           
      */}   
      <Drawer
        side="right"
        ref={(ref) => { this.drawer = ref; }}
        content={<SideBar navigator={this.navigator} navigation={this.props.navigation} />}
        onClose={() => this.closeDrawer()} >
         <HeaderBox navigation={this.props.navigation}  />
         
        
         
         
        <Content >
        <Swiper style={{height:170,marginTop:10}} showsButtons={false} showsPagination={true} autoplay={true}>
        
        {this.state.logo1 &&
        <View style={styles.slide}>
          <Image source={{uri:this.state.logo1}}  resizeMode="stretch"  style={styles.imageSlide}   />
        </View>
        }
        {this.state.logo2 &&
        <View style={styles.slide}>
          <Image source={{uri:this.state.logo2}} resizeMode="stretch"  style={styles.imageSlide}    />
        </View>
        }
        {this.state.logo3 &&
        <View style={styles.slide}>
          <Image source={{uri:this.state.logo3}} resizeMode="stretch"   style={styles.imageSlide}   />
        </View>
        }      
       
       
      </Swiper>       



      {this.state.CatData1 &&
          <View>   
            <View style={{padding:5,width:'100%',marginBottom:20,marginTop:20,flex:1, flexDirection: 'row'}}>
                
             <View style={{flexGrow: 1}}>
                <TouchableWithoutFeedback onPress={() => navigate('Cat', {id: this.state.CatData1.id,name:this.state.CatData1.name,banner:[this.state.logo4,this.state.logo5]})}>
                  <Text style={{textAlign:'right',fontFamily:'IRANYekanMobileLight',color:'gray',fontSize:13}}> 
                    بیشتر...
                  </Text>
                </TouchableWithoutFeedback>
             </View>
             <View style={{flexGrow: 9}}><Text style={{textAlign:'right',fontFamily:'IRANYekanMobileBold',fontSize:17,marginRight:8}}>
                {this.state.CatData1.name}
             </Text></View>     
          </View>
              
          <InvertibleScrollView  horizontal  inverted style={{marginRight:5,marginLeft:5}} showsHorizontalScrollIndicator={false}  >
          <View style={{flex:1,flexDirection:'row',marginBottom:20}} >   
           {this.state.CatData1.data.map((v, i) => { 
             return ( 
             
             <TouchableWithoutFeedback style={{}} key={v._id} onPress={() => navigate('Cat', {id: v._id,name:v.name,banner:[this.state.logo4,this.state.logo5]})} >
             <View style={{backgroundColor:'#fff',borderRadius:5,marginRight:4,height:120,borderRightWidth:1,borderRightColor:'#eee'}}>
               {v.pic &&
               <Image resizeMode="stretch" source={{uri:'https://marketapi.sarvapps.ir/' + v.pic.split("public")[1]}} style={{height: 120, width: 200}}/>   
               }
                
             </View>
             </TouchableWithoutFeedback>
             )
           })
          }
          </View>

          </InvertibleScrollView>
          </View>
        }

        {this.state.CatData2 &&
          <View>   
            <View style={{padding:5,width:'100%',marginBottom:20,marginTop:20,flex:1, flexDirection: 'row'}}>
                
             <View style={{flexGrow: 1}}>
                <TouchableWithoutFeedback onPress={() => navigate('Cat', {id: this.state.CatData2.id,name:this.state.CatData2.name,banner:[this.state.logo4,this.state.logo5]})}>
                  <Text style={{textAlign:'right',fontFamily:'IRANYekanMobileLight',color:'gray',fontSize:13}}> 
                    بیشتر...
                  </Text>
                </TouchableWithoutFeedback>
             </View>
             <View style={{flexGrow: 9}}><Text style={{textAlign:'right',fontFamily:'IRANYekanMobileBold',fontSize:17,marginRight:15}}>
                {this.state.CatData2.name}
             </Text></View>     
          </View>
              
          <InvertibleScrollView  horizontal  inverted style={{marginRight:5,marginLeft:5}} showsHorizontalScrollIndicator={false} >
          <View style={{flex:1,flexDirection:'row',marginBottom:20}} >   
           {this.state.CatData2.data.map((v, i) => { 
             return ( 
             
             <TouchableWithoutFeedback style={{}} key={v._id} onPress={() => navigate('Cat', {id: v._id,banner:[this.state.logo4,this.state.logo5],name:v.name})} >
             <View style={{backgroundColor:'#fff',borderRadius:5,marginRight:4,height:120,borderRightWidth:1,borderRightColor:'#eee'}}>
               {v.pic &&
               <Image resizeMode="stretch" source={{uri:'https://marketapi.sarvapps.ir/' + v.pic.split("public")[1]}} style={{height: 120, width: 200}}/>      
              }
                     
             </View>
             </TouchableWithoutFeedback>
             )
           })
          }
          </View>

          </InvertibleScrollView>
          </View>
        }
    {this.state.CatData2 && this.state.CatData2.length > 0 && 
        <View style={{flex:1,flexDirection:'row',height:150,justifyContent:'center',width:'100%',alignContent:'space-between'}}>
        <View style={{flexBasis:'90%'}} >
        <Image source={{uri:this.state.logo4}}    style={styles.imageFixed}   />

        </View>


        </View>       
    }
         


        <View style={{height:40,display:'none'}}>
         <View style={{flex:1,justifyContent:'space-between',alignContent:'center',flexDirection:'row',height:1,backgroundColor:'rgba(0,0,0,0.6)'}}>
           <View>
           <Button transparent onPress={this.openDrawer} >
              <Icon name='menu' style={{color:"yellow"}} />
            </Button>
           </View>
           {this.state.CatData1 ?
            <View style={{marginTop:10}}>
             <View >
             <TouchableWithoutFeedback onPress={() => navigate('Cat', {id: this.state.CatData1.id,name:this.state.CatData1.name,banner:[this.state.logo4,this.state.logo5]})}>
                <Text style={{textAlign:'right',fontFamily:'IRANYekanMobileLight',color:'#fff',fontSize:12,paddingRight:5}}>
                  {this.state.CatData1.name}
                </Text>
              </TouchableWithoutFeedback>   
              </View> 
                 
            </View>
            :
            <View style={{marginTop:10}}>
             <View >
             <TouchableWithoutFeedback onPress={() => Linking.openURL("https://aniashop.ir/#/admin/Seller")}>
                <Text style={{textAlign:'center',fontFamily:'IRANYekanMobileLight',color:'#fff',fontSize:11,paddingRight:10}}>
                  محصولات خود را در آنیاشاپ بفروشید
                </Text>
              </TouchableWithoutFeedback>      
              </View> 
                 
            </View>
           }
           {this.state.CatData2 &&
            <View style={{marginTop:10}}>
             <View >
             <TouchableWithoutFeedback onPress={() => navigate('Cat', {id: this.state.CatData2.id,name:this.state.CatData2.name,banner:[this.state.logo4,this.state.logo5]})}>
                <Text style={{textAlign:'right',fontFamily:'IRANYekanMobileLight',color:'#fff',fontSize:12,paddingRight:5}}>
                  {this.state.CatData2.name}
                </Text>
              </TouchableWithoutFeedback>
              </View> 
                 
            </View>
           }
           {this.state.CatData3 &&
            <View style={{marginTop:10}}>
             <View >
             <TouchableWithoutFeedback onPress={() => navigate('Cat', {id: this.state.CatData3.id,name:this.state.CatData3.name,banner:[this.state.logo4,this.state.logo5]})}>
                <Text style={{textAlign:'right',fontFamily:'IRANYekanMobileLight',color:'#fff',fontSize:12,paddingRight:5}}>
                  {this.state.CatData3.name}
                </Text>
              </TouchableWithoutFeedback>
              </View> 
                     
            </View>
           }
           
         </View>
         </View>

        <ScrollView style={{marginTop:0}}>         
        
      {this.state.OffData.length > 0 &&
        <View style={{backgroundColor:'#6bb927',marginTop:5,marginBottom:5,paddingBottom:50}} >

          <View style={{marginTop:0}} >
            <View style={{padding:5,width:'100%',marginBottom:8,marginTop:8,flex:1, flexDirection: 'row'}}>
             
             <View style={{flexGrow: 9}}><Text style={{textAlign:'right',fontFamily:'IRANYekanMobileBold',fontSize:17,marginRight:15,color:'#fff'}}>
                محصولات با بیشترین تخفیف
             </Text></View> 
          </View>
              
          <InvertibleScrollView  horizontal  inverted showsHorizontalScrollIndicator={false}  >
          <View style={{marginBottom:5}}>
          {this.state.OffData && this.state.OffData.length >0 &&
          <View style={{flex:1,flexDirection:'row'}} >        
           {this.state.OffData.map((v, i) => { 
             return ( 
                <TouchableWithoutFeedback  key={v._id} onPress={() => navigate('Products', {id: ((v.product_detail && v.product_detail.length>0) ? v.product_detail[0]._id : v._id)})} >
                <View style={{backgroundColor:'#fff',padding:15,borderRadius:5,marginRight:4,height:300,borderRightWidth:1,borderRightColor:'#eee'}}>
                  {v.fileUploaded ? 
                  <View>
                 
                  <Image source={{uri:'https://marketapi.sarvapps.ir/' + v.fileUploaded.split("public")[1]}} style={{height: 150, width: 130}}/>   
                  
                  </View>
                  :      
                  <View>
                 
                  <Image source={{uri:'https://marketapi.sarvapps.ir/nophoto.png'}} style={{height: 150, width: 130}}/>   
                      
                  </View>
                  }
                  <View style={{flexWrap:'nowrap'}}>
                    <Text style={{textAlign:'center',fontFamily:'IRANYekanMobileLight',fontSize:13,paddingBottom:5,paddingTop:10,color:'#333',width:130,height:55,lineHeight:20,overflow:'hidden'}} >{this.ConvertNumToFarsi(v.title)}</Text>
                    
                    {v.number > 0 ?
                    <View>
                      <Text style={{textAlign:'center',fontFamily:'IRANYekanMobileLight',fontSize:14,color:'#333',width:130,textDecorationLine:'line-through'}}>{this.ConvertNumToFarsi(v.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</Text>
                      <Text numberOfLines = { 1 } ellipsizeMode = 'head' style={{textAlign:'center',fontFamily:'IRANYekanMobileBold',fontSize:16,color:'#000',width:130}}>{this.ConvertNumToFarsi(parseInt((v.price - ((v.price * v.off)/100))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</Text>
                    </View>
                    :
                    <View>
                      <Text style={{textAlign:'center',fontFamily:'IRANYekanMobileBold',fontSize:14,color:'red',width:130}}>ناموجود</Text>
                    </View>
                    } 
                    
                  </View>
                  <View style={styles.off}>   
                    <Text style={{color: '#fff',fontFamily:'IRANYekanMobileBold'}}>
                    {this.ConvertNumToFarsi(v.off)}%  
                    </Text>
                  </View>  
                </View>
                </TouchableWithoutFeedback> 
             )
           })
          }
          </View>  
          }  

          </View>
          </InvertibleScrollView>       
          </View>
          <View style={styles.CatBadge}>   
                    <Text style={{color: '#fff',fontFamily:'IRANYekanMobileBold'}}>
                    مشاهده همه
                    </Text>
           </View> 
          </View>                  
        }  
        {this.state.OffData && this.state.OffData.length > 0 &&
        <View>
          <View style={{flex:1,flexDirection:'row',height:115,justifyContent:'center',width:'100%',alignContent:'space-between'}}>
          <View style={{flexBasis:'45%'}} >
          <Image source={{uri:this.state.logo7}}  resizeMode="stretch"  style={styles.imageFixed}   />

          </View>
          <View style={{flexBasis:'3%'}} >

          </View>
          <View style={{flexBasis:'45%'}} >
          <Image source={{uri:this.state.logo8}}  resizeMode="contain"  style={styles.imageFixed}   />
          </View>
        
        </View>  
        <View style={{flex:1,flexDirection:'row',height:115,marginTop:10,justifyContent:'center',display:'none'}}>
          <View style={{flexBasis:'45%'}} >
          <Image source={{uri:this.state.logo8}}    style={styles.imageFixed}   />

          </View>
          <View style={{flexBasis:'3%'}} >

          </View>
          <View style={{flexBasis:'45%'}} >
          <Image source={{uri:this.state.logo9}}   style={styles.imageFixed}   />
          </View>
          </View> 
        </View>
        
      }         
          
      {this.state.BestShops && this.state.BestShops.length > 0 &&
          <View style={{backgroundColor:'#fff',marginBottom:10,marginTop:10}}>
            <View style={{padding:5,width:'100%',marginBottom:20,flex:1, flexDirection: 'row'}}>
                
             <View style={{flexGrow: 1}}>
                
             </View>
             
             <View style={{flexGrow: 9}}><Text style={{textAlign:'right',fontFamily:'IRANYekanMobileBold',fontSize:17,marginRight:15}}>
             محبوبترین فروشگاهها
             </Text></View>   
          </View>
          <InvertibleScrollView  horizontal  inverted style={{marginRight:5,marginLeft:5}} showsHorizontalScrollIndicator={false} >
          <View style={{flex:1,flexDirection:'row',marginBottom:20}} >   
          {this.state.BestShops.map((v, i) => { 
             return ( 
             
             <TouchableWithoutFeedback style={{}} key={v._id} onPress={() => navigate('Cat', {id: v._id,banner:[this.state.logo4,this.state.logo5]})} >
             <View style={{backgroundColor:'#fff',borderRadius:5,marginRight:4,height:120,borderRightWidth:1,borderRightColor:'#eee'}}>
                  <Image  resizeMode="stretch"  source={{uri:'https://marketapi.sarvapps.ir/' + v.logo.split("public")[1]}} style={{height: 90, width: 90}} />   
                     
             </View>
             </TouchableWithoutFeedback>
             )
           })
          }
          </View>
            
       
      
       
       
      </InvertibleScrollView>    
        
          </View>
        }  
           
         
         
        {this.state.CatData3 &&   
          <View>   
            <View style={{padding:5,width:'100%',marginBottom:20,marginTop:20,flex:1, flexDirection: 'row'}}>
                
             <View style={{flexGrow: 1}}>
                <TouchableWithoutFeedback onPress={() => navigate('Cat', {id: this.state.CatData3.id,name:this.state.CatData1.name,banner:[this.state.logo4,this.state.logo5]})}>
                  <Text style={{textAlign:'right',fontFamily:'IRANYekanMobileLight',color:'gray',fontSize:13}}> 
                    بیشتر...
                  </Text>
                </TouchableWithoutFeedback>
             </View>
             <View style={{flexGrow: 9}}><Text style={{textAlign:'right',fontFamily:'IRANYekanMobileBold',fontSize:17,marginRight:15}}>
                {this.state.CatData3.name}
             </Text></View>     
          </View>
                     
          <InvertibleScrollView  horizontal  inverted  style={{marginRight:5,marginLeft:5}} showsHorizontalScrollIndicator={false} >
          <View style={{flex:1,flexDirection:'row',marginBottom:20}} >   
           {this.state.CatData3.data.map((v, i) => { 
             return ( 
             
             <TouchableWithoutFeedback style={{}} key={v._id} onPress={() => navigate('Cat', {id: v._id,banner:[this.state.logo4,this.state.logo5],name:v.name})} >
             <View style={{backgroundColor:'#fff',borderRadius:5,marginRight:4,height:120,borderRightWidth:1,borderRightColor:'#eee'}}>
               {v.pic &&
               <Image resizeMode="stretch" source={{uri:'https://marketapi.sarvapps.ir/' + v.pic.split("public")[1]}} style={{height: 120, width: 200}}/>   
              }
               
             </View>
             </TouchableWithoutFeedback>
             )
           })
          }
          </View>

          </InvertibleScrollView>
          </View>
        }

{this.state.CatData4 &&
          <View>   
            <View style={{padding:5,width:'100%',marginBottom:20,marginTop:20,flex:1, flexDirection: 'row'}}>
                
             <View style={{flexGrow: 1}}>
                <TouchableWithoutFeedback onPress={() => navigate('Cat', {id: this.state.CatData4.id,name:this.state.CatData4.name,banner:[this.state.logo4,this.state.logo5],name:this.state.CatData1.name})}>
                  <Text style={{textAlign:'right',fontFamily:'IRANYekanMobileLight',color:'gray',fontSize:13}}> 
                    بیشتر...
                  </Text>
                </TouchableWithoutFeedback>
             </View>
             <View style={{flexGrow: 9}}><Text style={{textAlign:'right',fontFamily:'IRANYekanMobileBold',fontSize:17,marginRight:15}}>
                {this.state.CatData4.name}
             </Text></View> 
                
          </View>
              
          <InvertibleScrollView  horizontal  inverted  style={{marginRight:5,marginLeft:5}} showsHorizontalScrollIndicator={false} >
          <View style={{flex:1,flexDirection:'row',marginBottom:20}} >   
           {this.state.CatData4.data.map((v, i) => { 
             return ( 
             
             <TouchableWithoutFeedback style={{}} key={v._id} onPress={() => navigate('Cat', {id: v._id,banner:[this.state.logo4,this.state.logo5],name:v.name})} >
             <View style={{backgroundColor:'#fff',borderRadius:5,marginRight:4,height:120,borderRightWidth:1,borderRightColor:'#eee'}}>
               {v.pic &&
               <Image resizeMode="stretch" source={{uri:'https://marketapi.sarvapps.ir/' + v.pic.split("public")[1]}} style={{height: 120, width: 200}}/>   
              }
               
              
             </View>
             </TouchableWithoutFeedback>
             )
           })
          }
          </View>

          </InvertibleScrollView>
          </View>
        }
        {this.state.OffData && this.state.OffData.length > 0 &&
         <View style={{flex:1,flexDirection:'row',height:150,justifyContent:'center',alignItems:'center',width:'100%',alignContent:'space-between',marginBottom:20}}>
          <View style={{flexBasis:'90%'}} >
          <Image source={{uri:this.state.logo5}}    style={styles.imageFixed}   />

          </View>
          
        
        </View>
        } 
         
        

       </ScrollView>
          </Content></Drawer>    
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

const styles = StyleSheet.create({
  wrapper: {
    height:400
  },
  
  Text: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily:'IRANYekanMobileLight'
  },
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop: 25,
    textAlign:'right',
    direction:'rtl'
  },
  autocompleteContainer: {
    marginLeft: 10,
    marginRight: 10,
    textAlign:'right',
    direction:'rtl'
  },
  itemText: {
    fontSize: 15,
    margin: 2,
    fontFamily:'IRANYekanMobileLight',
    textAlign:'right'
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: '#F5FCFF',
    marginTop: 8,
    direction:'rtl'
  },
  infoText: {
    textAlign: 'center'
  },
  off:{
    backgroundColor: '#fb3449',
    borderRadius: 20,
    padding: 4,
    letterSpacing: 0,
    marginBottom: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    lineHeight: 1.375,
    marginRight: 8,
    minWidth: 43,
    height: 30,
    position:'absolute',
    top:5,
    paddingRight:6,
    paddingLeft:6,
    paddingTop:6,
    paddingBottom:8,
    marginTop:3,
    marginLeft:3
  },
  CatBadge:{
    backgroundColor: '#1ea71c',          
    borderRadius: 20,
    padding: 8,
    letterSpacing: 0,
    marginBottom: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    lineHeight: 1.375,
    marginRight: 8,
    minWidth: 43,
    height: 30,
    position:'absolute',
    bottom:5,
    paddingRight:6,
    paddingLeft:6,
    paddingTop:6,
    paddingBottom:8,
    marginTop:3,                  
    marginLeft:3,
    right:0
  },
  image:{
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow:'hidden'
  },
  imageSlide:{
    width:'90%',
    flex: 1,/*
    borderTopEndRadius:10,
    borderTopStartRadius:10,
    borderTopRightRadius:10,   
    borderTopLeftRadius:10,
    borderBottomEndRadius:10,
    borderBottomStartRadius:10,
    borderBottomRightRadius:10,
    borderBottomLeftRadius:10,
    borderRadius:10*/
  },
  imageFixed:{
    
    width:'100%',
    flex: 1/*,
    borderTopEndRadius:10,
    borderTopStartRadius:10,
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    borderBottomEndRadius:10,
    borderBottomStartRadius:10,
    borderBottomRightRadius:10,
    borderBottomLeftRadius:10,
    borderRadius:10*/
  }
});
function mapStateToProps(state) {        
  return {
    CartNumber : state.CartNumber
  }
}
export default connect(mapStateToProps)(Home)  

