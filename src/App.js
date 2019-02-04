import React, { Component } from "react";
import qs from "qs";

class App extends Component {
  state = {
    boro1: "1",
    address1: "",
    boro2: "1",
    address2: "375 Pearl Street",
    response: undefined,
    error: undefined
  };

  render() {
    return (
      <div className="sans-serif absolute absolute--fill flex flex-column items-center justify-center">
        <div className="flex flex-column items-end">
          <form>
            <div className="w-100 flex items-end mv3">
              <h2 className="db f4 fw7 ttc w3 mr2 mv0">From</h2>
              {this.renderAddressInput(1)}
              {this.renderBoroInput(1)}
            </div>
            <div className="w-100 flex items-end mv3">
              <h2 className="db f4 fw7 ttc w3 mr2 mv0">To</h2>
              {this.renderAddressInput(2)}
              {this.renderBoroInput(2)}
            </div>
          </form>
          <button
            className="bn bg-blue white br2 pa2"
            onClick={() => this.handleSubmit()}
          >
            Check LoS
          </button>
        </div>
        {this.renderResponse()}
        {this.renderError()}
      </div>
    );
  }

  renderResponse() {
    const { response } = this.state;
    if (!response) return null;
    return <pre>{JSON.stringify(response)}</pre>;
  }

  renderError() {
    const { error } = this.state;
    if (!error) return null;
    return <pre>Error: {JSON.stringify(error)}</pre>;
  }

  handleAddressChange(event, number) {
    const { name, value } = event.target;
    this.setState({ [name + number]: value });
  }

  handleBoroChange(event, number) {
    // const { name, value } = event.target;
    // const boro = value.split(" ").slice()
    // this.setState({ [name]: value });
    // console.log(this.state);
  }

  handleSubmit() {
    const { address1, address2, boro1, boro2 } = this.state;
    const [houseno1, street1] = this.getHouseStreet(address1);
    const [houseno2, street2] = this.getHouseStreet(address2);

    const params = qs.stringify({
      boro1,
      houseno1,
      street1,
      boro2,
      houseno2,
      street2
    });
    console.log({
      boro1,
      houseno1,
      street1,
      boro2,
      houseno2,
      street2
    });
    const URL = `http://localhost:8080/los?${params}`;
    console.log(URL);
    fetch(URL)
      .then(res => res.json())
      .then(response => this.setState({ response }))
      .catch(error => this.setState({ error }));
  }

  renderAddressInput(number) {
    return (
      <div className="mr3">
        <input
          name="address"
          defaultValue={this.state[`address${number}`]}
          placeholder="123 Street Name"
          onChange={event => this.handleAddressChange(event, number)}
        />
      </div>
    );
  }

  renderBoroInput(number) {
    return (
      <div className="">
        <select
          name="borough"
          defaultValue={this.state[`boro${number}`]}
          onChange={event => this.handleBoroChange(event, number)}
        >
          <option value="1">Manhattan</option>
          <option value="2">Brooklyn</option>
          <option value="3">Bronx</option>
          <option value="4">Queens</option>
          <option value="5">Staten Island</option>
        </select>
      </div>
    );
  }

  getHouseStreet(address) {
    const houseno = address
      .split(" ")
      .slice(0, 1)
      .join("");
    const street = address
      .split(" ")
      .slice(1)
      .join(" ");
    return [houseno, street];
  }
}

export default App;
