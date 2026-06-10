import {
  Button,
  CircularProgress,
  Typography,
  useTheme,
  Box,
  alpha,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import LoginImg from "src/assets/images/loginImage.jpg";
import Logo from "src/assets/images/logo.png";

import { SignIn } from "src/services/apis/auth";
import { notifyError, notifySuccess } from "src/Components/common/snackbar";
import CustomTextField from "src/Components/common/textfield";
import { useAuth } from "src/Components/common/provider/authProvider";

const Login = () => {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    register,
    clearErrors,
    getValues,
  } = useForm();

  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const handleLogout = () => {
    logout();
    // navigate is handled inside logout
  };
  const theme = useTheme();
  const { mutate, isPending } = SignIn();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValue(name, value);
    if (errors[name]) clearErrors(name);
  };
 
  // when Submit the Sign In Form
  const onSubmit = () => {
    const values = getValues();
    mutate(
      {
        email: values?.email?.toLowerCase(),
        password: values?.password,
        key: "lone_worker_psiBorg_Technology_2025",
      },
      {
        onSuccess: (response) => {
          notifySuccess(response?.message ?? "Login Successfully");
          console.log(response, 'response?.data');
          login(response);

          navigate("/organization");
        },
        onError: (error) => {
          notifyError(
            error?.response?.data?.message || "An error occurred during sign in."
          );
        },
      }
    );
  };

  return (
    <>
      {/* Full-screen container with background image */}
      <Box
        sx={{
          height: "100vh",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Background image */}
        <img
          src={LoginImg}
          alt="login"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            zIndex: 0,
          }}
        />

        {/* Login card — exact styling from original */}
        <Box
          sx={{
            position: "absolute",
            zIndex: 1,
            width: { xs: "100%", sm: "480px", md: "520px", lg: "560px" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(229, 235, 238, 0.3)",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.5)",
            borderRadius: "24px",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 2 }}>

              {/* Logo */}
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.secondary.main, 0.8),
                    borderRadius: "16px",
                    p: 1.5,
                    boxShadow: "0px 4px 12px rgba(204, 204, 204, 0.5)",
                  }}
                >
                  <img src={Logo} alt="logo" height={100} />
                </Box>
              </Box>

              {/* Title */}
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h3"
                  color={'#fff'}
                  fontWeight={600}
                >
                  Nice to see you again!
                </Typography>
              </Box>

              {/* Email */}
              <Box>
                <Typography variant="body1" color="#fff">
                  Email
                </Typography>
                <CustomTextField
                  {...register("email", { required: "Email is required" })}
                  name="email"
                  placeholder="Enter Email"
                  field="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  onChange={handleInputChange}
                />
              </Box>

              {/* Password */}
              <Box>
                <Typography variant="body1" color="#fff">
                  Password
                </Typography>
                <CustomTextField
                  {...register("password", { required: "Password is required" })}
                  name="password"
                  placeholder="Enter Password"
                  field="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  onChange={handleInputChange}
                />
              </Box>

              {/* Forgot Password */}
              {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Typography
                  variant="body1"
                  color={theme.palette.background?.paper}
                  fontWeight={600}
                  sx={{ cursor: "pointer" }}
                >
                  Forgot Password?
                </Typography>
              </Box> */}

              {/* Submit */}
              <Box>
                <Button variant="contained" fullWidth type="submit">
                  {isPending ? (
                    <CircularProgress size="23px" color="secondary" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Box>

            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Login;
