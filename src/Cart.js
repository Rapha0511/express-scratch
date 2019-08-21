

const cart = {} ; //will contain all our data

let subscription = []

export const getValue = key => cart[key]

export const publish = (key,value)=>{ //  recods the value  so getValue will grab the value from the same place
    cart[key] = value;    

    //call subscriber
    subscription.filter(sub=>sub.key === key)   //
                .forEach(subscription=>subscription.callback(value));
};


export const subscribe = (key,callback)=>{ // callback call a function
   const id = Math.random()

    subscription.push({   //push a new object with 3 value
        key,
        callback,
    });

    return ()=>{
        subscription = subscription.filter(subscription=> subscription.id !== id) // keep the subscription where is not equal to subscription.id
    }
};

