import React, { useState, useCallback } from "react";
import { Box, Grid, IconButton, Button, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from "@mui/material";
import moment from "moment";

import DebouncedInput from "../../Components/common/searchField";
import CustomTable from "../../Components/common/table/customTable";
import CustomSelect from "../../Components/common/customSelect";

import { useGetAllSim, useAssignAndUnassignSim } from "../../services/apis/sim";
import { notifyError, notifySuccess } from "../../Components/common/snackbar";

import { EyeIcon, AddIcon, CloseIcon } from "../../Components/common/icons";
import ManagementGrid from "../../Components/common/managementGrid";
import AddSim from "./diaog/AddSim";
import { useNavigate } from "react-router-dom";
import { getAllDevice } from "../../services/apis/device";
import { getAllTenants } from "../../services/apis/organnization";

// Breadcrumb
const breadcrumbItems = [
  { label: "Organizations", link: "/" },
  { label: "SIM Management", link: "/sim-management" },
];

const SimManagement = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10,
    searchQuery: "",
  });

  const [filters, setFilters] = useState({
    organization: "",
    device: "",
  });

  const [openAddSim, setOpenAddSim] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: "", simId: "", deviceId: null });

  // ================= API CALLS =================
  const { mutate: assignUnassignSim, isPending: isAssigning } = useAssignAndUnassignSim();

  const handleAssignUnassign = () => {
    assignUnassignSim(
      { id: confirmDialog.simId, type: confirmDialog.type, deviceId: confirmDialog.deviceId },
      {
        onSuccess: (data) => {
          notifySuccess(data?.message || `SIM ${confirmDialog.type === "assign" ? "Assigned" : "Unassigned"} Successfully`);
          setConfirmDialog({ open: false, type: "", simId: "", deviceId: null });
        },
        onError: (error) => {
          notifyError(error?.message || "Something went wrong");
          setConfirmDialog({ open: false, type: "", simId: "", deviceId: null });
        }
      }
    );
  };
  const { data: simsData, isLoading } = useGetAllSim({
    ...pagination,
    ...filters,
  });

  // Get Devices with limit 1000
  const { data: devicesData } = getAllDevice({ limit: 1000 });

  // Get Tenants (Organizations) with limit 1000
  const { data: tenantsData } = getAllTenants({ limit: 1000 });

  const handleSearchChange = useCallback((value) => {
    setPagination((prev) => ({
      ...prev,
      searchQuery: value,
      page: 1,
    }));
  }, []);

  // ================= FILTER HANDLERS =================
  const handleOrganizationChange = (selected) => {
    setFilters((prev) => ({
      ...prev,
      organization: selected?.value || "",
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDeviceChange = (selected) => {
    setFilters((prev) => ({
      ...prev,
      device: selected?.value || "",
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // ================= STATUS CHIP =================
  const StatusChip = ({ status }) => {
    const getStatusStyle = (status) => {
      const s = status?.toLowerCase()?.trim();

      if (["active", "excellent"].includes(s)) {
        return { bg: "#e6f9ec", color: "#3FB00F", label: status };
      }
      if (["fair", "in repair", "repair"].includes(s)) {
        return { bg: "#fff7e0", color: "#F6B000", label: "In Repair" };
      }
      if (["inactive", "bad", "office"].includes(s)) {
        return { bg: "#ffecec", color: "#FF3B30", label: status };
      }
      return { bg: "#e0e0e0", color: "#424242", label: status || "Unknown" };
    };

    const { bg, color, label } = getStatusStyle(status);

    return (
      <Chip
        label={label}
        size="small"
        sx={{
          backgroundColor: bg,
          color: color,
          fontWeight: 600,
          borderRadius: "6px",
          "& .MuiChip-label": { px: 2 },
        }}
      />
    );
  };

  // ================= FORMATTED ROWS =================
  const formattedRows = (data = []) => {
    return data.map((item, index) => ({
      simNumber: item?.simNumber ?? "N/A",
      mobileNumber: item?.mobileNumber ?? "N/A",
      provider: item?.provider ?? "N/A",
      deviceId: item?.deviceId?.deviceId ?? "N/A",
      organization: item?.orgId?.name ?? "N/A",
      activationDate: item?.activationDate
        ? moment(item.activationDate).format("DD-MM-YYYY")
        : "N/A",
      status: <StatusChip status={item?.status} />,
      Action: (
        <Grid container justifyContent="center" alignItems="center" gap={0} key={index}>
          <Tooltip title="View SIM Details">
            <IconButton onClick={() => navigate(`/sim-management/${item?._id}`)} size="small">
              <EyeIcon size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title={item?.deviceId ? "Unassign SIM" : "Assign SIM"}>
            <IconButton
              size="small"
              color={item?.deviceId ? "error" : "primary"}
              onClick={() => setConfirmDialog({ 
                open: true, 
                type: item?.deviceId ? "unassign" : "assign", 
                simId: item?._id, 
                deviceId: item?.deviceId?._id || item?.deviceId 
              })}
            >
              {item?.deviceId ? <CloseIcon size={22} /> : <AddIcon size={22} />}
            </IconButton>
          </Tooltip>
        </Grid>
      ),
    }));
  };

  // ================= OPTIONS FOR CUSTOM SELECT =================
  const organizationOptions = [
    { label: "All Organizations", value: "" },
    ...(tenantsData?.data?.admins?.map((org) => ({
      label: org.name,
      value: org._id,
    })) || []),
  ];

  const deviceOptions = [
    { label: "All Devices", value: "" },
    ...(devicesData?.data?.data?.map((dev) => ({
      label: dev.deviceId,
      value: dev._id,
    })) || []),
  ];

  return (
    <>
      <ManagementGrid
        moduleName="SIM Management"
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
                <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
                  SIM Inventory
                </Typography>

                <Grid container justifyContent="flex-end" gap={2} alignItems="center">
                  {/* Search */}
                  <DebouncedInput
                    placeholder="Search by SIM Number / Mobile No"
                    value={pagination.searchQuery || ""}
                    onChange={handleSearchChange}
                    delay={500}
                    sx={{ minWidth: 250 }}
                  />

                  {/* Organization Filter - CustomSelect */}
                  <Box sx={{ minWidth: 200 }}>
                    <CustomSelect
                      displayEmpty
                      value={filters.organization}
                      onChange={handleOrganizationChange}
                      options={organizationOptions}
                    />
                  </Box>

                  {/* Device Filter - CustomSelect */}
                  <Box sx={{ minWidth: 200 }}>
                    <CustomSelect
                      displayEmpty
                      value={filters.device}
                      onChange={handleDeviceChange}
                      options={deviceOptions}
                    />
                  </Box>

                  {/* Add SIM Button */}
                  <Button
                    variant="contained"
                    startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                    onClick={() => setOpenAddSim(true)}
                    sx={{ textTransform: "none", fontWeight: 500 }}
                  >
                    Add SIM
                  </Button>
                </Grid>
              </Grid>

              <CustomTable
                columns={[
                  "SIM NUMBER",
                  "MOBILE NUMBER",
                  "PROVIDER",
                  "DEVICE ID",
                  "ORGANIZATION",
                  "ACTIVATION DATE",
                  "STATUS",
                  "ACTION",
                ]}
                rows={formattedRows(simsData?.data?.data || [])}
                pagination={pagination}
                setPagination={setPagination}
                count={simsData?.data?.pagination?.total || 0}
                loading={isLoading}
              />
            </div>
          </Grid>
        </Grid>
      </Box>

      <AddSim open={openAddSim} setOpen={setOpenAddSim} />

      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: confirmDialog.type === "unassign" ? "error.light" : "primary.main", color: "white" }}>
          {confirmDialog.type === "unassign" ? "Confirmation" : "Assign SIM"}
        </DialogTitle>
        <DialogContent dividers>
          {confirmDialog.type === "assign" ? (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body1" mb={2} color="textSecondary">
                Please select a device to assign this SIM to:
              </Typography>
              <CustomSelect
                value={confirmDialog.deviceId || ""}
                onChange={(selected) => setConfirmDialog({ ...confirmDialog, deviceId: selected?.value || selected })}
                options={deviceOptions.filter(opt => opt.value !== "")}
                fullWidth
              />
            </Box>
          ) : (
            <Typography variant="h6" mt={1}>
              Are you sure you want to unassign the SIM?
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            disabled={isAssigning}
            sx={{ color: "black", borderColor: "black" }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color={confirmDialog.type === "unassign" ? "error" : "primary"}
            onClick={handleAssignUnassign}
            disabled={isAssigning || (confirmDialog.type === "assign" && !confirmDialog.deviceId)}
          >
            {confirmDialog.type === "unassign" ? "Yes" : "Assign"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SimManagement;