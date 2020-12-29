    
const initialState = {
    CartNumber: 0,
    isAuth:0
}

function reducer(state = initialState , action){

   
    switch(action.type){    
       case "LoginTrueUser":{
           //localStorage.setItem("CartNumber",action.CartNumber);
           return {
                CartNumber:action.CartNumber,
                isAuth:1
           } 
           break;        
       }
       default:{
           return initialState;
       }
   }
}
export default reducer;