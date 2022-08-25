// ** React Imports
import { useEffect } from "react";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";

// ** Third Party Imports
import * as yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";

// ** Icons Imports
import Close from "mdi-material-ui/Close";
import { InputLabel, MenuItem } from "@mui/material";

interface SidebarAddUserType {
  open: boolean;
  toggle: (data: any) => void;
  data?: any;
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  name: yup.string().required(),
  code: yup.string().required(),
  address: yup.string().required(),
  // musicUpload: yup.mixed().required("Music is required"),
  // imageUpload: yup.mixed().required("Image is required"),
});

const SidebarAddUser = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, data } = props;

  const formik = useFormik({
    initialValues: {
      name: data?.COMPANY_NAME || "",
      code: data?.COMPANY_CODE || "",
      address: data?.COMPANY_ADDRESS || "",
      status: true,
      id: "",
    },
    // validationSchema: schema,
    onSubmit: (values: any) => {
      createCompany({
        COMPANY_NAME: values.name,
        COMPANY_CODE: values.code,
        COMPANY_ADDRESS: values.address,
        isActive: values.status,
      });
    },
  });

  useEffect(() => {
    if (data !== undefined && data !== null && Object.keys(data).length) {
      formik.setFieldValue("name", data.COMPANY_NAME);
      formik.setFieldValue("code", data.COMPANY_CODE);
      formik.setFieldValue("address", data.COMPANY_ADDRESS);
      formik.setFieldValue("id", data.COMPANY_ID);
      formik.validateForm();
    }
  }, [data]);

  const createCompany = async (data: any) => {
    try {
      const res = await fetch(
        `http://54.226.108.109:3000/admin/company/${formik.values.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.status === 200) {
        const result = await res.json();
        if (result.status) {
          toast.success("Company updated successfully");
          handleClose();
        } else {
          toast.error(result.msg);
        }
      }
    } catch (err: any) {
      toast.error("Something went wrong. Please try again");
      console.log(err);
    }
  };

  const handleClose = () => {
    toggle({});
    formik.resetForm();
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h6">Update Company</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={formik.handleSubmit} noValidate>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              value={formik.values.name}
              label="Company Name"
              name="name"
              onChange={formik.handleChange}
              error={Boolean(formik.errors.name)}
            />

            {formik.errors.name && (
              <FormHelperText sx={{ color: "error.main" }}>
                {formik.errors.name}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              label="Company Code"
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.code)}
            />

            {formik.errors.code && (
              <FormHelperText sx={{ color: "error.main" }}>
                {formik.errors.code}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              type="text"
              label="Address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.address)}
            />

            {formik.errors.address && (
              <FormHelperText sx={{ color: "error.main" }}>
                {formik.errors.address}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel>Company Status</InputLabel>
            <Select
              label="Company Status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.status)}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Deactivate</MenuItem>
            </Select>

            {formik.errors.status && (
              <FormHelperText sx={{ color: "error.main" }}>
                {formik.errors.status}
              </FormHelperText>
            )}
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              sx={{ mr: 3 }}
            >
              Submit
            </Button>
            <Button
              size="large"
              variant="outlined"
              color="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarAddUser;
