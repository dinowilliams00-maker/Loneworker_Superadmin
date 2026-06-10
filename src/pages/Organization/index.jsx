import React, { useState, useCallback } from "react";
import { Box, Grid, IconButton, Button, Typography, Chip } from "@mui/material";
import moment from "moment";
import DebouncedInput from "../../Components/common/searchField";
import CustomTable from "../../Components/common/table/customTable";
import { getAllTenants } from "../../services/apis/organnization";
import { useNavigate } from "react-router-dom";
import { EyeIcon, AddIcon } from "../../Components/common/icons";
import ManagementGrid from "../../Components/common/managementGrid";
import AddAdmin from "./dialogs/AddAdmin";

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
  const [openUpload, setOpenUpload] = useState(false);



  const { data: tenantsData, isLoading, refetch } = getAllTenants(pagination);

  // Status Chip for ADmin
  // ==================== IMPROVED STATUS CHIP ====================
  // Status Chip for Organizations (isDeactivated)
  //I want the color of active is green and inactive is red
  const StatusChip = ({ status }) => {
    const isInactive = Boolean(status); // true if deactivated

    return (
      <Chip
        label={isInactive ? "Inactive" : "Active"}
        size="small"
        sx={{
          backgroundColor: isInactive ? "#ffecec" : "#e6f9ec",
          color: isInactive ? "#FF3B30" : "#3FB00F",
          fontWeight: 600,
          borderRadius: "6px",
          "& .MuiChip-label": { px: 2 },
        }}
      />
    );
  };
  // Search handling – debounced
  const handleSearchChange = useCallback((value) => {
    setPagination((prev) => ({
      ...prev,
      searchQuery: value,
      page: 1,                    // Reset to page 1 when searching
    }));
  }, []);

  // this is the Formated Rows for the table of First Letter is Capital
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
      status: <StatusChip status={item?.isDeactivated} />,
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

        </Grid>
      )
    }));
  };

  return (
    <>
     {/* Custom Hook for Management Grid - START */}
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
                sx={{ flexDirection: { xs: "column", md: "row" }, gap: { xs: 2, md: 0 }, alignItems: { xs: "flex-start", md: "center" } }}
              >
                <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>Admin List</Typography>
                <Grid
                  container
                  justifyContent={{ xs: "flex-start", md: "flex-end" }}
                  gap={2}
                  alignItems="center"
                  sx={{ width: { xs: "100%", md: "auto" } }}
                >
                  {/* Custom Search field */}
                  <DebouncedInput
                    placeholder="Search by Name/Email"
                    value={pagination.searchQuery || ""}
                    onChange={handleSearchChange}
                    delay={500}
                    sx={{ minWidth: 100, flexGrow: { xs: 1, sm: 0 }, width: { xs: "100%", sm: "auto" } }}
                  />

                  <Button variant="contained"
                    onClick={() => setOpenAddTenant(true)}
                    sx={{
                      textTransform: 'none',
                      gap: 0.5,  // This adds space between icon and text
                      width: { xs: "100%", sm: "auto" }
                    }}
                  >
                    <AddIcon fontSize={20} color="white" />
                    Add Admin
                  </Button>
                </Grid>
              </Grid>

              <CustomTable
                columns={["NAME", "EMAIL", "PHONE", "CREATED AT", "STATUS", "ACTION"]}
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
    </>
  );
};

export default Tenants;
