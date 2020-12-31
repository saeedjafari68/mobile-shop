import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { connect } from "react-redux"
import Server from './Server.js'
import { Image } from 'react-native';
import { Container, Content, View, Button, Toast, Text, Icon, Input, Form, Label, Textarea } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AsyncStorage } from 'react-native';
import HeaderBox from './HeaderBox.js'
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Swiper from 'react-native-swiper'
const { width } = Dimensions.get('window')
import { Rating, AirbnbRating } from 'react-native-ratings';

const styles = StyleSheet.create({
  wrapper: {
    height: 260,
    marginTop: 40
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      Products: [],
      Comments: [],
      id: (this.props.route && this.props.route.params) && this.props.route.params.id,
      img1: null,
      img2: null,
      img3: null,
      img4: null,
      img5: null,
      originalImage: null,
      Count: "1",
      price: null,
      off: null,
      rating: 0,
      ratingTemp: 0,
      api_token: null,
      Seller: [],
      visibleLoader: false,
      TypeComment: false,
      ShowComments:1

    }
    this.changeImage = this.changeImage.bind(this)
    this.SetComment = this.SetComment.bind(this)
    this.changeRating = this.changeRating.bind(this)



  }
  componentDidMount() {
    // alert(this.props.navigation.state.params.id)
    let that = this;
    this.setState({
      visibleLoader: true
    }) 
    AsyncStorage.getItem('api_token').then((value) => this.setState({
      api_token: value
    }))
    this.Server.send("https://marketapi.sarvapps.ir/MainApi/checktoken", {
      token: this.state.api_token
    }, function (response) {
      that.setState({
        userId: response.data.authData.userId
      })
      if (!that.state.Haraj)
        that.getProduct();
      else
        that.GetHarajProducts()

    }, function (error) {
      if (!that.state.Haraj)
        that.getProduct();
      else
        that.GetHarajProducts()
    })

  }
  SetComment() {
    let that = this;
    if (!this.state.CommentText) {
      Toast.show({
        text: "متن نظر خود را بنویسید",
        textStyle: { fontFamily: 'IRANYekanMobileBold', textAlign: 'center', fontSize: 13 },
        type: "light"
      })
      return;
    }
    this.setState({
      visibleLoader: true
    })
    this.Server.send("https://marketapi.sarvapps.ir/MainApi/checktoken", {
      token: this.state.api_token
    }, function (response) {
      let SCallBack = function (resp) {
        that.setState({
          visibleLoader: false
        })
        Toast.show({
          text: "نظر شما ثبت شد و پس از تایید نمایش می یابد",
          textStyle: { fontFamily: 'IRANYekanMobileBold', textAlign: 'center', fontSize: 13 },
          type: "light"
        })
      }
      let ECallBack = function (error) {
        that.setState({
          visibleLoader: false
        })
        Toast.show({
          text: "نظر شما ثبت نشد لطفا مجددا تلاش کنید",
          textStyle: { fontFamily: 'IRANYekanMobileBold', textAlign: 'center', fontSize: 13 },
          type: "light"
        })
      }
      let param = {
        CommentText: that.state.CommentText,
        SellerId: that.state.Seller[0] ? that.state.Seller[0].UserId : null,
        ProductId: that.state.id,
        UserId: response.data.authData.userId,
        set: 1
      };
      that.Server.send("https://marketapi.sarvapps.ir/MainApi/setOrUpdateComment", param, SCallBack, ECallBack)

    }, function (error) {
      that.setState({
        visibleLoader: false
      })
      Toast.show({
        text: "برای ارسال نظر باید در سامانه وارد شوید",
        textStyle: { fontFamily: 'IRANYekanMobileBold', textAlign: 'center', fontSize: 13 },
        type: "light"
      })
    })


  }
  ChangeCount(p) {
    if (p == -1 && this.state.Count <= 1)
      return;
    this.setState({
      Count: parseInt(this.state.Count) + p + ""
    })
  }
  changeImage(p) {
    let img = null;
    if (p == "1")
      img = this.state.img1;
    if (p == "2")
      img = this.state.img2;
    if (p == "3")
      img = this.state.img3;
    if (p == "4")
      img = this.state.img4;
    if (p == "5")
      img = this.state.img5;
    this.setState({
      originalImage: img
    })

  }
  SendToCart() {
    let that = this;
    this.Server.send("https://marketapi.sarvapps.ir/MainApi/checktoken", {
      token: this.state.api_token
    }, function (response) {
      let SCallBack = function (response) {
        that.props.navigation.navigate('Cart', { p: 'a' })
      }
      let ECallBack = function (error) {
        alert(error)
      }
      console.warn(response.data.authData.userId)
      let param = {
        PId: that.state.PID,
        PDId: that.state.id,
        Number: that.state.Count,
        UId: response.data.authData.userId,
        Price: that.state.Products[0].price - ((that.state.Products[0].price * that.state.Products[0].off) / 100),
        Status: "0",
        Type: "insert", 
        token: that.state.api_token
      }
      that.Server.send("https://marketapi.sarvapps.ir/MainApi/ManageCart", param, SCallBack, ECallBack)

    }, function (error) {
      Toast.show({
        text: "جهت اضافه کردن محصول در سبد خرید در سامانه وارد شوید",
        textStyle: { fontFamily: 'IRANYekanMobileBold', textAlign: 'center', fontSize: 14 },
        type: "light"
      })
    })


  }
  ConvertNumToFarsi(text) {
    var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return text.replace(/[0-9]/g, function (w) {
      return id[+w]
    });
  }
  ConvertNumToLatin(text) {
    return text;
    return text.replace(/[\u0660-\u0669]/g, function (c) {
      return c.charCodeAt(0) - 0x0660;
    }).replace(/[\u06f0-\u06f9]/g, function (c) {
      return c.charCodeAt(0) - 0x06f0;
    });
  }
  getComments() {
    let that = this;

    let SCallBack = function (response) {
      that.setState({
        Comments: response.data.result/*,
        ShowComments:response.data.result.length>0 ? 1 : 0*/           
      })
    }
    let ECallBack = function (error) {
      alert(error)
    }

    this.Server.send("https://marketapi.sarvapps.ir/MainApi/getComment", { ProductId: this.state.id, limit: 5 }, SCallBack, ECallBack)
  }
  getProduct() {
    let that = this;

    let SCallBack = function (response) {
      var resp = response.data.result[0];
      console.warn(resp.product_id);
      that.setState({
        Products: response.data.result,
        PID: resp.product_id,
        Seller: response.data.Seller || [],
        rating: response.data.extra.raiting[0] ? response.data.extra.raiting[0].point : 0,
        img1: resp.fileUploaded1 != "" ? resp.fileUploaded1.split("public")[1] : null,
        img2: resp.fileUploaded2 != "" ? resp.fileUploaded2.split("public")[1] : null,
        img3: resp.fileUploaded3 != "" ? resp.fileUploaded3.split("public")[1] : null,
        img4: resp.fileUploaded4 != "" ? resp.fileUploaded4.split("public")[1] : null,
        originalImage: resp.fileUploaded != "" ? resp.fileUploaded.split("public")[1] : null,
        visibleLoader: false
      })
      that.getComments();
      //   alert(that.state.Products.length)      
    }
    let ECallBack = function (error) {
      alert(error)   
    }
    let param = {
      id: this.state.id,
      token: this.state.api_token
    };
    console.warn(param)   

    this.Server.send("https://marketapi.sarvapps.ir/MainApi/getProducts", param, SCallBack, ECallBack)
  }
  changeRating(value) {
    let that = this;
    console.warn(value)
    that.setState({
      rating: value
    })
    let SCallBack = function (response) {

    }
    let ECallBack = function (error) {
    }
    let param = {
      userId: that.state.userId,
      productId: that.state.id,
      rating: value
    };
    that.Server.send("https://marketapi.sarvapps.ir/MainApi/SetPoint", param, SCallBack, ECallBack)


  }
  ConvertNumToFarsi(text) {
    if (!text)
      return text;
    var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return text.toString().replace(/[0-9]/g, function (w) {
      return id[+w]
    });
  }
  render() {
    const { navigate } = this.props.navigation;


    return (
      <Container >
        {/*this.props.CartNumber != null && this.props.CartNumber != 0 &&
          <TouchableOpacity onPress={() => navigate('Cart')} style={{ position: 'absolute', bottom: 0, zIndex: 3, backgroundColor: '#ba6dc7', padding: 10, width: '100%' }} >
            <View >
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }} >

                <View>
                  <Text style={{ textAlign: 'center', fontFamily: 'IRANYekanMobileBold', color: '#fff' }}>
                    مشاهده سبد خرید ({this.ConvertNumToFarsi(this.props.CartNumber)})
                    </Text>
                </View>
                <View>
                  <Icon name='cart' style={{ color: '#fff', fontSize: 25 }} />
                </View>
              </View>

            </View>
          </TouchableOpacity>
        */}
        <HeaderBox navigation={this.props.navigation} title={'محصولات'} goBack={true} />

        <Content style={{ marginBottom: 20 }}>

          <ScrollView>
            {this.state.Products.length > 0 &&
              <View >
                <View >  
                  <Swiper style={styles.wrapper} showsButtons={false} showsPagination={true}>
                    <View style={styles.slide1}>
                      <Image resizeMode="stretch" source={{ uri: 'https://marketapi.sarvapps.ir/' + this.state.originalImage }} style={styles.image} />
                    </View>
                    {this.state.img4 &&
                      <View style={styles.slide1}>
                        <Image resizeMode="stretch" source={{ uri: 'https://marketapi.sarvapps.ir/' + this.state.img4 }} style={styles.image} />
                      </View>
                    }
                    {this.state.img3 &&
                      <View style={styles.slide1}>
                        <Image resizeMode="stretch" source={{ uri: 'https://marketapi.sarvapps.ir/' + this.state.img3 }} style={styles.image} />
                      </View>
                    }
                    {this.state.img2 &&
                      <View style={styles.slide1}>
                        <Image resizeMode="stretch" source={{ uri: 'https://marketapi.sarvapps.ir/' + this.state.img2 }} style={styles.image} />
                      </View>
                    }
                    {this.state.img1 &&
                      <View style={styles.slide1}>
                        <Image resizeMode="stretch" source={{ uri: 'https://marketapi.sarvapps.ir/' + this.state.img1 }} style={styles.image} />
                      </View>
                    }


                  </Swiper>
                  <Grid>
                    <Row>
                      <Col >
                        <View >
                          <Text style={{ fontFamily: 'IRANYekanMobileBold', textAlign: 'right', paddingRight: 20, fontSize: 17, marginTop: 20 }}>{this.state.Products[0].title}</Text>
                          <Text style={{ fontFamily: 'IRANYekanMobileLight', textAlign: 'right', paddingRight: 20, color: '#333', fontSize: 13 }}>{this.state.Products[0].subTitle}</Text>

                        </View>

                        {this.state.Seller.length > 0 &&
                          <View style={{ padding: 5, marginBottom: 20, marginTop: 20 }} >
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} >
                              <View>
                                <Text style={{ fontFamily: 'IRANYekanMobileLight', textAlign: 'center', paddingRight: 10, marginTop: 20, color: '#007ad9', fontSize: 13 }}> فروشنده  : {this.state.Seller[0].name} </Text>

                              </View>
                              {this.state.Seller[0].logo &&
                                <View>
                                  <Image resizeMode="stretch" source={{ uri: 'https://marketapi.sarvapps.ir/' + this.state.Seller[0].logo.split("public")[1] }} style={{ height: 60, width: 60 }} />
                                </View>
                              }

                            </View>

                          </View>
                        }


                        {this.state.Products[0].desc != "-" &&
                          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginTop: 15, marginBottom: 15 }}>
                            <View style={{ width: '100%' }}>
                              <Text style={{ fontFamily: 'IRANYekanMobileBold', textAlign: 'right', paddingRight: 10, paddingTop: 5, color: 'gray', fontSize: 14, borderBottomColor: '#eee', borderBottomWidth: 2 }}>توضیحات محصول</Text>
                            </View>
                            <View style={{ width: '100%' }}>
                               <Text style={{ fontFamily: 'IRANYekanMobileLight', textAlign: 'right', lineHeight: 25, padding: 10, fontSize: 15 }}>{this.state.Products[0].desc}</Text>

                            </View>
                          </View>
                        }
                        {this.state.Products[0].Spec &&  this.state.Products[0].Spec.length > 0 &&
                          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginTop: 15, marginBottom: 15 }}>
                            <View style={{ width: '100%' }}>
                              <Text style={{ fontFamily: 'IRANYekanMobileBold', textAlign: 'right', paddingRight: 10, paddingTop: 5, color: 'gray', fontSize: 14, borderBottomColor: '#eee', borderBottomWidth: 2 }}>مشخصات فنی</Text>
                            </View>
                            <View style={{ width: '100%' }}>
                                {this.state.Products[0].Spec.map((v,i) => {
                                      if(v.value != "-")
                                        return (   <View className="iranyekanwebmedium" style={{display:'flex',flexDirection:'row'}}><View style={{width:"50%",background:"#f9f9f9",padding:5}}><Text style={{ fontFamily: 'IRANYekanMobileBold', textAlign: 'right',fontSize:13}}>{v.value}</Text></View><View style={{width:"50%",background:"#f9f9f9",padding:5}}><Text  style={{ fontFamily: 'IRANYekanMobileBold', textAlign: 'right',fontSize:13}}>{v.title}</Text></View></View> )
                                 })
                                }
                            </View>
                          </View>
                        }
                      </Col>

                    </Row>
                  </Grid>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>

                  <View>   
                    <Rating
                      ratingCount={5}
                      startingValue={this.state.rating}
                      imageSize={20}
                      readonly={this.state.UserId ? false : true}
                      onFinishRating={this.changeRating}
                    />
                  </View>      
                  <View>
                    {this.state.Products[0].number > 0 &&
                      <View style={{ flex: 1, flexDirection: 'row', maxWidth: 150, borderRadius: 5, height: 50, borderWidth: 2, borderColor: '#eee' }}>
                        <View style={{ width: '25%' }}>
                          <TouchableOpacity onPress={() => this.ChangeCount(-1)}><Text style={{ paddingTop: 8, textAlign: 'center' }} ><Ionicons name='ios-arrow-dropdown' style={{ fontSize: 30, color: 'red' }} /></Text></TouchableOpacity>
                        </View>
                        <View style={{ width: '50%', alignSelf: 'center' }}>
                          <Text style={{ textAlign: 'center', fontSize: 30, fontFamily: 'IRANYekanMobileLight' }}  >{this.ConvertNumToFarsi(this.state.Count)} </Text>
                        </View>

                        <View style={{ width: '25%' }}>
                          <TouchableOpacity onPress={() => this.ChangeCount(1)}><Text style={{ paddingTop: 8, textAlign: 'center' }} ><Ionicons name='ios-arrow-dropup' style={{ fontSize: 30, color: 'green' }} /></Text></TouchableOpacity>
                        </View>
                      </View>         

                    }
                  </View>
                </View>
                <View style={{ marginBottom: this.state.ShowComments ?5:50,marginTop:10,borderTopWidth:1,borderTopColor:'#eee',borderBottomColor:'#eee',borderBottomWidth:1 }}>
                  <TouchableOpacity onPress={() => this.setState({ShowComments:!this.state.ShowComments})} style={{ flex: 1, flexDirection: 'row-reverse',alignItems:'center' }}>
                    <Ionicons name='md-chatbubbles' style={{ fontSize: 30, marginRight: 20,color:'#9e9898' }} />
                    <Text style={{  textAlign: 'center', marginRight: 10, fontFamily: 'IRANYekanMobileBold',color:'#9e9898' }} >نظرات کاربران </Text>
                  </TouchableOpacity>

                </View>
                {this.state.ShowComments ?
                  <View>
                    {this.state.Comments.length > 0 ?
                      <View>
                        <View style={{ padding: 5, width: '100%', marginBottom: 10, marginTop: 15, flex: 1, flexDirection: 'row' }}>

                          <View style={{ flexGrow: 1 }}>
                            <TouchableOpacity onPress={() => navigate('Comments', { ProductId: this.state.id, ShopName: this.state.Seller[0] ? this.state.Seller[0].name : "", ProductName: this.state.Products[0].title })}>
                              <Text style={{ textAlign: 'right', fontFamily: 'IRANYekanMobileBold', color: 'gray', fontSize: 13 }}>
                                بیشتر...
                         </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={{ flexGrow: 9 }}><Text style={{ textAlign: 'right', fontFamily: 'IRANYekanMobileBold', fontSize: 13 }}>
                            نظرات کاربران
                        </Text></View>
                        </View>
                        <InvertibleScrollView horizontal inverted   >

                          <Grid style={{ marginBottom: 20, height: 200 }}>

                            <Row>
                              {this.state.Comments.map((v, i) => {
                                return (
                                  <Col key={v._id} style={{ borderWidth: 1, borderColor: '#e0dcdc', width: 200, padding: 5, margin: 5, borderRadius: 5 }}>
                                    <View style={{ width: '100%' }}>

                                      <View style={{ flexWrap: 'nowrap', width: '100%', borderBottomColor: '#eee', borderBottomWidth: 1 }}>
                                        <Text style={{ textAlign: 'right', fontFamily: 'IRANYekanMobileLight', fontSize: 12, padding: 10, paddingTop: 0, color: '#b9b7b7' }} >-</Text>

                                      </View>
                                      <View style={{ flexWrap: 'nowrap', width: '100%', height: 120 }}>
                                        <Text style={{ textAlign: 'right', fontFamily: 'IRANYekanMobileLight', fontSize: 13, padding: 10, color: '#696868' }} >{v.CommentText}</Text>

                                      </View>
                                    </View>
                                    <View>
                                      <View style={{ flexWrap: 'nowrap', width: '100%' }}>
                                        <Text style={{ textAlign: 'left', fontFamily: 'IRANYekanMobileLight', fontSize: 12, padding: 10, color: '#ccc' }} >{v.date}</Text>

                                      </View>
                                    </View>
                                  </Col>
                                )
                              })
                              }
                            </Row>

                          </Grid>
                        </InvertibleScrollView>
                      </View>
                      :
                      <View>
                        <Text style={{fontFamily: 'IRANYekanMobileLight', fontSize: 15,textAlign:'center'}}>نظری برای این محصول ثبت نشده است !</Text>
                        </View>
                    }
                    <View style={{marginRight:10,marginLeft:10}} >
                      <Form>
                        <Textarea rowSpan={3} placeholder="نظر شما ..." style={{ borderRadius: 5, fontFamily: 'IRANYekanMobileLight', textAlign: 'right', fontSize: 13 }} bordered value={this.state.CommentText} name="CommentText" onChangeText={(text) => this.setState({ CommentText: text })} />
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20, marginTop: 10 }}>
                          <TouchableOpacity  onPress={this.SetComment} style={{marginBottom:30,paddingTop:3,paddingBottom:5,paddingRight:5,paddingLeft:5,borderRadius:5,backgroundColor:'#eee'}} >
                            <Text style={{ fontFamily: 'IRANYekanMobileLight', textAlign: 'right', fontSize: 13 }}>ثبت نظر</Text>
                          </TouchableOpacity>
                        </View>
                      </Form>
                    </View>
                  </View>
                  :
                  <View>

                  </View>
                }
              </View>
            }


          </ScrollView>

        </Content>
        {this.state.Products.length > 0 &&
          <View>
            <View style={{ flex: 1, flexDirection: 'row-reverse', width: '100%', justifyContent: 'space-around', backgroundColor: '#fff', position: 'absolute', bottom: 0, borderTopWidth: 1, padding: 8, borderColor: '#eee' }}>
              <View style={{ flexBasis: '50%' }}>
                {this.state.Products[0].number > 0 &&
                  <Button iconLeft style={{ backgroundColor: '#ff6600' }} onPress={() => this.SendToCart()}>
                    <Icon name='cart' />
                    <Text style={{ fontFamily: 'IRANYekanMobileBold', textAlign: 'center' }}>انتقال به سبد خرید</Text>
                  </Button>
                }
              </View>
              <View>


                {
                  this.state.Products[0].off != "0" && this.state.Products[0].number > 0 &&
                  <View style={{ display: 'none', flex: 1, flexDirection: 'row', justifyContent: 'center', position: 'relative', top: -48, right: 60 }}>
                    <View style={{ borderRadius: 30, backgroundColor: 'red', padding: 1 }}>
                      <Text style={{ padding: 5, fontFamily: 'IRANYekanMobileBold', textAlign: 'center', color: '#fff', fontSize: 15 }}>%{this.ConvertNumToFarsi(this.state.Products[0].off)} </Text>

                    </View>
                  </View>   
                }
                {this.state.Products[0].number > 0 ?
                  <View >
                    {this.state.Products[0].off != "0" &&
                      <Text style={{ fontFamily: 'IRANYekanMobileLight', textAlign: 'left', textDecorationLine: 'line-through', fontSize: 13 }}>{this.state.Products[0].off ? this.ConvertNumToFarsi(this.state.Products[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + "تومان" : ""} </Text>
                    }<Text style={{ fontFamily: 'IRANYekanMobileBold', textAlign: 'left', color: '#333', fontSize: 15 }}>{this.ConvertNumToFarsi(parseInt((this.state.Products[0].price - ((this.state.Products[0].price * this.state.Products[0].off) / 100))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</Text>
                  </View>
                  :
                  <View style={{ borderRadius: 5 }}>
                    <Text style={{ borderRadius: 5, backgroundColor: 'red', padding: 5, fontFamily: 'IRANYekanMobileBold', textAlign: 'center', paddingBottom: 5, paddingRight: 20, paddingLeft: 20, color: '#fff', fontSize: 20, marginTop: 20, marginBottom: 10 }}>ناموجود</Text>
                  </View>
                }
              </View>

            </View>
          </View>
        }
        {this.state.visibleLoader &&
          <View style={{ position: 'absolute', bottom: '50%', left: '50%' }}>
            <Image style={{
              width: 50, height: 50, justifyContent: 'center',
              alignItems: 'center'
            }}
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
    CartNumber: state.CartNumber
  }
}
export default connect(mapStateToProps)(Products)


