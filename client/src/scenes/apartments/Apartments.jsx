import React, { useEffect, useState } from "react";
import {
  Box,
  useMediaQuery,
  IconButton,
  InputBase,
  useTheme,
} from "@mui/material";
import Header from "components/Header";
import { useGetApartmentsQuery } from "state/api";
import Product from "./apartment/Apartment";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FlexBetween from "components/FlexBetween";
import { Search } from "@mui/icons-material";
import { useDebounce } from "@uidotdev/usehooks";

const Apartments = () => {
  const { data, isLoading } = useGetApartmentsQuery();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [searchData, setSearchData] = useState(data);
  const debouncedSearchTerm = useDebounce(searchText, 500);
  useEffect(() => {
    if (debouncedSearchTerm && searchText != "") {
      searchFunction();
    }
  }, [debouncedSearchTerm, searchText]);

  const searchFunction = () => {
    const tempData = [];
    for (let i = 0; i < data.length; i++) {
      const temp = (
        data[i].name +
        data[i].address +
        data[i].information
      ).toLowerCase();
      if (temp.includes(searchText)) tempData.push(data[i]);
    }
    setSearchData(tempData);
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="APARTMENTS" subtitle="See our list of apartments." />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <FlexBetween
          backgroundColor={theme.palette.background.alt}
          borderRadius="9px"
          gap="3rem"
          p="0.1rem 1.5rem"
          width={"20%"}>
          <InputBase
            placeholder="Search..."
            value={searchText}
            onChange={handleChange}
          />
          <IconButton>
            <Search />
          </IconButton>
        </FlexBetween>
      </div>
      {searchData || data ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}>
          {((searchText !== "" && searchData) || data).map(
            ({ _id, name, address, photo, information }) => (
              <Product
                key={_id}
                _id={_id}
                name={name}
                photo={photo}
                address={address}
                information={information}
              />
            )
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
      <ToastContainer />
    </Box>
  );
};

export default Apartments;
