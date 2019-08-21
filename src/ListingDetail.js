import React from 'react';
import './listingDetail.css';
import {publish, getValue} from './Cart'
class ListingDetail extends React.Component {

  state = {
    listing: null,
    selectedImages:0,
  }

  componentDidMount(){
    fetch('/listing/'+this.props.match.params.id)
      .then(response=> response.json())
      .then(listing=> this.setState({ listing }))
  }

  addToCart = ()=>{
    const currentCartItems = getValue('items') || [];  // we are reading the current item 

    publish('items',[...currentCartItems,{   //adding a new item to the array ( we have to compute the entire new item array with the new item and the new one)
      id:this.state.listing.id,
      title:this.state.listing.title,
      price: this.state.listing.price,
    }]);

  }

  selectImage = index => this.setState({selectedImages : index})

  selectNext = () => {
    this.setState({
      selectedImages: (this.state.selectedImages + 1)%[this.state.listing.images.length]
    })
  }

  selectPrev=()=>{
    this.setState({
      selectedImages: (this.state.selectedImages - 1 + this.state.listing.images.length) % this.state.listing.images.length
    })
  }

  render(){
    const {listing} = this.state;
    if(!listing)  return (<div/>)
    return (
      <div className='ListingDetail'>
        <div style={{ backgroundImage :`url(${listing.images[this.state.selectedImages]})`}} className='detail-image'>
        <div className="arrow-left" onClick={this.selectPrev}>‹</div>
        <div className="arrow-right" onClick={this.selectNext}>›</div>
        </div>
  
        <div className='thumbnail-container'>
        {
          listing.images.map((images,i)=>(
            <div key={i} style={{ backgroundImage:`url(${images})` }}
                 onMouseEnter={()=>this.selectImage(i)} 
                 className = {'thumbnail ' +(this.state.selectedImages === i ? 'selected' : '')}
                 onClick={()=>this.selectImage(i)}/>
                  
          ))

        }
        </div>
        <h2>{listing.title}</h2>
        <h5>{listing.price}</h5>
        <p>{listing.description}</p>
        <span>{listing.images.length} images available</span>

        <button onClick={this.addToCart}>add to cart</button>
      </div>
    );
  }
}

export default ListingDetail;
