import React, { Component } from "react";

import AppNav from "./AppNav";
import DatePicker from "react-datepicker";
import "./App.css";
import {
  Table,
  Container,
  Input,
  Button,
  Label,
  Form,
  FormGroup
} from "reactstrap";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Moment from "react-moment";

class Expenses extends Component {
  emptyItem = {
    description: "",
    expensedate: new Date(),
    id: 104,
    location: "",
    category: { id: 1, name: "Travel" }
  };

  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
      isLoading: false,
      Categories: [],
      Expenses: [],
      item: this.emptyItem
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(date) {
    let item = { ...this.state.item };
    item.expensedate = date;
    this.setState({ item });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = { ...this.state.item };
    item[name] = value;
    this.setState({ item });
  }

  async handleSubmit(event) {
    const item = this.state.item;
    await fetch(`/api/expenses`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    });
    event.preventDefault();
    this.props.history.push("/expenses");
  }

  async remove(id) {
    await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(() => {
      let updatedExpenses = [...this.state.Expenses].filter(i => i.id !== id);
      this.setState({ Expenses: updatedExpenses });
    });
  }

  async componentDidMount() {
    const response = await fetch("/api/categories");
    const body = await response.json();
    this.setState({ Categories: body, isLoading: false });

    const responseExp = await fetch("/api/expenses");
    const bodyExp = await responseExp.json();
    this.setState({ Expenses: bodyExp, isLoading: false });
  }

  render() {
    const title = <h3>Add Expense</h3>;
    const { Categories } = this.state;
    const { Expenses, isLoading } = this.state;

    if (isLoading) return <div>Loading...</div>;

    let rows = Expenses.map(expense => (
      <tr key={expense.id}>
        <td>{expense.description}</td>
        <td>{expense.location}</td>
        <td>
          <Moment date={expense.expensedate} format="YYYY/MM/DD" />
        </td>
        <td>{expense.category.name}</td>
        <td>
          <Button
            size="sm"
            color="danger"
            onClick={() => this.remove(expense.id)}
          >
            X
          </Button>
        </td>
      </tr>
    ));

    let optionList = Categories.map(category => (
      <option value={category.id} key={category.id}>
        {category.name}
      </option>
    ));

    return (
      <div className="App">
        <AppNav />
        <Container>
          <Form onSubmit={this.handleSubmit}>
            {title}
            <FormGroup>
              <Label for="description">Title</Label>
              <Input
                type="text"
                name="description"
                id="description"
                onChange={this.handleChange}
                autoComplete="description"
              />
            </FormGroup>

            <FormGroup>
              <Label for="category">Category</Label><br />
              <select onChange={this.handleChange}>{optionList}</select>
            </FormGroup>

            <FormGroup>
              <Label for="expenseDate">Expense Date</Label><br />
              <DatePicker
                selected={this.state.item.expensedate}
                onChange={this.handleDateChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="location">Location</Label>
              <Input
                type="text"
                name="location"
                id="location"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Button color="primary" type="submit">
                Save
              </Button>{" "}
              <Button color="secondary" tag={Link} to="/categories">
                Cancel
              </Button>
            </FormGroup>
          </Form>
        </Container>
        {""}
        <Container>
          <h3>Expense List</h3>
          <Table className="mt-4">
            <thead>
              <tr>
                <th width="20%">Description</th>
                <th width="10%">Location</th>
                <th>Date</th>
                <th width="">Category</th>
                <th width="">Action</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Container>
      </div>
    );
  }
}
export default Expenses;
