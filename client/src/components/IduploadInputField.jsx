import styled from "@emotion/styled";
import { TextField, Typography } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import React from "react";

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

export default function IduploadInputField({
  name,
  value,
  fieldName,
  id,
  setGroupInfo,
  tooltipTitle,
}) {
  return (
    <div className="mt-3 w-100 d-flex flex-column">
      <label className="form-label">{fieldName}</label>
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
          name={name}
          value={value}
          onChange={(e) => {
            setGroupInfo((prevGroupInfo) =>
              prevGroupInfo.map((member, index) =>
                index === id ? { ...member, [name]: e.target.value } : member
              )
            );
          }}
          required
          color="default"
          size="small"
        />
      </BootstrapTooltip>
    </div>
  );
}
