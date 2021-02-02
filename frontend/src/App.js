import { Component } from 'react';
import './App.css';
import axios from 'axios';
import PuffLoader from "react-spinners/PuffLoader";
import { ReactComponent as PizzaSvg } from './pizza-slice.svg';
import {Card,Modal} from './components'
const qs = require('query-string');


class App extends Component{
  constructor() {
    super();

    this.state = {
        modal:false,
        modalInput:"",
        modalHead:"",
        isLoading : true,
        lists : [],
        toDoCards :[],
        doingCards : [],
        board : {},
        newTaskName : "",
        selectedListId : ""
    }
  }

  componentDidMount() { 
    this.setState({isLoading : true})
    this.onMount();
  }
  
  onMount = async () => {
    this.setState({isLoading : true})
    await axios.get('http://localhost:3000')
    .then((res) => {
      if(res.data.success){
        var toDoCards = res.data.data.cards.filter(function(el){
          return(el.idList === res.data.data.lists[0].id)
        })
        var doingCards = res.data.data.cards.filter(function(el) {
          return(el.idList === res.data.data.lists[1].id)
        })

        console.log(toDoCards)

        this.setState({
          lists : res.data.data.lists,
          toDoCards : toDoCards,
          doingCards : doingCards,
          board : res.data.data.board,
        })
      } else {
        console.log("ERROR occured while fetching data")
      }
    })
    
    this.setState({isLoading : false});

  }

  modalOpen =(e,text, listId)=>{
    this.setState({
      modal: true,
      modalHead:text,
      selectedListId : listId
     });
  }

  modalClose=()=>{
    this.setState({
      modalInput: "",
      modal: false
    });
  }

  handleChange = (e) => {
    this.setState({
      newTaskName: e.target.value
    });
  }
  
  handleSubmit=(e)=>{
    e.preventDefault();
    var data = {
      boardId : this.state.board.id,
      listId : this.state.selectedListId,
      cardName : this.state.newTaskName
    }
    data = qs.stringify(data)
    axios.post('http://localhost:3000/newtask', data).then((res) => {
      this.onMount();
    })
    this.modalClose();
  }

  render() {
    var {
      isLoading,
      color,
      board,
      lists,
      toDoCards,
      doingCards
    } = this.state

    return(
      isLoading ?
      <div className="App">
        <PuffLoader color={color} loading={isLoading} size={50} />
      </div>
      :
      <div className="container">
        <div className="header">
          {board.name}
          <PizzaSvg className='pizza-svg'/>
        </div>
        <div className='twoColumnGrid'>
          <div className='wrapper'>
            <div className='twoColumn'>
              <div className='toDoBox'>
                <header>
                    <h3>{lists[0].name}</h3>
                    <button onClick={e=>this.modalOpen(e,'to do', lists[0].id)} >{'+ Add'}</button>
                </header>
                {
                    toDoCards.map((card) => (
                      <Card key={card.id} task={card.name}/>
                    ))
                }
              </div>
              <div className='toDoBox'>
                <header>
                    <h3>{lists[1].name}</h3>
                    <button onClick={e=>this.modalOpen(e,'doing', lists[1].id)}>{'+ Add'}</button>
                </header>
                {
                    doingCards.map((card) => (
                      <Card key={card.id} task={card.name}/>
                    ))
                  }
              </div>
            </div>
          </div>
        </div>
         <Modal show={this.state.modal} handleSubmit={this.handleSubmit} handleClose={e => this.modalClose(e)} text={this.state.modalHead}>
         <div className="input-form">
           <input
             type="text"
             name="modalInput"
             onChange={this.handleChange}
             className="form-control"
           />
         </div>
       </Modal>

      </div>
    )
  }
}

export default App;

