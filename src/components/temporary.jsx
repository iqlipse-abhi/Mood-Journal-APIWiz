import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { Badge } from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import CheckIcon from "@mui/icons-material/Check";

function fakeFetch(date, { signal }) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = date.daysInMonth();
      const daysToHighlight = [1, 2, 3, 6];

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException("aborted", "AbortError"));
    };
  });
}

const Cal = ({ onDateSelected, highlightedDays }) => {
  const [value, setValue] = useState(new Date());
  const [isLoading, setIsLoading] = React.useState(false);
  const isSelected = true;
  console.log(highlightedDays);

  const fetchHighlightedDays = (date) => {
    const controller = new AbortController();
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        // ignore the error if it's caused by `controller.abort`
        if (error.name !== "AbortError") {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, []);

  const renderDayWithBadge = (day, value, DayComponentProps) => {
    // const isSelected = highlightedDays.includes(day.getDate());
    return (
      <Badge badgeContent={0} color="primary" invisible={!isSelected}>
        <PickersDay {...DayComponentProps} />
      </Badge>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDatePicker
        variant="static"
        orientation="portrait"
        value={value}
        disableFuture
        loading={isLoading}
        onChange={(newValue) => {
          setValue(newValue);
          onDateSelected(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
        slotProps={{
          actionBar: {
            day: {
              highlightedDays,
            },
            actions: ["today"],
          },
        }}
        renderDay={renderDayWithBadge}
      />
    </LocalizationProvider>
  );
};

export default Cal;
