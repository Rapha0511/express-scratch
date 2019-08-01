import React from 'react';


class Listings extends React.Component{


    


    render(){
        return(
            <div className ='Listings'>
                
                <ul>
           {this.props.listings.map(listing=>(
             <li className='listing' key={listing.id}>
             <img src = {listing.images[0]}/>
             <div> 
              <span className='date'>{(new Date(listing.createdAt)).toString().slice(4,10).replace(' 0','')}</span>
               <a href ='#'>{listing.title}</a>
               <div className='price'>
                 <span>${listing.price}</span>
                 </div>
                 </div>
             </li>
           ))}
      </ul>

            </div>
        );
    }
}

export default Listings;


