import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroSlider = ({ images, onSlideChange }) => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (_, next) => {
      if (onSlideChange) onSlideChange(next);
    },
  };

  return (
    <Slider {...settings} className="w-100">
      {images.map((img, idx) => (
        <div
          key={idx}
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100%" }}
        >
          <img
            src={img}
            alt={`Hero ${idx}`}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
            className="img-fluid"
          />
        </div>
      ))}
    </Slider>
  );
};

export default HeroSlider;
