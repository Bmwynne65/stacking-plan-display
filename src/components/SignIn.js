import { React, useState } from "react";
import { CiUser } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { Link } from "react-router-dom";
import "./SignIn.css";

function SignIn({ FormHandle }) {
  const [User, setUser] = useState("");
  const [Password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (!User || !Password) {
      alert("Please Fill All the Fields");
      return;
    }
    console.log(User, Password);
    setUser("");
    setPassword("");
  }

  return (
    <div className="signin-container">
      <div className="form-container">
        <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="form-control">
            <input
              type="email"
              placeholder="Enter Email"
              onChange={(e) => setUser(e.target.value)}
              value={User}
            />
            <CiUser className="icon email" />
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

          <button type="submit" onClick={handleLogin}>
            <Link className="link-dec" to={`/home`}>
              Sign In
            </Link>
          </button>
        </form>
        <p onClick={() => FormHandle("signup")}>
          Don't Have an Account. Click Here
        </p>
      </div>
    </div>
  );
}

export default SignIn;
