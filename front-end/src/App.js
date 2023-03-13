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
import RefreshIcon from "@mui/icons-material/Refresh";
import moment from "moment";
function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [searchedUser, setSearchedUser] = useState("");
  const [userData, setUserData] = useState([]);
  const [lastLookedUp, setLastLookedUp] = useState();
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUserData = (user) => {
    fetch(`http://localhost:5000/user/${user}`).then((response) => {
      if (response.ok) {
        response
          .json()
          .then((data) => {
            const { username, created, repos } = data;
            setLastLookedUp(created);
            setUserData(repos);
            setSelectedUser(username);
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

  const refreshUser = (user) => {
    fetch(`http://localhost:5000/refresh/${user}`).then((response) =>
      response.json().then(() => fetchUserData(user))
    );
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
          <Grid container>
            <Grid item alignItems="stretch" style={{ display: "flex" }}>
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
            </Grid>
            {lastLookedUp && (
              <>
                <Grid
                  item
                  alignItems="stretch"
                  style={{ display: "flex" }}
                  ml={3}
                  mt={1}
                >
                  <Typography key="2" variant="h6">
                    Last updated{" "}
                    {moment
                      .utc(lastLookedUp)
                      .local()
                      .format("MMMM Do YYYY, h:mm:ss a")}
                  </Typography>
                </Grid>
                <Grid item ml={3} mt={1}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => refreshUser(selectedUser)}
                  >
                    Refresh
                  </Button>
                </Grid>
              </>
            )}
          </Grid>

          <Typography key="3" variant="h6" mt={2}>
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
