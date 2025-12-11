import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const imageURLs = {
  wall1: "https://images.ctfassets.net/s699s7kh1jys/1WtJwqt7rpVxLp5NbgFQFI/a3f4f597b72e726041870bd69a270484/porsche_911_wallpapers_carrera_gts_2_desktop.jpg",
  wall2: "https://images.ctfassets.net/s699s7kh1jys/3vRxIaN45HiOejDXcdWaRK/0ec8a537ecf89284992ee6bb92315e71/porsche_911_wallpapers_carrera_gts_1_desktop.jpg",
  wall3: "https://images.ctfassets.net/s699s7kh1jys/63ZVpMyNuQnEbx57zEz78V/a5e40fef137c0ba6cfb383de7466696a/taycan_wallpaper_gts_desktop_1.jpg",
  wall4: "https://images.ctfassets.net/s699s7kh1jys/2PifzS162Gj5mosjr7YMu8/1cf25273d53964a32035c010b8ba37ba/taycan_wallpaper_gts_desktop_2.jpg",
  wall5: "https://images.ctfassets.net/s699s7kh1jys/569MnSxPDP7Xo0F86Pjvpo/d33cc0f952568a1d345faa441b4a34cb/recharge_guide_download_zen_porsche_wallpapers_6.jpg",
  wall6: "https://images.ctfassets.net/s699s7kh1jys/4c1iuDCInqkWmVEGel6U7O/407b596a24d514275e8b534bbf5a3fa3/recharge_guide_download_zen_porsche_wallpapers_7.jpg",
  wall7: "https://images-porsche.imgix.net/-/media/B4897100F6C449E0B6F80592364DB8A7_9FCCFA0F06F34ED193CC6CB1D2A410C3_MA24T4BOX0007_KV_16zu9_cmyk",
  wall8: "https://images-porsche.imgix.net/-/media/9E5C501E0F89466B89663E43645D3129_F776B7E09A35489A81F848AEE923BC1E_MA24T4BOX0015_cmyk"
};





const ImageCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
  };

  const images = Object.values(imageURLs);

  return (
    <div style={{ width: "1500px"}}>
      <Slider {...settings}>
        {images.map((src, i) => (
          <div key={i}>
            <img
              src={src}
              alt={`slide-${i}`}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageCarousel;
