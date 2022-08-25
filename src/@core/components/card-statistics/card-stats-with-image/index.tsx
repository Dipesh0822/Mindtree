// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Image from "next/image";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";

// ** Types Imports
import { CardStatsCharacterProps } from "src/@core/components/card-statistics/types";

interface Props {
  data: CardStatsCharacterProps;
  title: string;
  src: string;
}

// ** Styled component for the image
// const Img = styled("img")({
//   right: 7,
//   bottom: 0,
//   height: 177,
//   position: "absolute",
// });

const CardStatsCharacter = ({ data, title, src }: Props) => {
  // ** Vars
  // const { title, chipColor, chipText, src, stats, trend, trendNumber } = data;

  return (
    <Card sx={{ overflow: "visible", position: "relative" }}>
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack
          sx={{
            mb: 1.5,
            // rowGap: 1,
            width: "55%",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <Typography sx={{ mb: 6.5, fontWeight: 600 }}>{title}</Typography>
          <Typography variant="h4" sx={{ mr: 1.5 }}>
            {data}
          </Typography>
        </Stack>

        <Image src={src} alt={title} height={50} width={80} />
      </CardContent>
    </Card>
  );
};

export default CardStatsCharacter;

CardStatsCharacter.defaultProps = {
  trend: "positive",
  chipColor: "primary",
};
