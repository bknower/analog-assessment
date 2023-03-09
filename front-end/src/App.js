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
import Typography from "@mui/material/Typography";
import { FormControl, Grid, InputLabel, Link } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Repos } from "./Repos";
function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [searchedUser, setSearchedUser] = useState("");
  const [userData, setUserData] = useState([]);

  const fetchUserData = (user) => {
    fetch(`http://localhost:5000/user/${user}`)
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .then(fetchUsers);
  };

  const fetchUsers = () => {
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser !== "") {
      fetchUserData(selectedUser);
    }
  }, [selectedUser]);

  return (
    <Grid container ml={5} mt={2} direction="column" spacing={5}>
      <Grid item alignItems="stretch">
        <Typography key="1" variant="h6">
          Select an existing user:
        </Typography>
        <br />
        <FormControl>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser}
            style={{ minWidth: 150 }}
            displayEmpty
            onChange={(e) => {
              setSelectedUser(e.target.value);
            }}
          >
            {/* <MenuItem value=""></MenuItem> */}
            {users.map((user) => (
              <MenuItem key={user} value={user}>
                {user}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography key="2" variant="h6" mt={2}>
          Search for new users:
        </Typography>
        <br />
        <Grid container>
          <Grid item alignItems="stretch" style={{ display: "flex" }}>
            <TextField
              type="search"
              label="Username"
              value={searchedUser}
              onChange={(e) => setSearchedUser(e.target.value)}
              onSubmit={() => fetchUserData(searchedUser)}
            />
          </Grid>
          <Grid item alignItems="stretch" style={{ display: "flex" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => fetchUserData(searchedUser)}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Repos userData={userData} />
    </Grid>
  );
}

export default App;
