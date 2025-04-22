import * as React from "react";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { parseISO } from "date-fns";
import CheckIcon from "@mui/icons-material/Check";

const initialValue = dayjs();

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !outsideCurrentMonth &&
    highlightedDays.some((item) => item.day === day.date());

  return (
    <div>
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={
          isSelected ? getBadgeContent(day, highlightedDays) : undefined
        }
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    </div>
  );
}

function getBadgeContent(day, highlightedDays) {
  const moodItem = highlightedDays.find(
    (currentDay) => currentDay.day === day.date()
  );
  return moodItem ? moodItem.mood : undefined;
}
export default function Cal({ onDateSelected, daysToHighlight }) {
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState(daysToHighlight);
  const [currentMonth, setCurrentMonth] = React.useState(initialValue);

  const fetchHighlightedDays = (date) => {
    const controller = new AbortController();

    setHighlightedDays(daysToHighlight);
    setIsLoading(false);

    requestAbortController.current = controller;
  };

  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, [onDateSelected]);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    setCurrentMonth(date);
    fetchHighlightedDays(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={initialValue}
        loading={isLoading}
        disableFuture
        onChange={(newValue) => {
          var tzoffset = new Date().getTimezoneOffset() * 60000;
          onDateSelected(new Date(newValue - tzoffset));
        }}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
            currentMonth,
          },
        }}
      />
    </LocalizationProvider>
  );
}
