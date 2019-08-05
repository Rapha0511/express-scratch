import React from 'react';


class Listings extends React.Component{

    state={
        searchText:'',
        minPrice: 0,
        maxPrice:25000,
        priceSort:null, // by default we dont sort
    }

    setSearchText = (e) =>{
        this.setState({
            searchText: e.target.value,
        })
    }

    setmaxPrice = (e)=>{
        this.setState({
            maxPrice:e.target.value,
        })
    }

    setminPrice = (e) =>{
        this.setState({
            minPrice:e.target.value,
        })
    }

    setNextSort = ()=>{
        this.setState({
            priceSort: !this.state.priceSort ? 'up' : this.state.priceSort === 'up' ? 'dn' : null
        })
    }

    render(){
        return(
            <div className ='Listings'>
                <div class ='search'>
                <label>
                    <input value = {this.state.searchText} onChange={this.setSearchText} placeholder='look for a putain'/>
                </label>
                <label>
                    <input value = {this.state.minPrice} type='number' step ={100} onChange={this.setminPrice} placeholder='look for a putain'/>
                </label>

                <label>
                    <input value = {this.state.maxPrice} type='number' step ={100} onChange={this.setmaxPrice} placeholder='look for a putain'/>
                </label>

                <button onClick={this.setNextSort}>
                    {this.state.priceSort || 'sort'}
                </button>
                </div>
                <ul>

                    
           {this.props.listings
           .filter(listing=> (
               !this.state.searchText || listing.title.toLocaleLowerCase().includes(this.state.searchText.toLocaleLowerCase()) //if nothing in text keep everything or when we start tiping , it render the new state (the state is what u tipe)
           ))

           .filter(listing=>(
               (this.state.minPrice < listing.price)&& (this.state.maxPrice > listing.price)
           ))


           .sort(( a , b ) =>(this.state.priceSort === 'dn') ? (a.price > b.price ? 1 : -1) :
                             (this.state.priceSort === 'up') ? (a.price > b.price ? -1 : 1) : 0
                             )

           .map(listing=>(
             <li className='listing' key={listing.id}>
             <img src = {(listing.images && listing.images[0])|| "https://odis.homeaway.com/odis/listing/cfc4ee9c-216d-4b16-ade4-8e74333e52d9.c10.jpg"}/>
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


