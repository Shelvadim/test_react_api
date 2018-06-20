import React, { Component } from 'react';
import './App.css';

import  {PowerSelect}  from 'react-power-select';
import 'react-power-select/dist/react-power-select.css';

import axios from 'axios';

const url = 'https://dev.presscentric.com/test/accounts/';

const Account = (props) =>{
  return(
      <div>
        <div>
         <h1> Account Info</h1>
         <p>Account ID: {props.id}</p>
         <p>First Name: {props.nameFirst}</p>
         <p>Last Name: {props.nameLast}</p>
         <p>Email: {props.email}</p>
         <p>Gender: {props.gender}</p>
         <p>IP Address: {props.ip}</p>
        </div>
        <button onClick={(e) => {props.deleteAccount(props.id)}}>Remove</button>
        
      </div>
    ); 
};

const Header=()=>{
  return(
    <header className="App-header">         
    <h1 className="App-title">Test React API</h1>
  </header>
  )
}

export default class App extends React.Component {

  constructor(props) {
  super(props)
  this.deleteAccount=this.deleteAccount.bind(this);
    this.state = {
      dataName:[],
      selectedOption:'',
      dataAccount:[],
      dataId:'',
      isHidden: true
    }
  }

  deleteAccount(id){
    //console.log(url+id);
    alert('Account ID: '+id+' was deleted!');
    axios.delete(url+id)
        .then(res => {
            console.log(res)
            console.log('Account was removed')
        })
        .catch(function (error) {
            console.log(error+'Can not remove account');
        });

        if(this.state.isHidden===false){
          this.toggleHidden();
        }

        this.getDataName();
  }

  toggleHidden () {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  getDataName(){    
    axios.get(url)
      .then(json => {
        //const dataN = json.data.map(a=>a.name);
        this.setState({ dataName:json.data });
      })
      .catch(error => alert(error + ' Can not connect to the server!'))
      console.log('List of Accounts was updated'); 
  }

  getDataAccount(id){
    var urla=url.concat(id);
    console.log(urla);
    axios.get(urla)
      .then(data => {
        //const dataN = json.data.map(a=>a.name);
        
        this.setState({ dataAccount:data.data });
        
      })
      .catch(error => alert(error + ' Can not connect to the server!'))
      
  }

  componentDidMount(){
    this.getDataName();
  }

  handleChange = ({ option }) => {
    

    if (option){

      this.setState({
        selectedOption: option      
      })  

      var obj=this.state.dataName.find(x => x.name === option);
      console.log(option);
      //var id=obj.map(b=>b.id);
      this.setState({      
        dataId:obj.id
      })   
  
       this.getDataAccount(obj.id);

      if(this.state.isHidden===true){
        this.toggleHidden();
      }
    } else if(option===null){
      this.setState({      
        dataAccount:[]
      }) 

      if(this.state.isHidden===false){
        this.toggleHidden();
      }
      
    }
    
    
  }

  render() {

    if (this.state.loading) {
      return <div>Loading...</div>
    }
    
     
    return (

      <div className="App">
       <Header />
        
        <PowerSelect
            options={this.state.dataName.map(a=>a.name)}            
            selected={this.state.selectedOption}
            onChange={this.handleChange}
            placeholder="Select an account"
          />
        
        {!this.state.isHidden && 
         <Account 
         
         id={this.state.dataAccount.id}
         nameFirst={this.state.dataAccount.nameFirst}
         nameLast={this.state.dataAccount.nameLast}
         email={this.state.dataAccount.email}
         gender={this.state.dataAccount.gender}
         ip={this.state.dataAccount.ip}
         deleteAccount={this.deleteAccount}
         />
        }

      </div>
    );
  }
  }
