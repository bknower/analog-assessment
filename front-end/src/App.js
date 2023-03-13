import logo from "./logo.svg";
import "./App.css";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { FormControl, Grid, InputLabel, Link } from "@mui/material";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Repos } from "./Repos";
import { ErrorModal } from "./ErrorModal";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [searchedUser, setSearchedUser] = useState("");
  const [userData, setUserData] = useState([]);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUserData = (user) => {
    fetch(`http://localhost:5000/user/${user}`).then((response) => {
      if (response.ok) {
        response
          .json()
          .then((data) => {
            Object.entries(data).forEach(([username, repos]) => {
              setUserData(repos);
              setSelectedUser(username);
            });
          })
          .then(fetchUsers);
      } else {
        response.text().then((text) => {
          setErrorMessage("Error fetching user data: " + text);
          setErrorModalOpen(true);
        });
      }
    });
  };

  const fetchUsers = () => {
    fetch("http://localhost:5000/users").then((response) => {
      if (response.ok) {
        response.json().then((data) => setUsers(data));
      } else {
        response.text().then((text) => {
          setErrorMessage("Error fetching user data: " + text);
          setErrorModalOpen(true);
        });
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser !== "") {
      fetchUserData(selectedUser);
    }
  }, [selectedUser]);

  const handleSubmit = () => {
    if (searchedUser == "") {
      setErrorMessage("Please enter the username of a GitHub user.");
      setErrorModalOpen(true);
    } else {
      fetchUserData(searchedUser);
      setSearchedUser("");
    }
  };

  return (
    <>
      <ErrorModal
        show={errorModalOpen}
        setShow={setErrorModalOpen}
        message={errorMessage}
      />
      <Grid
        container
        ml={5}
        mt={2}
        direction="column"
        spacing={5}
        style={{ maxWidth: "90%" }}
      >
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
                onSubmit={handleSubmit}
              />
            </Grid>
            <Grid item alignItems="stretch" style={{ display: "flex" }}>
              <Button variant="contained" size="large" onClick={handleSubmit}>
                Search
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Repos userData={userData} />
      </Grid>
    </>
  );
}

export default App;
