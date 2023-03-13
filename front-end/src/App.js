import logo from "./logo.svg";
import "./App.css";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  Link,
} from "@mui/material";
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
  const [loading, setLoading] = useState(false);

  const fetchUserData = (user) => {
    setUserData();
    setLoading(true);
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
          setErrorMessage("Error fetching user data: user does not exist.");
          setErrorModalOpen(true);
          setUserData([]);
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
          setUserData([]);
        });
      }
    });
  };

  const refreshUser = (user) => {
    setUserData();
    setLoading(true);
    fetch(`http://localhost:5000/refresh/${user}`).then((response) =>
      response.json().then(() => fetchUserData(user))
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [userData]);

  useEffect(() => {
    setUserData([]);
    setLastLookedUp(null);
    if (selectedUser !== "") {
      fetchUserData(selectedUser);
    }
  }, [selectedUser]);

  const handleSubmit = () => {
    fetchUserData(searchedUser);
    setSearchedUser("");
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
        mb={2}
        direction="column"
        spacing={5}
        style={{ maxWidth: "90%" }}
      >
        <Grid item alignItems="stretch">
          <Typography key="1" variant="h6">
            Select an existing user or search for a new user:
          </Typography>

          <br />
          <Grid container>
            <Grid item alignItems="stretch" style={{ display: "flex" }}>
              <FormControl>
                <Autocomplete
                  disablePortal
                  options={users}
                  sx={{ minWidth: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select User" />
                  )}
                  freeSolo
                  onChange={(e, value, reason) => {
                    setSelectedUser(value || "");
                  }}
                  onInputChange={(e, value) => setSearchedUser(value)}
                  value={selectedUser || null}
                />
              </FormControl>
              <Button
                variant="contained"
                size="large"
                onClick={() => fetchUserData(searchedUser)}
              >
                Search
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            {lastLookedUp && (
              <>
                <Grid
                  item
                  alignItems="stretch"
                  style={{ display: "flex" }}
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
        </Grid>

        <Repos userData={userData} loading={loading} />
      </Grid>
    </>
  );
}

export default App;
