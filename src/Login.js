import React from 'react';


class Login extends React.Component{

    state = {
        email:'',
        password: '',
        showWaitingGif: false,
    }

    setEmail = (e) => this.setState({email : e.target.value})
    setPassword = (e) => this.setState({password : e.target.value})

    login = () => {
        this.setState({showWaitingGif:true});

        fetch('/login',{
            method:'POST',
            headers:{'Content-Type' : 'application/json'},
            body:JSON.stringify({
                email:this.state.email,
                password: this.state.password,
                
            })

        }).then(response => response.json())
          .then(({token})=>{    // value of the token if we succed else it is gonna be undefined
              setTimeout(()=>{
                  this.setState({showWaitingGif: false})
                  this.props.onLogin(token) // call the function setToken( if succeed the state change if not undefined )
              },2000)
          })  
    }


    render(){
        return(
            <div className = {'Login '+(this.state.showWaitingGif ? 'waiting':'')}>
                <img src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG3KS1E_BbJA5tjDFxMs7VZoj6LWRRBR1xyFZ6AxeaiG8SZWcO'/>
                <label>
                    <span>Email </span>
                <input value = {this.state.Email} onChange={this.setEmail}/>
                </label>

                <label>
                    <span>Password </span>
                <input value = {this.state.password} onChange={this.setPassword} type ='password'/>
                </label>

                <button onClick={this.login}>LOGIN</button>

            </div>
        );
    }
}


export default Login;