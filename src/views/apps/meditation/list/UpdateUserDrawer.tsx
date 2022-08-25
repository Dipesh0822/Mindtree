// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";

import Image from "next/image";

// ** Third Party Imports
import * as yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";

// ** Icons Imports
import Close from "mdi-material-ui/Close";

interface SidebarAddUserType {
  open: boolean;
  toggle: (data: any) => void;
  data: any;
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  title: yup.string().required(),
  subtitle: yup.string().required(),
  text: yup.string().required(),
  // musicUpload: yup.mixed().required("Music is required"),
  // imageUpload: yup.mixed().required("Image is required"),
});

const SidebarAddUser = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, data } = props;

  const formik = useFormik({
    initialValues: {
      text: "",
      title: "",
      subtitle: "",
      musicUpload: "",
      imageUpload: "",
      id: "",
    },
    validationSchema: schema,
    onSubmit: (values: any) => {
      updateMeditationWithJsonData(
        {
          TITLE: values.title,
          SUBTITLE: values.subtitle,
          TEXT: values.text,
        },
        parseInt(values.id)
      );

      if (values.imageUpload) {
        const imgData = new FormData();
        imgData.append("IMAGEUPLOAD", values.imageUpload);
        updateMeditationWithImageFile(imgData, parseInt(values.id));
      }

      if (values.musicUpload) {
        const musicData = new FormData();
        musicData.append("MUSICUPLOAD", values.musicUpload);
        musicData.append("MEDITATION_ID", values.id);
        updateMeditationWithMusicFile(musicData);
      }
      handleClose();
    },
  });

  useEffect(() => {
    if (data !== undefined && data !== null && Object.keys(data).length) {
      formik.setFieldValue("title", data.TITLE);
      formik.setFieldValue("subtitle", data.SUBTITLE);
      formik.setFieldValue("text", data.TEXT);
      formik.setFieldValue("id", data.MEDITATION_ID);
      formik.validateForm();
    }
  }, [data]);

  const updateMeditationWithJsonData = async (data: any, id: number) => {
    try {
      const res = await fetch(
        `http://54.226.108.109:3000/admin/meditation/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.status === 200) {
        const result = await res.json();
        if (result.status) {
          toast.success("Meditation created successfully");
        }
      }
    } catch (err: any) {
      toast.error("Something went wrong. Please try again");
      console.log(err);
    }
  };
  const updateMeditationWithMusicFile = async (data: any) => {
    try {
      const res = await fetch("http://54.226.108.109:3000/admin/meditation", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      });
      if (res.status === 200) {
        const result = await res.json();
        if (result.status) {
          toast.success("Meditation created successfully");
        }
      }
    } catch (err: any) {
      toast.error("Something went wrong. Please try again");
      console.log(err);
    }
  };

  const updateMeditationWithImageFile = async (data: any, id: number) => {
    try {
      const res = await fetch(
        `http://54.226.108.109:3000/admin/meditation/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: data,
        }
      );
      if (res.status === 200) {
        const result = await res.json();
        if (result.status) {
          toast.success("Meditation created successfully");
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
        <Typography variant="h6">Update Meditation</Typography>
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
              value={formik.values.title}
              label="Title"
              name="title"
              onChange={formik.handleChange}
              placeholder="Title"
              error={formik.touched.title && Boolean(formik.errors.title)}
            />

            {formik.errors.title && formik.touched.title && (
              <FormHelperText sx={{ color: "error.main" }}>
                {formik.errors.title}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              label="Subtitle"
              name="subtitle"
              value={formik.values.subtitle}
              onChange={formik.handleChange}
              placeholder="johndoe"
              error={formik.touched.subtitle && Boolean(formik.errors.subtitle)}
            />

            {formik.touched.subtitle && formik.errors.subtitle && (
              <FormHelperText sx={{ color: "error.main" }}>
                {formik.errors.subtitle}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              type="text"
              label="Text"
              name="text"
              value={formik.values.text}
              onChange={formik.handleChange}
              error={formik.touched.text && Boolean(formik.errors.text)}
            />

            {formik.touched.text && formik.errors.text && (
              <FormHelperText sx={{ color: "error.main" }}>
                {formik.errors.text}
              </FormHelperText>
            )}
          </FormControl>

          <Box sx={{ mb: 6 }}>
            <InputLabel>Music</InputLabel>
            <TextField
              type="file"
              name="musicUpload"
              // onChange={onChange}
              error={Boolean(formik.errors.musicUpload)}
            />

            {formik.errors.musicUpload && (
              <FormHelperText sx={{ color: "error.main" }}>
                {formik.errors.musicUpload}
              </FormHelperText>
            )}
          </Box>

          <Box sx={{ mb: 6 }}>
            {/* {formik.values.imageUpload && (
              <Box sx={{ m: 3 }}>
                <Image src={formik.values.imageUpload} />
              </Box>
            )} */}
            <InputLabel>Image</InputLabel>
            <TextField
              type="file"
              name="imageUpload"
              // onChange={onChange}
              error={Boolean(formik.errors.imageUpload)}
            />

            {formik.errors.imageUpload && (
              <FormHelperText sx={{ color: "error.main" }}>
                {formik.errors.imageUpload}
              </FormHelperText>
            )}
          </Box>

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
