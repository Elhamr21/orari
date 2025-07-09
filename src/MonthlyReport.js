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
  TextField,
} from "@mui/material";

function MonthlyReport({ goBack }) {
  const [logs, setLogs] = useState([]);
  const [currentLog, setCurrentLog] = useState(null);
  const [paymentPerHour, setPaymentPerHour] = useState("");
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem("logs")) || [];
    setLogs(savedLogs);

    const savedCurrentLog = JSON.parse(localStorage.getItem("currentLog"));
    if (savedCurrentLog) setCurrentLog(savedCurrentLog);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateDurations();
    }, 1000);
    return () => clearInterval(interval);
  }, [logs, currentLog]);

  const updateDurations = () => {
    let total = 0;
    logs.forEach((log) => {
      const inTime = new Date(log.checkIn).getTime();
      const outTime = log.checkOut ? new Date(log.checkOut).getTime() : inTime;
      total += outTime - inTime;
    });
    // Shto kohën aktive nëse ka currentLog
    if (currentLog) {
      const inActive = new Date(currentLog.checkIn).getTime();
      const now = Date.now();
      total += now - inActive;
    }

    setTotalSeconds(Math.floor(total / 1000));
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}min ${s}s`;
  };

  const deleteLog = (index) => {
    const today = new Date().toDateString();
    const date = new Date(logs[index].checkIn).toDateString();
    if (date === today) {
      const updated = logs.filter((_, i) => i !== index);
      setLogs(updated);
      localStorage.setItem("logs", JSON.stringify(updated));
    } else {
      alert("Mund të fshihet vetëm hyrja e sotme.");
    }
  };

  const totalHoursDecimal = totalSeconds / 3600;
  const totalPay = paymentPerHour
    ? (totalHoursDecimal * parseFloat(paymentPerHour)).toFixed(2)
    : "";

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom align="center">
        Raporti i Orëve për Muajin{" "}
        {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Hyrja</TableCell>
            <TableCell>Dalja</TableCell>
            <TableCell>Kohëzgjatja</TableCell>
            <TableCell>Veprim</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log, i) => {
            const inTime = new Date(log.checkIn);
            const outTime = log.checkOut ? new Date(log.checkOut) : null;
            return (
              <TableRow key={i}>
                <TableCell>{inTime.toLocaleDateString()}</TableCell>
                <TableCell>{inTime.toLocaleTimeString()}</TableCell>
                <TableCell>{outTime ? outTime.toLocaleTimeString() : "-"}</TableCell>
                <TableCell>{formatTime(Math.floor((outTime ? outTime.getTime() : Date.now()) - inTime.getTime()) / 1000)}</TableCell>
                <TableCell>
                  {inTime.toDateString() === new Date().toDateString() ? (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => deleteLog(i)}
                    >
                      Fshij
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {/* Shfaq currentLog nëse ekziston */}
          {currentLog && (
            <TableRow>
              <TableCell>{new Date(currentLog.checkIn).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(currentLog.checkIn).toLocaleTimeString()}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{formatTime(Math.floor((Date.now() - new Date(currentLog.checkIn).getTime()) / 1000))}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell colSpan={3}>
              <strong>Totali i orëve:</strong>
            </TableCell>
            <TableCell>{formatTime(totalSeconds)}</TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>

      <Stack
        direction="row"
        spacing={2}
        mt={3}
        justifyContent="center"
        alignItems="center"
      >
        <Button variant="contained" color="error" onClick={goBack}>
          Kthehu mbrapa
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={() => window.print()}
        >
          Printo Raportin
        </Button>

        <TextField
          type="number"
          label="Pagesa për orë (€)"
          size="small"
          value={paymentPerHour}
          onChange={(e) => setPaymentPerHour(e.target.value)}
        />
      </Stack>

      {totalPay && (
        <Typography mt={2} align="center" fontWeight="bold" fontSize={18}>
          Pagesa totale: €{totalPay}
        </Typography>
      )}
    </Container>
  );
}

export default MonthlyReport;
