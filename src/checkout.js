import React from 'react';
import './Checkout.css';

import {subscribe,getValue} from './Cart'

class Checkout extends React.Component{

   state={
        uniqueItems:[],        
    }

    componentDidMount(){
        this.unsubscribe = subscribe("items",this.onNewItems);
        this.onNewItems();

    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    onNewItems = () =>{
        const items = getValue('items')||[];
        
            const uniqueItems = {}; // unique items obj
            for(let i=0; i < (items.length);i++){    //
                   uniqueItems[items[i].id] = (uniqueItems[items[i].id]|| { // if exist set  it to himself (does nothing)
                       count:0,
                       ...items[i],
                   }) ;
                   uniqueItems[items[i].id].count += 1;
            }

            this.setState({
                items,
                uniqueItems:Object.keys(uniqueItems).sort().map(k=>uniqueItems[k])
            });
       }

       sendOrders = () =>{
           
          fetch('/order',{
              method : 'POST',
              headers:{'Content-Type':'application/json',
                Authorization: 'Bearer ' +this.props.token
                },
              body:JSON.stringify({
                  listings: this.state.items.map((item)=>(
                      item.id
                  ))

              })
          })
          console.log(this.props.token)

       }
    

    render(){
        return(
            <div className='Checkout'>
                <div className ='items-container'>
                    <div className='header-row'>
                        <div>title</div>
                        <div>quantity</div>
                        <div>price</div>
                        <div>total price</div>
                    </div>
                    <ul className='items'>
                        {
                            this.state.uniqueItems.map((item,i)=>(
                                <li key={i}>
                                    <div>{item.title}</div>
                                    <div>{item.count}</div>
                                    <div>{item.price}</div>
                                    <div>${item.price*item.count}</div>
                                </li>
                            ))
                        }

                    </ul>
                    <div className ='total-price'>
                        total price : ${
                            this.state.uniqueItems.reduce((total,item)=>total + item.price,0)
                        }
                    </div>
                    <div className = 'OrderButton'>
                    <button onClick={this.sendOrders}>Send your orders</button>
                    </div>
              </div>
            </div>
        );
    }
}


export default Checkout;