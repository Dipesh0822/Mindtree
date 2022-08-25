// ** MUI Imports
import Box from "@mui/material/Box";

// ** Type Import
import { Settings } from "src/@core/context/settingsContext";

// ** Components
import ModeToggler from "src/@core/layouts/components/shared-components/ModeToggler";
import Autocomplete from "src/@core/layouts/components/shared-components/Autocomplete";
import UserDropdown from "src/@core/layouts/components/shared-components/UserDropdown";
import LanguageDropdown from "src/@core/layouts/components/shared-components/LanguageDropdown";
import NotificationDropdown from "src/@core/layouts/components/shared-components/NotificationDropdown";

interface Props {
  hidden: boolean;
  settings: Settings;
  setShowBackdrop: (val: boolean) => void;
  saveSettings: (values: Settings) => void;
}
const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, setShowBackdrop } = props;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      <UserDropdown settings={settings} />
    </Box>
  );
};

export default AppBarContent;
