import React, {Component} from 'react';
import './App.css';
import axios from "axios";
import PageableTable from '../components/Table/PageableTable'
import {Button} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import {renderTwoDigit} from "../helper/helper";
import Autocomplete from '@material-ui/lab/Autocomplete';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cryptos: [],
      exchangeType: 'USD',
      exchangeRate: 1,
      filter: '',
      size: 10,
      page: 2,
      totalElementCount: undefined,
      searchQueryHistory: undefined,
      searchQueryName: '',
      searchQuerySymbol: '',
      nameOptions: [],
      symbolOptions: []
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

    this.getTotalCount(searchQuery, 0);

    let limit = this.state.size
    let offset = this.state.size * this.state.page

    axios.get('https://api.coincap.io/v2/assets?limit=' + limit + '&offset=' + offset + searchQuery)
      .then(res => {
        const cryptos = res.data;
        console.log(cryptos);
        if (cryptos) {
          this.setState({cryptos: cryptos.data});
        }
      });
  }

  getTotalCount = (searchQuery = '', offset) => {
    if (!this.state.totalElementCount || this.state.searchQueryHistory !== searchQuery) {
      let size = 2000;
      axios.get('https://api.coincap.io/v2/assets?limit=' + size + '&offset=' + offset + searchQuery)
        .then(res => {
          const cryptos = res.data;
          if (cryptos && cryptos.data && cryptos.data.length) {
            let totalElementCount = cryptos.data.length;
            if (totalElementCount < (size * (offset + 1))) {
              this.setFilterOptions(cryptos.data);
              this.setState({totalElementCount, searchQueryHistory: searchQuery});
            } else {
              this.getTotalCount(searchQuery, offset + 1);
            }
          }
        });
    }
  }

  setFilterOptions = (data) => {
    if (!this.state.totalElementCount && data.length > 0) {
      let nameOptions = [];
      let symbolOptions = [];
      data.forEach(each => {
        nameOptions.push(each.name);
        symbolOptions.push(each.symbol);
      });
      this.setState({nameOptions, symbolOptions});
    }
  }

  resetFilter = () => {
    this.setState({filter: '', page: 0}, () => this.getCurrencyList());
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
    this.setState({searchQuery: value, page: 0}, () => this.getCurrencyList(value));
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
                onClick={() => this.toggleExchangeType()}>{"Change Rate: " + this.state.exchangeType}</Button>
        <br/>
        <hr/>
            <Autocomplete
              id="combo-box-demo"
              value={this.state.searchQueryName}
              onChange={(event, newValue) => {
                this.setState({searchQueryName: newValue, page: 0, searchQuerySymbol: ''}, () => this.getCurrencyList(newValue));
              }}
              options={this.state.nameOptions}
              getOptionLabel={(option) => option}
              style={{width: 300, position: 'absolute', right: '28.5rem'}}
              renderInput={(params) => <TextField {...params} label="Filter by Name" variant="outlined"/>}
            />
            <Autocomplete
              id="combo-box-demo"
              value={this.state.searchQuerySymbol}
              onChange={(event, newValue) => {
                  this.setState({searchQuerySymbol: newValue, page: 0, searchQueryName: ''}, () => this.getCurrencyList(newValue));
              }}
              options={this.state.symbolOptions}
              getOptionLabel={(option) => option}
              style={{width: 300, position: 'relative', left: '28.5rem'}}
              renderInput={(params) => <TextField {...params} label="Filter by Symbol" variant="outlined"/>}
            />
        <hr/>
        <PageableTable columns={columns} rows={this.state.cryptos}
                       page={this.state.page} size={this.state.size} total={this.state.totalElementCount}
                       setPage={(e) => this.setState({page: e}, () => this.getCurrencyList())}
                       setSize={(e) => this.setState({size: e}, () => this.getCurrencyList())}
                       {...this.props}/>
      </div>
    );
  }
}

export default App;
