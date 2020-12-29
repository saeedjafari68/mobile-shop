import React from 'react';
import { StyleSheet ,FlatList,TouchableOpacity,Dimensions  } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import { Container, View, Text,Content } from 'native-base';

import {AsyncStorage} from 'react-native';
import HeaderBox from './HeaderBox.js'
const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;
class Cat extends React.Component {   
  constructor(props){   
    super(props);    
    this.Server = new Server();
    this.state = {    
        id:(this.props.route && this.props.route.params ) && this.props.route.params.id,   
        logo4:(this.props.route && this.props.route.params && this.props.route.params.banner ) && this.props.route.params.banner[0], 
        logo5:(this.props.route && this.props.route.params && this.props.route.params.banner ) && this.props.route.params.banner[1], 
        Haraj:(this.props.route && this.props.route.params ) && this.props.route.params.Haraj,
        HarajProducts:[], 
        CatData:[],
        GridData:[],
        Warning:0,
        GridDataFirstId:"",
        LastGridDataFirstId:"-",
        PageCount:0,
        CurentPage:0,
        GridDataPerPage:[],
        limit:6,
        skip:0,
        ServerBusy:false,
        inLoad:true,
        visibleLoader:false,
        callNew:0
    }
    
   

  }  
  componentDidUpdate(){  

    if(this.props.route.params && this.props.route.params && this.props.route.params.id && this.state.callNew){

      this.setState({
        callNew:0,
        id:this.props.route.params.id,
        CatData:[]
      })
      this.getSubCat(this.props.route.params.id);
    }
    if(this.props.route.params && this.props.route.params && this.props.route.params.p=="LoginTrue"){
      this.props.route.params.p="a";
      this.setState({
        LoginTrue:true
      })

    }  
  }
  componentDidMount() { 
     if(!this.state.Haraj){
      this.getSubCat();

     }
     else
        this.GetHarajProducts()    
        
  }
  GetHarajProducts(){
    let that = this;
   
    let SCallBack = function(response){
      
      var resp = response.data.result[0];
      if(response.data.result[0]){
        var HarajDate = response.data.result[0].HarajDate,
            TodayDate = response.data.TodayDate;

        if(HarajDate==TodayDate)    
        { 

          var distance = new Date(response.data.result[0].HarajDate_Latin+" 23:59:59") - new Date();
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          that.setState({  
            hours:hours,
            minutes:minutes,
            HarajProducts:response.data.result,
            visibleLoader:false
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
    } 
    let ECallBack = function(error){
     alert(error)   
    }  
    let param={
        id : null,
        token: this.state.api_token
        };    
   this.Server.send("https://marketapi.sarvapps.ir/MainApi/getProducts",param,SCallBack,ECallBack) 
  }
  getSubCat(id){
    let that = this; 

      that.setState({     
        visibleLoader:true     
      }) 
    that.Server.send("https://marketapi.sarvapps.ir/MainApi/GetCategory",{CatId:id||that.state.id,getSubCat:1,inMobile:1},function(response){
              that.setState({     
                visibleLoader:false
              })  

              if(response.data.result.length==0){
                that.getProducts();
                return;
              }
              that.setState({     
                CatData: response.data.result,
                Warning:1    
              })   
  
                          
      
        } ,function(error){
          that.setState({
            visibleLoader:false
          })
        })
    }
  getProducts(){
    let that = this;
    if(this.state.ServerBusy)
      return;   
    if(this.state.LastGridDataFirstId==this.state.GridDataFirstId) 
        return;
    this.setState({
       ServerBusy:true,
       visibleLoader:true
    })     
    setTimeout(() => {
      let SCallBack = function(response){ 

        that.setState({
          ServerBusy:false,
          visibleLoader:false
        })   
        if(response.data.result.length=="0"){
          that.setState({
            Warning:2
          })  
          return
         
        }
        that.setState({
          GridDataFirstId:((response.data.result[0] && response.data.result[0].product_detail && response.data.result[0].product_detail.length>0) ? response.data.result[0].product_detail[0]._id : response.data.result[0]._id),
          LastGridDataFirstId:that.state.GridData[0] ? (((that.state.GridData[0].product_detail && that.state.GridData[0].product_detail.length>0) ? that.state.GridData[0].product_detail[0]._id : that.state.GridData[0]._id)) : "-",
          GridData:response.data.result,
          PageCount:response.data.result.length, 
          Warning:1     
        })   
       
      
      }
      let ECallBack = function(error){  
       that.setState({
        ServerBusy:false,
        visibleLoader:false
       }) 
       alert(error)   
      }  
      
     this.Server.send("https://marketapi.sarvapps.ir/MainApi/GetProductsPerCat",{
              id : this.state.id,
              limit:this.state.limit,
              skip:this.state.skip,   
              token:  AsyncStorage.getItem('api_token').then((value) => {    
                  return value
  
              })
          },SCallBack,ECallBack)
    },1500)
    
  }
  
  ConvertNumToFarsi(text){
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return text.toString().replace(/[0-9]/g, function(w){
     return id[+w]
    });
  }
  componentWillUnmount() {
 
       
  }
  _handleLoadMore = () => {
    if(this.state.inLoad){
      this.setState({
        inLoad:false
      })
      return;

    }
    this.setState({
      limit:this.state.limit+5/*,
      skip:this.state.skip+1  */
    },this.getProducts())
    
  };  
  _handleLoadMoreCat = () => {
    if(this.state.inLoad){
      this.setState({
        inLoad:false
      })
      return;

    }
    this.setState({
      limit:this.state.limit+5/*,
      skip:this.state.skip+1  */
    },this.getSubCat())
    
  }; 

    
  _renderItem = ({item}) => (
    <TouchableOpacity style={{borderBottomColor:'#eee',borderBottomWidth:1,padding:15}} onPress={() => this.props.navigation.navigate('Products', {id: ((item.product_detail && item.product_detail.length>0) ? item.product_detail[0]._id : item._id)})}>
        <View style={{marginBottom:15}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'space-evenly'}}>
                <View style={{flexBasis:250}}>
                    <Text  style={{fontFamily:'IRANYekanMobileBold',textAlign:'center',fontSize:18,color:'gray'}}> {item.title} </Text>
                    {item.subTitle != '-' &&
                      <Text  style={{fontFamily:'IRANYekanMobileLight',textAlign:'center',marginTop:15,fontSize:12,color:'gray'}}> {item.subTitle} </Text>
                    }
                    {item.off != '0' &&
                        <Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'center',marginTop:15,fontSize:14,color:'#752f2f',textDecorationLine:'line-through'}}>{this.ConvertNumToFarsi(item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</Text>

                      }
                    <Text style={{fontFamily:'IRANYekanMobileBold',textAlign:'center',marginTop:15,fontSize:16,color:'#752f2f'}}> {this.ConvertNumToFarsi((item.price - ((item.price * item.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان </Text>
               </View>
                <View   >
                <Image source={{uri:'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1]}} style={{height: 80, width: 80}}/>

                </View>
                </View>
                </View>
      </TouchableOpacity>
  );
  _renderItemCat = ({item}) => (
    <TouchableOpacity style={{borderBottomColor:'#eee',borderBottomWidth:1,padding:15}} onPress={() =>{this.setState({callNew:1}); this.props.navigation.navigate('Cat', {id: item._id})}} >
       <View style={{flex:1,flexDirection:'row',justifyContent:'space-evenly'}}>
                <View style={{flexBasis:280}}>
                    {item.pic &&
                      <Image resizeMode="contain" source={{uri:'https://marketapi.sarvapps.ir/' + item.pic.split("public")[1]}} style={{height: 120,width:280}}/>   
                      }
               </View>
                </View>
      </TouchableOpacity>
  );
  _renderItemHaraj = ({item}) => (
    <TouchableOpacity style={{borderBottomColor:'#eee',borderBottomWidth:1,padding:15}} onPress={() => this.props.navigation.navigate('Products', {id: ((item.product_detail && item.product_detail.length>0) ? item.product_detail[0]._id : item._id)})}>
        <View style={{marginBottom:15}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'space-evenly'}}>
                <View style={{flexBasis:250}}>
                    <Text  style={{fontFamily:'IRANYekanMobileLight',textAlign:'center',fontSize:18,color:'gray'}}> {item.title} </Text>
                    {item.subTitle != '-' &&
                      <Text  style={{fontFamily:'IRANYekanMobileLight',textAlign:'center',marginTop:15,fontSize:12,color:'gray'}}> {item.subTitle} </Text>
                    }
                    {item.off != '0' &&
                        <Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'center',marginTop:15,fontSize:14,color:'#752f2f',textDecorationLine:'line-through'}}>{this.ConvertNumToFarsi(item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</Text>

                      }
                    <Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'center',marginTop:15,fontSize:16,color:'#752f2f'}}> {this.ConvertNumToFarsi((item.price - ((item.price * item.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان </Text>
               </View>
                <View   >
                <Image source={{uri:'https://marketapi.sarvapps.ir/' + item.fileUploaded.split("public")[1]}} style={{height: 80, width: 80}}/>

                </View>
                </View>
                </View>
                <View>
                  <View style={{paddingTop:10,paddingBottom:10,backgroundColor:'#eee',marginTop:10}}>
                  <Text style={{color:'#000',fontFamily:'IRANYekanMobileLight',textAlign:'center',fontSize:18}}>  {this.ConvertNumToFarsi(this.state.hours)} ساعت {this.ConvertNumToFarsi(this.state.minutes)} دقیقه </Text>
                            
                </View> 
              </View> 
      </TouchableOpacity>
  );
  render() {
    
                                 
    return (   
    <Container >
      <Content>

            <HeaderBox navigation={this.props.navigation} title={(this.props.route && this.props.route.params ) && this.props.route.params.name} goBack={true} />
            {this.state.Warning ==1 &&
            <View style={{marginTop:10,marginBottom:10,flex:1,flexDirection:'row',height:150,justifyContent:'center',width:'100%',alignContent:'space-between'}}>
              <View style={{flexBasis:'90%'}} >
              <Image source={{uri:this.state.logo4}}    style={{flex:1,width:'100%'}}    />

              </View>
              
            
            </View>  
            }
            {this.state.Warning==2 &&
            <View style={{flex:1,justifyContent:"center",textAlign:'center',alignItems:'center',marginTop:50}}>
              <Text style={{fontFamily:'IRANYekanMobileBold',fontSize:20}}>آیتمی جهت نمایش وجود ندارد</Text>
            </View>
            }
            {!this.state.Haraj && this.state.CatData.length > 0 && this.state.Warning !=2 &&
            <View>
               <View style={{backgroundColor:'red',flex:0.1,justifyContent:'center',flexDirection:'row-reverse',height:40,marginTop:50,display:'none'}}>
                <TouchableOpacity style={styles.Selected}>
                  <View>
                    <Text style={{fontFamily:'IRANYekanMobileLight'}}>همه</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.NotSelected}>
                  <View>
                    <Text style={{fontFamily:'IRANYekanMobileLight'}}>جدیدترین</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.NotSelected}>
                  <View>
                    <Text style={{fontFamily:'IRANYekanMobileLight'}}>پرفروش ترین</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.NotSelected}>
                  <View>
                    <Text style={{fontFamily:'IRANYekanMobileLight'}}>ارزانترین</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <FlatList
                    data={this.state.CatData}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}  
                    onEndReachedThreshold ={0.5}
                    renderItem={this._renderItemCat}    
                    onEndReached={this._handleLoadMoreCat}
              />
              </View>
              }
           {!this.state.Haraj && this.state.GridData.length > 0 &&
            <View>
               <View style={{backgroundColor:'red',flex:0.1,justifyContent:'center',flexDirection:'row-reverse',height:40,marginTop:50,display:'none'}}>
                <TouchableOpacity style={styles.Selected}>
                  <View>
                    <Text style={{fontFamily:'IRANYekanMobileLight'}}>همه</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.NotSelected}>
                  <View>
                    <Text style={{fontFamily:'IRANYekanMobileLight'}}>جدیدترین</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.NotSelected}>
                  <View>
                    <Text style={{fontFamily:'IRANYekanMobileLight'}}>پرفروش ترین</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.NotSelected}>
                  <View>
                    <Text style={{fontFamily:'IRANYekanMobileLight'}}>ارزانترین</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <FlatList
                    data={this.state.GridData}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}  
                    onEndReachedThreshold ={0.5}
                    renderItem={this._renderItem}    
                    onEndReached={this._handleLoadMore}
                    
              />
              </View>
              }

      {this.state.HarajProducts &&
        <FlatList
        data={this.state.HarajProducts}
        extraData={this.state}
        keyExtractor={this._keyExtractor}  
        onEndReachedThreshold ={0.5}
        renderItem={this._renderItemHaraj}    
        onEndReached={this._handleLoadMore}
        
  />
      }
         {this.state.visibleLoader &&
              <View style={{position:'relative',bottom:0,left:'50%'}}>
                <Image style={{width:50,height:50,justifyContent: 'center',
                    alignItems: 'center'}}
                    source={require('../assets/loading.gif')}
                />
              </View>
              
              }
             {this.state.Warning==5 &&

              <View style={{marginTop:10,marginBottom:10,flex:1,flexDirection:'row',height:150,justifyContent:'center',width:'100%',alignContent:'space-between'}}>
              <View style={{flexBasis:'90%'}} >
              <Image source={{uri:this.state.logo5}}    style={{flex:1,width:'100%'}}   />

              </View>
              
            
            </View> 
  }  
              
              
          

            </Content>



          
     </Container>             
    
           
    );
  }
}


const styles = StyleSheet.create({
  Selected: {
    backgroundColor:'red',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily:'IRANYekanMobileLight',
    padding:5
  },
  NotSelected: {
    backgroundColor:'#eee',
    color: '#333',
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily:'IRANYekanMobileLight',
    padding:5
  }
  
});
function mapStateToProps(state) {        
  return {
    CartNumber : state.CartNumber
  }
}
export default connect(mapStateToProps)(Cat)  





















