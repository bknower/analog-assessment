import logo from "./logo.svg";
import "./App.css";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    console.log("get users");
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);
  useEffect(() => {
    fetch(`http://localhost:5000/user/${selectedUser}`)
      .then((response) => response.json())
      .then((data) => setUserData(data));
  }, [selectedUser]);
  return (
    <div>
      <Select
        value={selectedUser}
        label="User"
        onChange={(e) => {
          setSelectedUser(e.target.value);
        }}
      >
        {users.map((user) => (
          <MenuItem key={user} value={user}>
            {user}
          </MenuItem>
        ))}
      </Select>
      <br />
      {userData.map((repo) => (
        <div>{repo}</div>
      ))}
    </div>
  );
}

export default App;
