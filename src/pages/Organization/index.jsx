import React, { useState, useCallback } from "react";
import { Box, Grid, IconButton, Button, Typography } from "@mui/material";
import moment from "moment";
import DebouncedInput from "../../Components/common/searchField";
import CustomTable from "../../Components/common/table/customTable";
import { getAllTenants } from "../../services/apis/organnization";
import { useNavigate } from "react-router-dom";
import { EyeIcon, AddIcon, EditTableIcon } from "../../Components/common/icons";
import ManagementGrid from "../../Components/common/managementGrid";
import AddAdmin from "./dialogs/AddAdmin";
import EditAdmin from "./dialogs/EditAdmin";
//import PaginationState from "../../Components/common/commonPaginationState";

// Breadcrumb
const breadcrumbItems = [{ label: "Organizations", link: "/" }];

const Tenants = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10,
    searchQuery: "",
  });
  const [openAddTenant, setOpenAddTenant] = useState(false);
  const [openEditTenant, setOpenEditTenant] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);



  const { data: tenantsData, isLoading, refetch } = getAllTenants(pagination);

  // Search handling – debounced
  const handleSearchChange = useCallback((value) => {
    setPagination((prev) => ({
      ...prev,
      searchQuery: value,
      page: 1,                    // Reset to page 1 when searching
    }));
  }, []);


  const formattedRows = (data = []) => {
    return data.map((item, index) => ({
      name: item?.name?.trim()
        ? item.name.trim().charAt(0).toUpperCase() + item.name.trim().slice(1)
        : "N/A",
      email: item?.email ?? "N/A",
      phone: item?.phone ?? "N/A",
      createdAt: item?.createdAt
        ? moment(item.createdAt).format("DD-MM-YYYY HH:mm")
        : "N/A",
      Action: (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={1}          // Adds space between icons
          key={index}
        >
          {/* View Icon */}
          <Grid item>
            <IconButton
              onClick={() => navigate(`/organization/${item?._id}`)}
              color="primary"
            >
              <EyeIcon size={20} />
            </IconButton>
          </Grid>

          {/* Edit Icon */}
          <Grid item>
            <IconButton
              onClick={() => {
                setSelectedOrg(item);
                setOpenEditTenant(true);
              }}

              color="secondary"
            >
              <EditTableIcon size={20} />
            </IconButton>
          </Grid>
        </Grid>
      ),  // ← Comma is now correctly placed after the closing parenthesis
    }));
  };

  return (
    <>
      <ManagementGrid
        moduleName="Organizations"
        breadcrumbItems={breadcrumbItems}
        textData={`Last Updated: ${moment().format("DD-MM-YYYY HH:mm")}`}
        textDataColor="text.primary"
      />
      <Box sx={{ bgcolor: "white", p: 3, borderRadius: 6 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <div className="custom-Grid">
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>Admin List</Typography>
                <Grid
                  container
                  justifyContent="flex-end"
                  gap={2}
                  alignItems="center"
                >
                  <DebouncedInput
                    placeholder="Search by Name/Email"
                    value={pagination.searchQuery || ""}
                    onChange={handleSearchChange}
                    delay={500}
                    sx={{ minWidth: 100 }}
                  />

                  <Button variant="contained"
                    onClick={() => setOpenAddTenant(true)}
                    sx={{
                      textTransform: 'none',
                      gap: 0.5  // This adds space between icon and text
                    }}
                  >
                    <AddIcon fontSize={20} color="white" />
                    Add Admin
                  </Button>
                </Grid>
              </Grid>

              <CustomTable
                columns={["NAME", "EMAIL", "PHONE", "CREATED AT", "ACTION"]}
                rows={formattedRows(tenantsData?.data?.admins)}
                pagination={pagination}
                setPagination={setPagination}
                //ActionSkeletonLength={1}
                count={tenantsData?.data?.pagination?.totalCount || 0}
                loading={isLoading}
              />
            </div>
          </Grid>
        </Grid>
      </Box>

      {/* ADD ADMIN DIALOG */}
      <AddAdmin
        open={openAddTenant}
        setOpen={setOpenAddTenant}
      />
      <EditAdmin
        open={openEditTenant}
        setOpen={setOpenEditTenant}
        organizationDetails={{
          data: selectedOrg,
        }}
        id={selectedOrg?._id}
      />
    </>
  );
};

export default Tenants;
