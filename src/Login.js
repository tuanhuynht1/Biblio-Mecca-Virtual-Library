import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
  onClickHandler(event) {
    event.preventDefault();
    const { setAccountInfo } = this.props;
    const user = document.getElementById("input-user").value;
    const pass = document.getElementById("input-pass").value;
    if (user && user.value !== "" && pass && pass.value !== "") {
      axios
        .get(`/api/authenticateLogin/${user}/${pass}`)
        .then((res) => {
          if (res.data) {
            return axios
              .get(`/api/viewPatronInfo/${user}`)
              .then((res) => {
                // console.log(res.data);
                const data = {
                  username: user,
                  fname: res.data.fname,
                  lname: res.data.lname,
                  DOB: res.data.dob,
                  address: res.data.adress,
                  phone: res.data.phone_number,
                };
                setAccountInfo(data);
                console.log(data);
              })
              .catch(console.error);
          }
        })
        .catch(console.error);
    }
  }

  render() {
    return (
      <div>
        <br />
        <br />
        <h1>LOGIN</h1>
        <br />
        <br />
        <form className="fillout">
          <div className="container">
            <label htmlFor="username">
              <b>Username</b>
            </label>
            <input
              id="input-user"
              type="text"
              placeholder="Enter Username"
              name="Username"
              required
            />

            <label htmlFor="password">
              <b>Password</b>
            </label>
            <input
              id="input-pass"
              type="password"
              placeholder="Enter Password"
              name="password"
              required
            />

            <div className="clearfix">
              <button
                onClick={this.onClickHandler.bind(this)}
                type="submit"
                className="loginbtn"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
