import React, { Component } from 'react';
import axios from 'axios'

export default class Server extends React.Component {
  constructor(props){

    super(props);
    this.state={
      username:null
    }  
   
  }
  
  send(url,params,SuccessCallBack,ErrorCallBack){
    axios.post(url, params)
    .then(function (response) {
      SuccessCallBack(response); 
    })
    .catch(function (error) {
      ErrorCallBack(error);
    });
   /* fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Content-Type': 'application/json',
      }
    }) 
    .then((response) => response.json())
    .then((response) => {
          alert(1)      
          SuccessCallBack(response.d);        
      
    })
    .catch((error) => {
      ErrorCallBack(error);
    });*/
 
 }

}


