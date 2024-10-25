import React, { useEffect, useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import axios from "axios";
import Header from "components/Header";
import { format } from "date-fns";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import { Card, CardContent, useTheme, TextField } from "@mui/material";

const END_POINT = process.env.REACT_APP_BASE_URL;

const variableList = [
  "fiscalInformation",
  "apartmentAddress",
  "apartmentNickname",
  "checkIn",
  "checkOut",
  "reservationId",
  "confirmationCode",
  "guestName",
  "companyName",
];

const jwtToken = () => {
  const authData = JSON.parse(localStorage.getItem("admin"));
  return "Bearer " + String(authData.token);
};

export default function Schema() {
  const theme = useTheme();
  const today = format(new Date(), "MM/dd/yyyy");
  const [schema, setSchema] = useState("");
  const [editable, setEditable] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${END_POINT}/schema/get`, {
        headers: {
          Authorization: jwtToken(),
        },
      });
      setSchema(response.data.note);
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSchema(value);
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (e) => {
    if (editable) {
      setSchema(schema + `{{${e.target.id}}}`);
    }
  };

  const handleSaveButtonClick = async () => {
    try {
      const response = await axios.post(
        `${END_POINT}/schema/update`,
        {
          name: "InvoiceSchema",
          note: schema,
        },
        {
          headers: {
            Authorization: jwtToken(),
          },
        }
      );
      setEditable(!editable);
      toast.success(response.data.msg, { position: "top-right" });
    } catch (err) {
      toast.error(err.response.data.error, { position: "top-right" });
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="SCHEMA" subtitle="See our receipt schema." />
      <div
        style={{ display: "flex", justifyContent: "flex-end", width: "80%" }}>
        <Button
          variant="contained"
          color="error"
          disabled={editable}
          onClick={() => setEditable(!editable)}
          style={{ marginRight: "15px" }}>
          E d i t
        </Button>

        <Button
          variant="contained"
          color="success"
          disabled={!editable}
          onClick={handleSaveButtonClick}>
          S a v e
        </Button>
      </div>
      <Card
        className="card2"
        sx={{
          backgroundImage: "none",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
          margin: "auto",
          marginTop: "20px",
        }}>
        <CardContent sx={{ marginLeft: "15px", marginRight: "15px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              //   padding: "50px",
            }}>
            <div style={{ textAlign: "center" }}>
              <small>
                Questa anteprima potrebbe differire leggermente dal documento
                PDF generato. Clicca su APRI PDF per il documento reale.
              </small>
            </div>
            <div
              style={{
                height: "1px",
                borderWidth: "0",
                color: "gray",
                backgroundColor: "gray",
              }}
            />
            <div>
              <small style={{ float: "right" }}>Medistart srl</small>
              <br />
              <small style={{ float: "right" }}>
                VIA FORTUNATO ZENI 18 - 38068 - Rovereto (TN)
              </small>
              <br />
              <small style={{ float: "right" }}>
                Ipoint - Trentino Sviluppo
              </small>
              <br />
              <small style={{ float: "right" }}>
                P.iva 02345130229 - C.F. 02345130229
              </small>
              <br />
              <br />
              <div style={{ float: "right" }}>
                RICEVUTA nr. {"{{receiptNumber}}"} / {new Date().getFullYear()}
                del {today}
              </div>
              <br />
            </div>
            <div
              style={{
                height: "1px",
                borderWidth: "0",
                color: "gray",
                backgroundColor: "gray",
              }}
            />
            <div style={{ marginTop: "15px", marginBottom: "100px" }}>
              <small>Destinatario</small>
              <div>{"{{guestName}}"}</div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <table className="borderless-table">
                <tr>
                  <td style={{ width: "90%" }}>
                    <small>Descrizione</small>
                  </td>
                  <td style={{ width: "10%" }}>
                    <small>Importo</small>
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#dddddd" }}>
                  <td>
                    Canone di Locazione, {"{{apartmentAddress}}"} - periodo dal{" "}
                    {"{{checkIn}}"} al {"{{checkOut}}"}, Prenotazione N°{" "}
                    {"{{confirmationCode}}"}
                  </td>
                  <td>€ {"{{money}}"}</td>
                </tr>
              </table>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "15px",
              }}>
              <Button
                variant="contained"
                color="secondary"
                id="add-variable"
                aria-controls={open ? "variable-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}>
                <AddIcon fontSize="small" />
                Add Variable
              </Button>
              <Menu
                id="variable-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ "aria-labelledby": "add-variable" }}>
                {variableList.map((variable) => (
                  <MenuItem
                    id={variable}
                    value={variable}
                    onClick={handleMenuItemClick}>
                    {variable}
                  </MenuItem>
                ))}
              </Menu>
            </div>
            <TextField
              style={{ marginTop: "20px" }}
              id="Note"
              multiline
              fullWidth
              rows={50}
              color="error"
              focused
              slotProps={{
                input: {
                  readOnly: !editable,
                },
              }}
              onChange={handleChange}
              value={schema}
            />
            <div
              style={{
                height: "1px",
                borderWidth: "0",
                color: "gray",
                backgroundColor: "gray",
                marginTop: "20px",
              }}
            />
            <div style={{ marginTop: "20px", marginBottom: "100px" }}>
              <small>Scadenze</small>
              <div>
                {today}: € {"{{money}}"}
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <table className="borderless-table">
                <tr>
                  <td style={{ width: "60%" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                      <div>
                        <small>RIEPILOGO IVA</small>
                      </div>
                      <div>
                        <small style={{ marginRight: "10px" }}>
                          IMPONIBILE
                        </small>
                        <small>IMPOSTE</small>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                      <div>
                        <small>0% - Esente Art.10 DPR 633/72 </small>
                      </div>
                      <div>
                        <small style={{ marginRight: "25px" }}>
                          {"{{money}}"}
                        </small>
                        <small>€ 0,00</small>
                      </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                  </td>
                  <td style={{ width: "40%" }}>
                    <br />
                    <br />
                    <br />
                    <br />
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}>
                      <small>Imponibile € {"{{money}}"}</small>
                    </div>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}>
                      <h2>€ {"{{money}}"}</h2>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <div style={{ marginTop: "150px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <div>
                  <small>
                    Ricevuta nr. {"{{receiptNumber}}"} /{" "}
                    {new Date().getFullYear()} del {today} - 1 / 1{" "}
                  </small>
                </div>
                <div>
                  <small>Medistart srl carmelo.sangiorgio@protonmail.com</small>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ToastContainer />
    </Box>
  );
}
