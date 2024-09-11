import { React, useState } from "react";
import { CiUser } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { Link } from "react-router-dom";
import "./SignUp.css";

function SignUp({ FormHandle }) {
  const [User, setUser] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  function handleSignUp(e) {
    e.preventDefault();

    if (!User || !Email || !Password) {
      alert("Please Fill All the Fields");
      return;
    }
    console.log(User, Email, Password);
    setUser("");
    setEmail("");
    setPassword("");
  }
  return (
    <div className="signin-container">
      <div className="form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="form-control">
            <input
              type="text"
              placeholder="Enter Username"
              onChange={(e) => setUser(e.target.value)}
              value={User}
            />
            <CiUser className="icon email" />
          </div>
          <div className="form-control">
            <input
              type="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              value={Email}
            />
            <CiMail className="icon email" />
          </div>
          <div className="form-control">
            <input
              type="password"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              value={Password}
            />
            <CiLock className="icon password" />
          </div>

          <button type="submit" onClick={handleSignUp}>
            Sign Up
          </button>
        </form>
        <p onClick={() => FormHandle("login")}>
          Already Have an Account. Click Here
        </p>
      </div>
    </div>
  );
}

export default SignUp;
