// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import MuiTab, { TabProps } from "@mui/material/Tab";

// ** Icons Imports
import yup from "yup";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

// ** Demo Tabs Imports

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";
import {
  Button,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import toast from "react-hot-toast";

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    minWidth: 100,
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: 67,
  },
}));

const TabName = styled("span")(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: "0.875rem",
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const AccountSettings = () => {
  // ** State

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "",
      fullName: "",
      id: "",
      password: "",
    },
    onSubmit: (values) => {
      updateUserData(values);
    },
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (Object.keys(userData).length) {
      formik.setFieldValue("name", userData.name);
      formik.setFieldValue("email", userData.email);
      formik.setFieldValue("fullName", userData.fullname);
      formik.setFieldValue("role", userData.role);
      formik.setFieldValue("password", userData.password);
      formik.setFieldValue("id", userData.admin_id);
    }
  }, []);

  const updateUserData = async (data: any) => {
    try {
      const response = await fetch(
        `http://54.226.108.109:3000/admin/user/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            EMAIL: data.email,
            FULLNAME: data.fullName,
            NAME: data.name,
            PASSWORD: data.password,
          }),
        }
      );
      if (response.status === 200) {
        const result = await response.json();
        if (result.status) {
          toast.success("Account updated successfully");
        } else {
          toast.error(result.msg);
        }
      }
    } catch (err) {
      toast.error("Unable to update account. please try again");
    }
  };

  return (
    <Card>
      <CardContent>
        <form
          noValidate
          onSubmit={formik.handleSubmit}
          onReset={formik.handleReset}
        >
          <Grid container spacing={7}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                value={formik.values.name}
                label="Name"
                name="name"
                placeholder="johnDoe"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                value={formik.values.name}
                label="Name"
                name="fullName"
                placeholder="johnDoe"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formik.values.email}
                placeholder="johnDoe@example.com"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <OutlinedInput
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                name="password"
                value={formik.values.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {!showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{ marginRight: 3.5 }}
              >
                Save Changes
              </Button>
              <Button type="reset" variant="outlined" color="secondary">
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
