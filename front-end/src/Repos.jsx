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

export const Repos = React.memo(({ userData }) => {
  useEffect(() => {
    console.log("rerender repos");
  });
  return (
    <Grid item>
      <Grid container spacing={2}>
        {userData.map((repo, index) => (
          <Grid item key={index}>
            <Card style={{ maxWidth: 300 }}>
              <CardContent>
                <Typography variant="h6">
                  <a href={repo.link}>{repo.name}</a>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {repo.description}
                </Typography>

                {repo.pl && (
                  <Typography variant="body2">
                    Built in <b>{repo.pl}</b>
                  </Typography>
                )}
              </CardContent>
              <CardActions disableSpacing></CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
});
