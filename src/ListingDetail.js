import React from 'react';

class ListingDetail extends React.Component {

  state = {
    listing: null,
  }

  componentDidMount(){
    fetch('/listing/'+this.props.match.params.id)
      .then(response=> response.json())
      .then(listing=> this.setState({ listing }))
  }

  render(){
    return (
      <div className='ListingDetail'>
        {JSON.stringify(this.state.listing)}
      </div>
    );
  }
}

export default ListingDetail;
