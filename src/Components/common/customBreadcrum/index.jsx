import React from "react";
import {
    Grid,
    Breadcrumbs,
    Typography,
    useTheme,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

const CustomBreadcrumbs = ({ breadcrumbItems }) => {
    const location = useLocation();
    const theme = useTheme();

    return (
        <Grid container direction="row" alignItems="center">
            <Breadcrumbs
                separator="›"
                aria-label="breadcrumb"
                sx={{
                    "& .MuiBreadcrumbs-separator": {
                        color: theme.palette.primary.main,
                    },
                }}
            >
                {breadcrumbItems.map((item, index) => (
                    <NavLink
                        to={item.link}
                        key={index}
                        style={{
                            textDecoration: "none",
                        }}
                    >
                        <Typography
                            color={(() => {
                                // console.log("pathname:", location.pathname);
                                // console.log("item.link:", item.link);
                                return location.pathname === item.link
                                    ? "primary"
                                    : "text.secondary";
                            })()}
                            variant="subtitle1"
                            style={{
                                cursor: location.pathname !== item.link ? "pointer" : "initial",
                            }}
                        >
                            {item.label}
                        </Typography>
                    </NavLink>
                ))}
            </Breadcrumbs>
        </Grid>
    );
};

export default CustomBreadcrumbs;