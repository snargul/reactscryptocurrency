import React, {Component} from "react";
import axios from "axios";
import {Button} from "@material-ui/core";
import PageableTable from "../components/Table/PageableTable";
import {renderTwoDigit} from "../helper/helper";
import AreaChart from "../components/Chart/AreaChart";

class CurrencyDetails extends Component {

  constructor(props) {
    super(props);

    this.state = {
      crypto: [],
      currency: this.props.location.state.currency,
      data: []
    };
  }

  componentDidMount() {
    this.getCurrency();
    this.getCurrencyDetails();
  }

  getCurrency = () => {
    axios.get('https://api.coincap.io/v2/assets?search=' + this.state.currency)
      .then(res => {
        const crypto = res.data;
        if (crypto) {
          let list = [];
          list.push(crypto.data[0]);
          this.setState({crypto: list});
        }
      });
  };

  getCurrencyDetails = () => {
    let today = new Date();
    let start = today.setDate(today.getDate() - 8);
    let end = today.setDate(today.getDate() + 8);
    axios.get('https://api.coincap.io/v2/assets/' + this.state.currency + '/history?interval=d1&start=' + start + '&end=' + end)
      .then(res => {
        const details = res.data;
        if (details) {
          const list = [];
          details.data.map((each) => {
            list.push({date: each.date.substring(0, each.date.indexOf("T")), priceUsd: parseFloat(each.priceUsd)})
          });
          this.setState({data: list});
        }
      });
  };

  backToList = () => {
    this.props.history.push({pathname: `/`});
  }

  render() {

    const columns = [
      {
        id: 'name',
        label: 'Name',
      },
      {
        id: 'symbol',
        label: 'Symbol',
      },
      {
        id: 'priceUsd',
        label: 'Average Rate',
        align: 'right',
        format: (value) => renderTwoDigit(value, 'USD'),
      },
      {
        id: 'changePercent24Hr',
        label: 'Exchange (24h)',
        align: 'right',
        format: (value) => renderTwoDigit(value, '%'),
      },
      {
        id: 'marketCapUsd',
        label: 'Market Cap',
        align: 'right',
        format: (value) => renderTwoDigit(value, 'USD'),
      },
      {
        id: 'supply',
        label: 'Supply',
        align: 'right',
        format: (value) => renderTwoDigit(value, ''),
      },
      {
        id: 'rank',
        label: 'Rank',
      },
      {
        id: 'changePercent24Hr',
        label: 'Change Percent (24h)',
        align: 'right',
        format: (value) => renderTwoDigit(value, '%'),
      },
    ];
    return (
      <div className="Details">
        <br/>
        <hr/>
        <Button variant="outlined" color="primary" style={{height: '56px'}} onClick={() => this.backToList()}>
          Back To Home</Button>
        <br/>
        <hr/>
        <Button disabled>{"Details of " + this.state.currency}</Button>
        <hr/>
        <PageableTable columns={columns} rows={this.state.crypto} {...this.props}/>
        <br/>
        <hr/>
        <AreaChart data={this.state.data} name={this.state.currency} valueField={'priceUsd'} argumentField={'date'}/>
      </div>
    );
  }
}

export default CurrencyDetails;