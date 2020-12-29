import React from 'react';
import { StyleSheet ,View,TouchableOpacity,Text,Image } from 'react-native'; 
import { connect } from "react-redux"
import Server from './Server.js'
import { Container, Content, Input ,Item,Button } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons'
import Autocomplete from 'react-native-autocomplete-input';

import {AsyncStorage} from 'react-native';
import HeaderBox from './HeaderBox.js'
class Search extends React.Component {   
  constructor(props){   
    super(props);    
    this.Server = new Server();
    this.state = {    
        GridData:[],
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
        films:[],
        query: ''
    }

    
   

  }  
  componentDidMount() { 
      
        this.getProducts();
  }
  getProducts(limit,type){
    let that = this;
   
    let SCallBack = function(response){
        
          that.setState({          
            films:response.data.result    
          })
    } 
    let ECallBack = function(error){  
                         
    } 
         
  this.Server.send("https://marketapi.sarvapps.ir/MainApi/getProducts",{type:null,limit:1000},SCallBack,ECallBack) 
                  

 } 
  
  ConvertNumToFarsi(text){
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return text.toString().replace(/[0-9]/g, function(w){
     return id[+w]
    });
  }
  componentWillUnmount() {
 
       
  }
  findFilm(query) {  
    if (query === '') {
      return [];
    }
    const { films } = this.state;
    const regex = new RegExp(`${query.trim()}`, 'i');
    return films.filter(film => film.title.search(regex) >= 0);
}
getProducts(limit,type){
    let that = this;
   
    let SCallBack = function(response){
        
          that.setState({          
            films:response.data.result    
          })
          
    } 
    let ECallBack = function(error){  
                        
    } 
       
  this.Server.send("https://marketapi.sarvapps.ir/MainApi/getProducts",{type:type,limit:1000},SCallBack,ECallBack) 
                  

 }   
  render() {                
    const { query } = this.state;    
    const films = this.findFilm(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();  
    const {navigate} = this.props.navigation;    
                              
    return (   
    <Container >   
        <Content>
         
          <Item>
          <Button style={{alignSelf:'baseline',top:10,marginLeft:10,marginRight:10,width:50}} transparent onPress={() => {try {this.props.navigation.state.params.onGoBack()}catch(e){}; this.props.navigation.goBack()}}>
              <Icon name='md-arrow-round-back'  style={Platform.OS==='android' ? {paddingTop:6,color:'#333',fontSize:30} : {color:'#333'}} />
          </Button>
          <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          style={{textAlign:'right',height:40,fontFamily:'IRANYekanMobileLight',fontSize:13,padding:5}}
          inputContainerStyle={{borderColor:'#fff'}}
          containerStyle={{zIndex:4,padding:15,backgroundColor:'#fff'}}
          listStyle={{padding:15,backgroundColor:'#fff',borderColor:'#fff',margin:5,borderBottomWidth:1}}
          data={films.length === 1 && comp(query, films[0].title) ? [] : films}
          defaultValue={query}
          onChangeText={text => this.setState({ query: text })}   
          placeholder="بخشی از عنوان محصول را وارد کنید"   
          renderItem={(p) => (
            <TouchableOpacity onPress={() => navigate('Products', {id: ((p.item.product_detail && p.item.product_detail.length>0) ? p.item.product_detail[0]._id : v._id)})} style={{width:'100%',flex:1,flexDirection:'row-reverse',justifyContent:'flex-start',alignItems: 'center',marginBottom:10}}  >
              <View style={{width:80}} >
              <Image source={{uri:'https://marketapi.sarvapps.ir/' + p.item.fileUploaded.split("public")[1]}} style={{height: 80, width: 70}}/> 
              </View>
              <View style={{marginRight:5,flex:1}} >
                <Text style={{textAlign:'right',fontFamily:'IRANYekanMobileLight',fontSize:14}}>         
                  { p.item.title}
                </Text>
                <Text style={{textAlign:'right',fontFamily:'IRANYekanMobileLight',color:'gray',fontSize:12}}> 
                { p.item.subTitle}
                </Text>
                <Text style={{textAlign:'right',fontFamily:'IRANYekanMobileLight',color:'gray',fontSize:12,display:'none'}}> 
              
                {this.ConvertNumToFarsi((p.item.price - ((p.item.price * p.item.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان
              </Text>
              </View>                    
              
            </TouchableOpacity>
          )}
        />
          </Item>
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
export default connect(mapStateToProps)(Search)  





















