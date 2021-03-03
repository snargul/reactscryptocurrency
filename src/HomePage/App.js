import React, {Component} from 'react';
import './App.css';
import axios from "axios";
import PageableTable from '../components/Table/PageableTable'
import {Button} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import {renderTwoDigit} from "../helper/helper";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cryptos: [],
      exchangeType: 'USD',
      exchangeRate: 1,
      filter: '',
      offset: 0
    };
  }

  componentDidMount() {
    this.getCurrencyList();
  }

  getCurrencyList = (searchQuery = '') => {
    if (searchQuery) {
      this.setState({filter: searchQuery});
      searchQuery = '&search=' + searchQuery;
    } else if (this.state.filter) {
      searchQuery = '&search=' + this.state.filter;
    }
    axios.get('https://api.coincap.io/v2/assets?limit=100&offset=' + this.state.offset + searchQuery)
      .then(res => {
        const cryptos = res.data;
        console.log(cryptos);
        if (cryptos) {
          this.setState({cryptos: cryptos.data});
        }
      });
  }

  increaseOffset = () => {
    this.setState({offset: this.state.offset + 1}, () => this.getCurrencyList());
  }

  decreaseOffset = () => {
    this.setState({offset: this.state.offset - 1}, () => this.getCurrencyList());
  }

  jumpToFirstList = () => {
    this.setState({offset: 0}, () => this.getCurrencyList());
  }

  resetFilter = () => {
    this.setState({filter: ''}, () => this.getCurrencyList());
  }

  fetchAndSetEUR = () => {
    axios.get('https://api.coincap.io/v2/assets?search=stasis-euro')
      .then(res => {
        const cryptos = res.data;
        if (cryptos) {
          this.setState({exchangeRate: cryptos.data[0].priceUsd, exchangeType: 'EUR'});
        }
      });
  }

  toggleExchangeType = () => {
    if (this.state.exchangeType === 'USD') {
      this.fetchAndSetEUR();
    } else {
      this.setState({exchangeRate: 1, exchangeType: 'USD'});
    }
  }

  fetchByFilter = (value) => {
    this.getCurrencyList(value);
  };

  showDetail = (value) => {
    this.props.history.push({pathname: `/details`, state: {currency: value}});
  };

  render() {

    const columns = [
      {
        id: 'name',
        label: 'Name',
        minWidth: 170,
        onClick: (value) => this.fetchByFilter(value),
      },
      {
        id: 'symbol',
        label: 'Symbol',
        minWidth: 100,
        onClick: (value) => this.fetchByFilter(value),
      },
      {
        id: 'priceUsd',
        label: 'Average Rate',
        minWidth: 170,
        align: 'right',
        format: (value) => renderTwoDigit(value, this.state.exchangeType, this.state.exchangeRate),
      },
      {
        id: 'changePercent24Hr',
        label: 'Exchange (24h)',
        minWidth: 170,
        align: 'right',
        format: (value) => renderTwoDigit(value, '%'),
      },
      {
        id: 'id',
        label: '',
        align: 'right',
        onClick: (value) => this.showDetail(value),
      }
    ];

    return (
      <div className="App">
        <br/>
        <hr/>
        <Button variant="outlined" color="primary" style={{height: '56px'}} onClick={() => this.getCurrencyList()}>
          Refresh List</Button>
        <span>&nbsp;</span>
        <TextField disabled id="outlined-disabled1" label="Filter" value={this.state.filter} variant="outlined"
                   style={{width: '7%'}}/>
        <span>&nbsp;</span>
        <Button variant="outlined" color="secondary" style={{height: '56px'}} onClick={() => this.resetFilter()}>Reset
          Filter</Button>
        <span>&nbsp;</span>
        <Button variant="outlined" color="primary" style={{height: '56px'}}
                onClick={() => this.toggleExchangeType()}>{this.state.exchangeType}</Button>
        <br/>
        <hr/>
        <PageableTable columns={columns} rows={this.state.cryptos} {...this.props}/>
        <br/>
        <Button disabled={this.state.offset === 0} variant="outlined" color="primary" style={{height: '56px'}}
                onClick={() => this.jumpToFirstList()}>First</Button>
        <span>&nbsp;</span>
        <Button disabled={this.state.offset === 0} variant="outlined" color="primary" style={{height: '56px'}}
                onClick={() => this.decreaseOffset()}>Prev 100</Button>
        <span>&nbsp;</span>
        <TextField disabled id="outlined-disabled2"
                   label={"Range: " + (this.state.offset * 100) + " - " + ((this.state.offset * 100) + 100)}
                   variant="outlined" style={{width: '8.5%', textAlign: 'center'}}/>
        <span>&nbsp;</span>
        <Button variant="outlined" color="primary" style={{height: '56px'}} onClick={() => this.increaseOffset()}>Next
          100</Button>
      </div>
    );
  }
}

export default App;
