import React from 'react';


class MakeListing extends React.Component{

    state ={
        title:'',
        description:'',
        price:0,
        images:[],
        shoWaitingGif:false,
      }

      setTitle = e =>this.setState({
          title: e.target.value
      })

      setDescription = e =>this.setState({
        description: e.target.value
    })

    setPrice = e =>this.setState({
        price: 1*e.target.value
    })

    addImage = ()=>{
        this.setState({
            images:[...this.state.images,""] // add the previous image and create a empty string at the end
        })
    }

    setDescription = e =>this.setState({
        description: e.target.value
    })

    setImage=(e,i)=>(
        this.setState({
            images:[
                ...this.state.images.slice(0,i), e.target.value,...this.state.images.slice(i+1)
            ]
        })
    )

    deleteImage=i=>{
        this.setState({
        images:[
            ...this.state.images.slice(0,i),...this.state.images.slice(i+1)
        ]
    })
    }

    submit = ()=>{
        this.setState({
            shoWaitingGif:true, // setting the gif true when we submit
        });
        fetch('/listing',{
            method :'POST',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({
                title:this.state.title,
                description:this.state.description,
                price:this.state.price,
                images:this.state.images,

            })
              }).then(response=>response.json())  // interprete the response , read it 
                .then(responseJson=>{
                  console.log(responseJson) 
                setTimeout(()=>this.setState({shoWaitingGif:false,
                title:'',
                description:'',
                price:0,
                imageUrl:[],
                },()=>this.props.triggerReload()),2000) //wait 2 second and put it to false (trigger reload is pass as a prop in app.js and we call it here)
        })
    }

    render(){
        return(
            <div className ={'MakeListing '+(this.state.shoWaitingGif ? 'waiting':'')}>
                <img src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG3KS1E_BbJA5tjDFxMs7VZoj6LWRRBR1xyFZ6AxeaiG8SZWcO' />

                <label>
                    <span>title</span>
                    <input value={this.state.title} onChange={this.setTitle} />
                </label>

                <label>
                <span>Description</span>
                    <textarea value={this.state.description} onChange = { this.setDescription}></textarea>
                </label>

                <label>
                <span>price</span>
                    <input value={this.state.price} onChange = {this.setPrice} type="number"/>
                </label>

                {
                    this.state.images.map((imageUrl,i)=>(
                        <label>
                        <span>Image URL:</span> 
                        <input value={this.state.images[i]} 
                                onChange={e=>this.setImage(e,i)}/>
                        <button onClick = {()=> this.deleteImage(i)}>X</button>
                        </label>
                    ))
                }

                <button onClick={this.addImage}>+</button>
                <button onClick = {this.submit}>Create Listing</button>

            </div>
        );
    }
}

export default MakeListing;