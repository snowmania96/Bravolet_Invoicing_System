export const capitalizeRole = (role) => {
  if (role === "superadmin") {
    return "Super Admin";
  } else if (role === "admin") {
    return "Admin";
  } else if (role === "user") {
    return "User";
  } else {
    return role;
  }
};

export const guestTableColumns = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "companyName",
    headerName: "Company Name",
    flex: 1,
  },
  {
    field: "contactEmail",
    headerName: "Email",
    flex: 1,
  },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    flex: 1,
  },
  {
    field: "country",
    headerName: "Country",
    flex: 1,
  },
  {
    field: "address",
    headerName: "Address",
    flex: 1,
  },
  {
    field: "vatNumber",
    headerName: "Vat Number",
    flex: 1,
  },
  {
    field: "billingCode",
    headerName: "Billing Code",
    flex: 1,
  },
  {
    field: "pecAddress",
    headerName: "PEC Address",
    flex: 1,
  },
  {
    field: "checkIn",
    headerName: "Check In",
    flex: 1,
  },
  {
    field: "checkOut",
    headerName: "Check Out",
    flex: 1,
  },
  {
    field: "extra",
    headerName: "Extra",
    flex: 1,
  },
];

export const adminTableColumns = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "contactEmail",
    headerName: "Email",
    flex: 1,
  },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    flex: 1,
  },
  {
    field: "address",
    headerName: "Address",
    flex: 1,
  },
  {
    field: "role",
    headerName: "Role",
    flex: 1,
  },
];

export const transactionTableColumns = [
  {
    field: "_id",
    headerName: "ID",
    flex: 1,
  },
  {
    field: "userId",
    headerName: "User ID",
    flex: 1,
  },
  {
    field: "createdAt",
    headerName: "CreatedAt",
    flex: 1,
  },
  {
    field: "products",
    headerName: "# of Products",
    flex: 0.5,
    sortable: false,
    renderCell: (params) => params.value.length,
  },
  {
    field: "cost",
    headerName: "Cost",
    flex: 1,
    renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
  },
];

export const performancecTableColumns = [
  {
    field: "_id",
    headerName: "ID",
    flex: 1,
  },
  {
    field: "userId",
    headerName: "User ID",
    flex: 1,
  },
  {
    field: "createdAt",
    headerName: "CreatedAt",
    flex: 1,
  },
  {
    field: "products",
    headerName: "# of Products",
    flex: 0.5,
    sortable: false,
    renderCell: (params) => params.value.length,
  },
  {
    field: "cost",
    headerName: "Cost",
    flex: 1,
    renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
  },
];
