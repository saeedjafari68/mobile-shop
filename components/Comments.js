import React from 'react';
import { StyleSheet ,FlatList} from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import { Container, View, Text } from 'native-base';

import HeaderBox from './HeaderBox.js'
class Comments extends React.Component {   
  constructor(props){   
    super(props);    
    this.Server = new Server();
    this.state = {    
        ProductId:(this.props.route && this.props.route.params) && this.props.route.params.ProductId, 
        ProductName:(this.props.route && this.props.route.params) && this.props.route.params.ProductName, 
        ShopName:(this.props.route && this.props.route.params) && this.props.route.params.ShopName,   
        GridData:[],
        GridDataFirstId:"",
        LastGridDataFirstId:"-",
        PageCount:0,
        CurentPage:0,
        GridDataPerPage:[],
        limit:5,
        skip:0,
        ServerBusy:false,
        inLoad:true,
        visibleLoader:false
    }

    
   

  }  
  componentDidMount() { 
     
     this.getComments()
   
        
  }
  getComments(){
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
        console.warn(response)         
        that.setState({
          GridDataFirstId:response.data.result[0]._id,
          LastGridDataFirstId:that.state.GridData[0] ? that.state.GridData[0]._id : "-",
          GridData:response.data.result,
          PageCount:response.data.result.length,      
        })   
          that.setState({
            ServerBusy:false,
            visibleLoader:false
          })  
      
      }
      let ECallBack = function(error){  
       that.setState({
        ServerBusy:false,
        visibleLoader:false
       }) 
        
      }  
      
      this.Server.send("https://marketapi.sarvapps.ir/MainApi/getComment",{
              ProductId : this.state.ProductId,
              limit:this.state.limit,
              skip:this.state.skip
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
    },this.getComments())
    
  };  
  _renderItem = ({item}) => (
        <View style={{marginBottom:15,backgroundColor:'#eee'}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',padding:10}}>
                <View >
                    <Text  style={{fontFamily:'IRANYekanMobileLight',textAlign:'right',fontSize:14,color:'gray'}}> {item.date} </Text>
                    <Text  style={{fontFamily:'IRANYekanMobileLight',textAlign:'right',fontSize:18,color:'#333',marginTop:10}}> {item.CommentText} </Text>
              </View>
                
                </View>
                </View>
  );
  render() {
    
                                 
    return (   
    <Container >
            <HeaderBox navigation={this.props.navigation} title={"نظرات"} goBack={true} />
              <View style={{borderColor:'#ccc',borderWidth:1,margin:5,borderRadius:5}}>
              <View style={{marginTop:20}}>
                <Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'center',fontSize:20,color:'#333'}}>
                   {this.state.ProductName}
                </Text>
              </View>
              <View style={{marginTop:20,marginBottom:20}}>
                <Text style={{fontFamily:'IRANYekanMobileLight',textAlign:'center',fontSize:20,color:'gray'}}>
                  فروشنده : {this.state.ShopName}
                </Text>
              </View>
              </View>
              <FlatList
                    data={this.state.GridData}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}  
                    onEndReachedThreshold ={0.5}
                    renderItem={this._renderItem}    
                    onEndReached={this._handleLoadMore}
                    
              />
              {this.state.visibleLoader &&
              <View style={{position:'absolute',bottom:0,left:'50%'}}>
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
export default connect(mapStateToProps)(Comments)  





















