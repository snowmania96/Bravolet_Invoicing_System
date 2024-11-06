import {
  Autocomplete,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import styled from "@emotion/styled";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export default function IduploadAutocomplete({
  fieldName,
  items,
  value,
  id,
  setGroupInfo,
  name,
  tooltipTitle,
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    (async () => {
      setLoading(true);
      await sleep(500);
      setLoading(false);

      setOptions([...items]);
    })();
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };
  return (
    <div className="mt-3">
      <label className="form-label">{fieldName}</label>
      <Autocomplete
        id={name}
        fullWidth
        open={open}
        value={value}
        onChange={(e, newValue) => {
          setGroupInfo((prevGroupInfo) =>
            prevGroupInfo.map((member, index) =>
              index === id ? { ...member, [name]: newValue } : member
            )
          );
        }}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) =>
          option.Descrizione === value.Descrizione
        }
        getOptionLabel={(option) => option.Descrizione}
        options={options}
        loading={loading}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.Codice}>
              {option.Descrizione}
            </li>
          );
        }}
        renderInput={(params) => (
          <div>
            <BootstrapTooltip
              title={
                <Typography fontSize={"12px"} align="center">
                  {tooltipTitle}
                </Typography>
              }
              placement="top"
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -10],
                      },
                    },
                  ],
                },
              }}
            >
              <TextField
                id={fieldName}
                className="form-control"
                {...params}
                size="small"
                color="default"
                fullWidth
                required
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  },
                }}
              />
            </BootstrapTooltip>
          </div>
        )}
      />
    </div>
  );
}
