import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
} from "@mui/material";

function Checkin({ goBack }) {
  const [clock, setClock] = useState("");
  const [logs, setLogs] = useState([]);
  const [currentLog, setCurrentLog] = useState(null);

  // Ora dixhitale
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setClock(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Nxjerr nga localStorage logs dhe currentLog në fillim
  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem("logs")) || [];
    setLogs(savedLogs);

    const savedCurrentLog = JSON.parse(localStorage.getItem("currentLog"));
    if (savedCurrentLog) {
      setCurrentLog(savedCurrentLog);
    }
  }, []);

  // Sa herë ndryshon logs, ruajmë në localStorage
  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs));
  }, [logs]);

  // Sa herë ndryshon currentLog, ruajmë në localStorage ose fshijmë nëse null
  useEffect(() => {
    if (currentLog) {
      localStorage.setItem("currentLog", JSON.stringify(currentLog));
    } else {
      localStorage.removeItem("currentLog");
    }
  }, [currentLog]);

  const handleCheck = () => {
    const now = new Date();
    if (!currentLog) {
      // Hyrje në punë
      const newEntry = {
        checkIn: now.toISOString(),
      };
      setCurrentLog(newEntry);
    } else {
      // Dalje nga puna, shtojmë logun dhe pastaj e fshijmë currentLog
      const newLog = {
        checkIn: currentLog.checkIn,
        checkOut: now.toISOString(),
      };
      setLogs((prev) => [...prev, newLog]);
      setCurrentLog(null);
    }
  };

  // Llogarit kohëzgjatjen në format "xh ymin zs"
  const calcDuration = (startISO, endISO) => {
    const start = new Date(startISO).getTime();
    const end = endISO ? new Date(endISO).getTime() : Date.now();
    const diff = end - start;
    const totalSec = Math.floor(diff / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${m}min ${s}s`;
  };

  return (
    <Container maxWidth="md" sx={{ pt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🕒 Regjistrimi i Punës (pa databazë)
      </Typography>

      <Typography align="center" sx={{ fontSize: 28, mb: 3 }}>
        {clock}
      </Typography>

      <Stack direction="row" justifyContent="center" spacing={2} mb={4}>
        <Button
          variant="contained"
          color={currentLog ? "error" : "primary"}
          onClick={handleCheck}
        >
          {currentLog ? "Largohu nga puna" : "Hyr në punë"}
        </Button>
      </Stack>

      {currentLog && (
        <Typography align="center" mb={3}>
          Koha e hyrjes: <strong>{new Date(currentLog.checkIn).toLocaleTimeString()}</strong>
        </Typography>
      )}

      <Typography variant="h6" gutterBottom>
        Lista e Hyrje/Daljeve
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hyrja</TableCell>
            <TableCell>Dalja</TableCell>
            <TableCell>Kohëzgjatja</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log, idx) => (
            <TableRow key={idx}>
              <TableCell>{new Date(log.checkIn).toLocaleString()}</TableCell>
              <TableCell>{log.checkOut ? new Date(log.checkOut).toLocaleString() : "-"}</TableCell>
              <TableCell>{calcDuration(log.checkIn, log.checkOut)}</TableCell>
            </TableRow>
          ))}
          {/* Nëse ka currentLog aktiv, shfaqet si hyrje aktive */}
          {currentLog && (
            <TableRow>
              <TableCell>{new Date(currentLog.checkIn).toLocaleString()}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{calcDuration(currentLog.checkIn, null)}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Stack direction="row" justifyContent="center" spacing={2} mt={4}>
        <Button variant="contained" color="primary" onClick={goBack}>
          Kthehu mbrapa
        </Button>
      </Stack>
    </Container>
  );
}

export default Checkin;
