import React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { guestTableColumns } from "utilities/CommonUtility";
import { useGetGuestsQuery } from "state/api";

const Guests = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetGuestsQuery();

  // const guestTableColumns = [
  //   {
  //     field: "name",
  //     headerName: "Name",
  //     flex: 0.5,
  //     editable: true,
  //   },
  //   {
  //     field: "contactEmail",
  //     headerName: "Email",
  //     flex: 0.5,
  //     editable: true,
  //   },
  //   {
  //     field: "phoneNumber",
  //     headerName: "Phone Number",
  //     flex: 0.5,
  //     editable: true,
  //   },
  //   {
  //     field: "address",
  //     headerName: "Address",
  //     flex: 1,
  //     editable: true,
  //   },
  //   {
  //     field: "vatNumber",
  //     headerName: "Vat Number",
  //     flex: 0.5,
  //     editable: true,
  //   },
  //   {
  //     field: "extra",
  //     headerName: "Extra",
  //     flex: 1,
  //     editable: true,
  //   },
  //   {
  //     field: "actions",
  //     type: "actions",
  //     headerName: "Actions",
  //     flex: 0.5,
  //     cellClassName: "actions",
  //     getActions: ({ id }) => {
  //       return [
  //         <GridActionsCellItem
  //           icon={<EditIcon />}
  //           label="Edit"
  //           className="textPrimary"
  //           onClick={handleEditClick(id)}
  //           color="inherit"
  //         />,
  //         <GridActionsCellItem
  //           icon={<DeleteIcon color="error" />}
  //           label="Delete"
  //           onClick={handleDeleteClick(id)}
  //           color="inherit"
  //         />,
  //       ];
  //     },
  //   },
  // ];

  const handleEditClick = (id) => () => {};

  const handleDeleteClick = (id) => () => {};

  return (
    // <div>Hello</div>
    <Box m="1.5rem 2.5rem">
      <Header title="GUESTS" subTitle="List of Guests" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={guestTableColumns}
          // editMode="row"
          // components={{ Toolbar: DataGridCustomToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Guests;
