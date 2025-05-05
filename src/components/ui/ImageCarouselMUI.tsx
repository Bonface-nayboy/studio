// components/ImageCarouselMUI.tsx
import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";

interface ImageCarouselMUIProps {
  imageUrls: string[];
  productName: string;
}

const ImageCarouselMUI = ({ imageUrls, productName }: ImageCarouselMUIProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : imageUrls.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  return (
    <Box position="relative" display="flex" justifyContent="center" alignItems="center">
      <IconButton
        onClick={handlePrev}
        sx={{ position: "absolute", left: 10, zIndex: 10, bgcolor: "white", "&:hover": { bgcolor: "grey.200" } }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <Box position="relative" width="100%" maxWidth="600px" height={{ xs: 256, md: 320, lg: 384 }}>
        <Image
          src={imageUrls[currentIndex] || "https://picsum.photos/seed/placeholder/400/300"}
          alt={`${productName} - Image ${currentIndex + 1}`}
          fill
          style={{ objectFit: "contain" }}
        />
      </Box>

      <IconButton
        onClick={handleNext}
        sx={{ position: "absolute", right: 10, zIndex: 10, bgcolor: "white", "&:hover": { bgcolor: "grey.200" } }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default ImageCarouselMUI;
