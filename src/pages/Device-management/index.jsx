import React, { useState, useCallback } from "react";
import { Box, Grid, IconButton, Button, Typography, Chip, Tooltip } from "@mui/material";
import moment from "moment";
import DebouncedInput from "../../Components/common/searchField";
import CustomTable from "../../Components/common/table/customTable";
import { getAllDevice } from "../../services/apis/device";
import LinkIcon from "@mui/icons-material/Link";
import { EyeIcon, AddIcon } from "../../Components/common/icons";
import ManagementGrid from "../../Components/common/managementGrid";
import AddDevice from "./dialogs/addDevices";
import { useNavigate } from "react-router-dom";


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

  const { data: devicesData, isLoading } = getAllDevice(pagination);

  const handleSearchChange = useCallback((value) => {
    setPagination((prev) => ({
      ...prev,
      searchQuery: value,
      page: 1,
    }));
  }, []);

  // ==================== IMPROVED STATUS CHIP ====================
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

  const formattedRows = (data = []) => {
    return data.map((item, index) => ({
      deviceId: item?.deviceId ?? "N/A",
      serialNumber: item?.serialNumber ?? "N/A",
      batch: item?.batch ?? "N/A",
      status: <StatusChip status={item?.status} />,
      createdAt: item?.createdAt
        ? moment(item.createdAt).format("DD-MM-YYYY HH:mm")
        : "N/A",
      Action: (
        <Grid container justifyContent="center" key={index}>
          <Tooltip title="Device Details">
            <IconButton onClick={() => navigate(`/device-management/${item?._id}`)}>
              <EyeIcon size={17} />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Assign Device">
            <IconButton>
              <LinkIcon size={17} />
            </IconButton>
          </Tooltip> */}
        </Grid>
      ),
    }));
  };

  return (
    <>
      <ManagementGrid
        moduleName="Devices"
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

                  {/* ✅ FIXED BUTTON */}
                  <Button
                    variant="contained"
                    startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                    onClick={() => setOpenAddDevice(true)}
                    sx={{ textTransform: "none", fontWeight: 500 }}
                  >
                    Add Device
                  </Button>
                </Grid>
              </Grid>

              <CustomTable
                columns={[
                  "DEVICE ID",
                  "SERIAL NUMBER",
                  "BATCH",
                  "STATUS",
                  "CREATED AT",
                  "ACTION",
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

      <AddDevice open={openAddDevice} setOpen={setOpenAddDevice} />
    </>
  );
};

export default Devices;