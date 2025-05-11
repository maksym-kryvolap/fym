import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { NavigationBar } from "./NavigationBar/NavigationBar";
import { Container } from "react-bootstrap";
import brightnessIcon from "../assets/brightness.png";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/redux/store/store";
import { setBrightnessValue } from "@/redux/slices/settings.slice";

export const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [showBrightness, setShowBrightness] = useState(false);

  const { brightnessValue } = useSelector(
    ({ settingsData }: IRootState) => settingsData
  );

  const divBrightnessRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const overlay = document.getElementById("overlay");
    const slider = document.getElementById("opacitySlider") as HTMLInputElement;

    if (!overlay || !slider) return;

    overlay.style.backgroundColor = `rgba(0, 0, 0, ${
      1 - +brightnessValue / 100
    })`;

    const handleSliderChange = () => {
      const opacity = parseInt(slider.value, 10) / 100;

      if (overlay) {
        overlay.style.backgroundColor = `rgba(0, 0, 0, ${1 - opacity})`;

        dispatch(setBrightnessValue(`${opacity * 100}`));
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        divBrightnessRef.current &&
        !divBrightnessRef.current.contains(event.target as Node)
      ) {
        setShowBrightness(false);
      }
    };

    slider.addEventListener("input", handleSliderChange);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      slider.removeEventListener("input", handleSliderChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="d-flex flex-column layout position-relative">
      <div className="layout__background">
        <div id="overlay" className="layout__background-overlay" />

        <Image
          src="/bgImage.webp"
          alt="background"
          fill
          placeholder="blur"
          blurDataURL="/bgImage-blur.webp"
          style={{
            zIndex: -1,
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          priority
        />
      </div>

      <NavigationBar />

      <main className="d-flex flex-column flex-grow-1">
        <Container className="d-flex flex-grow-1 px-2">{children}</Container>
      </main>

      <div
        className="d-flex flex-column justify-content-center align-items-center rounded-5 position-absolute layout__brightness"
        ref={divBrightnessRef}
      >
        <input
          type="range"
          id="opacitySlider"
          min="40"
          max="100"
          defaultValue={brightnessValue}
          className="mb-2 layout__brightness-input"
          style={{
            opacity: showBrightness ? 1 : 0,
            visibility: showBrightness ? "visible" : "hidden",
          }}
        />

        <button
          className="d-flex justify-content-center align-items-center rounded-5 layout__brightness-button"
          style={{
            background: showBrightness
              ? "rgb(119, 171, 248)"
              : "rgb(192, 204, 223)",
          }}
          onClick={() => setShowBrightness(!showBrightness)}
        >
          <Image
            src={brightnessIcon}
            alt="Brightness Icon"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
};
