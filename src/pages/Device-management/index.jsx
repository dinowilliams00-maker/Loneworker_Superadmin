import React, { useState, useCallback } from "react";
import { Box, Grid, IconButton, Button, Typography, Chip, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import moment from "moment";
import DebouncedInput from "../../Components/common/searchField";
import CustomTable from "../../Components/common/table/customTable";
import { getAllDevice, useUpdateDeviceStatus } from "../../services/apis/device";
import { getAllTenants } from "../../services/apis/organnization";

import { EyeIcon, UploadIcon, CloseIcon } from "../../Components/common/icons";
import ManagementGrid from "../../Components/common/managementGrid";
import AddDevice from "./dialogs/addDevices";
import BulkUploadDevice from "./dialogs/BulkUploadDevice";
import LinkIcon from "@mui/icons-material/Link";

import { notifySuccess, notifyError } from "../../Components/common/snackbar";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../../Components/common/customSelect";   // ← Added

// Breadcrumb
const breadcrumbItems = [
  { label: "Organizations", link: "/" },
  { label: "Devices", link: "/device-management" }
];

const Devices = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10,
    searchQuery: "",
  });
  const [openAddDevice, setOpenAddDevice] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);

  // ================= DIALOG STATE =================
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "",
    deviceId: null,

    selectedOrgId: "",
    selectedUserId: "",
  });

  const { data: devicesData, isLoading, refetch } = getAllDevice(pagination);
  const { data: tenantsData } = getAllTenants(
    {
      limit: 1000,
    },
    {
      enabled:
        confirmDialog.open &&
        confirmDialog.type === "assign",
    }
  );

  const { mutate: updateDeviceStatus, isPending: isUpdating } = useUpdateDeviceStatus();

  const handleOpenUpload = () => setOpenBulkUpload(true);
  const handleOpenAdd = () => setOpenAddDevice(true);

  // ================= STATUS CHIP ====================
  const StatusChip = ({ status }) => {
    const getStatusStyle = (status) => {
      const s = status?.toLowerCase()?.trim();
      if (["active", "excellent"].includes(s)) return { bg: "#e6f9ec", color: "#3FB00F", label: status };
      if (["fair", "in repair", "repair"].includes(s)) return { bg: "#fff7e0", color: "#F6B000", label: "In Repair" };
      if (["inactive", "bad", "office"].includes(s)) return { bg: "#ffecec", color: "#FF3B30", label: status };
      return { bg: "#e0e0e0", color: "#424242", label: status || "Unknown" };
    };

    const { bg, color, label } = getStatusStyle(status);
    return <Chip label={label} size="small" sx={{ backgroundColor: bg, color, fontWeight: 600, borderRadius: "6px" }} />;
  };

  const handleSearchChange = useCallback((value) => {
    setPagination((prev) => ({ ...prev, searchQuery: value, page: 1 }));
  }, []);

  // ================= OPTIONS FOR SELECT =================
  const tenantOptions = [
    { label: "Select Organization", value: "" },

    ...(tenantsData?.data?.admins?.map((tenant) => ({
      label: tenant.name,

      value: tenant.userId, // query param

      orgId: tenant._id, // payload
    })) || [])
  ];
  // ================= ASSIGN / UNASSIGN HANDLER =================
  const handleAssignUnassign = () => {
    const isAssign = confirmDialog.type === "assign";

    updateDeviceStatus(
      {
        // QUERY PARAM
        userId: confirmDialog.selectedUserId,

        // PAYLOAD
        orgId: confirmDialog.selectedOrgId,

        status: isAssign
          ? "Assigned"
          : "Unassigned",

        deviceId: [confirmDialog.deviceId],
      },
      {
        onSuccess: (data) => {
          notifySuccess(
            data?.message ||
            `Device ${isAssign ? "assigned" : "unassigned"} successfully`
          );

          refetch();

          setConfirmDialog({
            open: false,
            type: "",
            deviceId: null,
            selectedOrgId: "",
            selectedUserId: "",
          });
        },

        onError: (error) => {
          notifyError(error?.message || "Something went wrong");

          setConfirmDialog({
            open: false,
            type: "",
            deviceId: null,
            selectedOrgId: "",
            selectedUserId: "",
          });
        },
      }
    );
  };

  const formattedRows = (data = []) => {

    return data.map((item, index) => {

      console.log("FULL ITEM =>", item);
      console.log("ORG =>", item?.orgId);

      return ({
        deviceId: item?.deviceId ?? "N/A",

        serialNumber: item?.serialNumber ?? "N/A",

        orgName: item?.orgId?.name ?? "N/A",

        simAssigned: (
          <span
            style={{
              color: item?.isSimAssigned ? "#2e7d32" : "#d32f2f",
              fontWeight: 600
            }}
          >
            {item?.isSimAssigned ? "True" : "False"}
          </span>
        ),

        batch: item?.batch ?? "N/A",

        status: <StatusChip status={item?.status} />,

        createdAt: item?.createdAt
          ? moment(item.createdAt).format("DD-MM-YYYY HH:mm")
          : "N/A",

        Action: (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
            key={index}
          >
            <Tooltip title="View Device">
              <IconButton size="small" color="primary"
                onClick={() => navigate(`/device-management/${item?._id}`)} >
                <EyeIcon size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                item?.orgId
                  ? "Unassign Device"
                  : "Assign Device"
              }
            >
              <IconButton
                size="small"
                color={item?.orgId ? "error" : "primary"}
                onClick={() => {

                  console.log("CLICK ITEM =>", item);
                  console.log("CLICK ORG =>", item?.orgId);

                  setConfirmDialog({
                    open: true,

                    type: item?.orgId
                      ? "unassign"
                      : "assign",

                    deviceId: item?._id,

                    selectedOrgId:
                      item?.orgId?._id || "",

                    selectedUserId:
                      item?.userId ||
                      item?.orgId?.userId ||
                      "",
                  });
                }}
              >
                {item?.orgId ? (
                  <CloseIcon size={20} />
                ) : (
                  <LinkIcon size={20} />
                )}
              </IconButton>
            </Tooltip>
          </Grid>
        ),
      });
    });
  };
  return (
    <>
      <ManagementGrid
        moduleName="Devices"
        breadcrumbItems={breadcrumbItems}
        button="Add Device"
        handleClickOpen={handleOpenAdd}
        add={true}
      />

      <Box sx={{ bgcolor: "white", p: 3, borderRadius: 6 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <div className="custom-Grid">
              <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
                  Device List
                </Typography>

                <Grid container justifyContent="flex-end" gap={2} alignItems="center">
                  <DebouncedInput
                    placeholder="Search by Device ID / Serial No"
                    value={pagination.searchQuery || ""}
                    onChange={handleSearchChange}
                    delay={500}
                    sx={{ minWidth: 220 }}
                  />

                  <Button variant="outlined" startIcon={<UploadIcon />} onClick={handleOpenUpload}>
                    Bulk upload
                  </Button>
                </Grid>
              </Grid>

              <CustomTable
                columns={[
                  "DEVICE ID", "SERIAL NUMBER", "ORGANIZATION",
                  "SIM ASSIGNED", "BATCH", "STATUS", "CREATED AT", "ACTION"
                ]}
                rows={formattedRows(devicesData?.data?.data || devicesData?.data)}
                pagination={pagination}
                setPagination={setPagination}
                count={devicesData?.data?.pagination?.totalCount || 0}
                loading={isLoading}
              />
            </div>
          </Grid>
        </Grid>
      </Box>

      {/* ================= CONFIRMATION / ASSIGN DIALOG ================= */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, type: "", deviceId: null, selectedOrgId: "" })} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: confirmDialog.type === "unassign" ? "error.light" : "primary.main", color: "white" }}>
          {confirmDialog.type === "unassign" ? "Unassign Device" : "Assign Device"}
        </DialogTitle>
        <DialogContent dividers>
          {confirmDialog.type === "unassign" ? (
            <Typography variant="h6" mt={1}>
              Are you sure you want to unassign this device?
            </Typography>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" mb={2}>
                Select Organization to Assign this Device:
              </Typography>
              <CustomSelect
                displayEmpty
                value={confirmDialog.selectedUserId}
                onChange={(selected) => {
                  setConfirmDialog((prev) => ({
                    ...prev,

                    // query param
                    selectedUserId: selected?.value || "",

                    // payload
                    selectedOrgId: selected?.orgId || "",
                  }));
                }}
                options={tenantOptions}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setConfirmDialog({ open: false, type: "", deviceId: null, selectedOrgId: "" })}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={confirmDialog.type === "unassign" ? "error" : "primary"}
            onClick={handleAssignUnassign}
            disabled={isUpdating || (confirmDialog.type === "assign" && !confirmDialog.selectedOrgId)}
          >
            {confirmDialog.type === "unassign" ? "Yes, Unassign" : "Assign"}
          </Button>
        </DialogActions>
      </Dialog>

      <AddDevice open={openAddDevice} setOpen={setOpenAddDevice} />
      <BulkUploadDevice openUpload={openBulkUpload} setOpenUpload={setOpenBulkUpload} />
    </>
  );
};

export default Devices;