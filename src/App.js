import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Stack } from "@mui/material";
import Checkin from "./checkin";
import MonthlyReport from "./MonthlyReport";

function App() {
  const [role, setRole] = useState(null);
  const [view, setView] = useState("home");

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) setRole(savedRole);
  }, []);

  const loginAs = (r) => {
    localStorage.setItem("role", r);
    setRole(r);
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("logs");
    localStorage.removeItem("currentLog");
    setRole(null);
    setView("home");
  };

  if (!role) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Zgjedh rolin për të vazhduar:
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
          <Button variant="contained" onClick={() => loginAs("admin")}>
            Admin
          </Button>
          <Button variant="outlined" onClick={() => loginAs("worker")}>
            Punëtor
          </Button>
        </Stack>
      </Container>
    );
  }

  if (view === "checkin") {
    return <Checkin goBack={() => setView("home")} />;
  }
  if (view === "monthly") {
    return <MonthlyReport goBack={() => setView("home")} />;
  }

  return (
    <Container sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        {role === "admin" ? "Paneli i Administratorit" : "Paneli i Punëtorit"}
      </Typography>

      <Stack spacing={2} alignItems="center" mt={4}>
        {role === "admin" ? (
          <>
            <Button variant="contained">Raporti i Pagesave</Button>
            <Button variant="contained">Hyrjet e Punëtorëve</Button>
            <Button variant="contained">Aprovo Kërkesat për Hyrje</Button>
            <Button variant="contained" onClick={() => setView("checkin")}>
              Regjistro Hyrjen
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" onClick={() => setView("checkin")}>
              Regjistro Hyrjen
            </Button>
            <Button variant="contained" onClick={() => setView("monthly")}>
              Shiko Orët Mujore
            </Button>
          </>
        )}
        <Button color="error" onClick={logout}>
          Shkyqu
        </Button>
      </Stack>
    </Container>
  );
}

export default App;
