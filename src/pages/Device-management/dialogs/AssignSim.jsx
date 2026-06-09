import { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getAllDevice, useUpdateDeviceStatus } from "../../../services/apis/device";
import { notifyError, notifySuccess } from "../../../Components/common/snackbar";

const AssignSim = ({ open, onClose, orgId, userId, onSuccess }) => {
  const [search, setSearch] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState(null); // _id of selected device

  // Fetch unassigned devices (isSimAssigned: false) only when dialog is open
  const { data: devicesData, isLoading } = getAllDevice(
    { limit: 1000, isSimAssigned: false },
    { enabled: open }
  );

  const { mutate: updateDeviceStatus, isPending } = useUpdateDeviceStatus();

  // Filter by search
  const filteredDevices = useMemo(() => {
    const list = devicesData?.data?.data || devicesData?.data || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (d) =>
        d?.deviceId?.toLowerCase().includes(q) ||
        d?.serialNumber?.toLowerCase().includes(q) ||
        d?.imei?.toLowerCase().includes(q)
    );
  }, [devicesData, search]);

  const handleAssign = () => {
    if (!selectedDeviceId || !orgId) return;

    updateDeviceStatus(
      {
        userId,         // query param: assigned_to
        orgId,          // payload: orgId from the organization
        status: "Assigned",
        deviceId: [selectedDeviceId],
      },
      {
        onSuccess: (data) => {
          notifySuccess(data?.message || "SIM assigned successfully");
          handleClose();
          onSuccess?.();
        },
        onError: (error) => {
          notifyError(error?.message || "Failed to assign SIM");
        },
      }
    );
  };

  const handleClose = () => {
    setSearch("");
    setSelectedDeviceId(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        Assign SIM to Device
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2, pb: 1 }}>
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search by Device ID, Serial No or IMEI"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2 }}
        />

        {/* Device list */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : filteredDevices.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ py: 3 }}
          >
            No unassigned devices found
          </Typography>
        ) : (
          <RadioGroup
            value={selectedDeviceId || ""}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
          >
            <Box
              sx={{
                maxHeight: 320,
                overflowY: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              {filteredDevices.map((device, i) => (
                <Box
                  key={device._id}
                  sx={{
                    px: 2,
                    py: 1.2,
                    borderBottom:
                      i < filteredDevices.length - 1
                        ? "1px solid"
                        : "none",
                    borderColor: "divider",
                    bgcolor:
                      selectedDeviceId === device._id
                        ? "primary.light"
                        : "transparent",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  onClick={() => setSelectedDeviceId(device._id)}
                >
                  <FormControlLabel
                    value={device._id}
                    control={<Radio size="small" />}
                    label={
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.primary"
                        >
                          {device.deviceId}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          SN: {device.serialNumber} | IMEI: {device.imei}
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, width: "100%" }}
                  />
                </Box>
              ))}
            </Box>
          </RadioGroup>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button variant="outlined" onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAssign}
          disabled={!selectedDeviceId || isPending}
        >
          {isPending ? <CircularProgress size={20} color="inherit" /> : "Assign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignSim;
