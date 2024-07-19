import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next"; 
import { NepalFlagSlider } from "./NepalFlagSlider/NepalFlagSlider";
import { Link } from "react-router-dom";
import { HomePageFooter } from "./HomePageFooter/HomePageFooter";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "../AlertLoader";
import i18next from "i18next";
import { addLanguage, fetchBgVideoToUrl, fetchGifToURL } from "../ReuseableFunctions";
import { setBgVideo, setHomePageWholeDetail, setSliderImg } from "../../state/HomePageSlice";

export const HomePage = () => {
  const { t } = useTranslation(); 
  const isMobile = useMediaQuery('(max-width:800px)');
  const baseUrl = useSelector(state => state.baseUrl).backend;
  const homePageDetail = useSelector(state => state.homePageDetail);
  const dispatch = useDispatch();
  const [bgVideoUrl, setBgVideoUrl] = useState();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get(baseUrl + 'api/pages/home-page/');
        const data = response.data.components;
        dispatch(setHomePageWholeDetail(data));
        addLanguage({ key: 'welcome-to-guthi-sansthan', lngs: data['welcome-to-guthi-sansthan'].text });
        dispatch(setSliderImg({ gif: await fetchGifToURL(baseUrl + data['slider-img'].image.substr(1)) }));
        const video = await fetchBgVideoToUrl(baseUrl + data['bg-video'].video);
        setBgVideoUrl(video);
        dispatch(setBgVideo({ video: video }));
      } catch (error) {
        console.log(error);
        showAlert(error, 'red');
      }
    };

    if (!homePageDetail.isFetched) fetchHomeData();
  }, [baseUrl, dispatch, homePageDetail.isFetched]);

  return (
    <div style={{ height: `${isMobile ? 'calc(100vh - 80px)' : 'calc(100vh - 100px)'}` }}>
      {bgVideoUrl && (
        <video
          key={bgVideoUrl} // Add key prop to force re-render
          autoPlay
          loop
          muted
          className="top-0 video-background absolute inset-0 w-full h-full object-cover -z-30"
        >
          <source src={bgVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20"></div>
      
      <div className="flex flex-col items-center justify-center h-full relative overflow-hidden">
        <NepalFlagSlider />
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'}  gap-4 px-5 w-full`}>
          <Link
            to="/sign-in"
            className={`${isMobile ? 'text-xs p-2 px-3' : 'p-3 px-5'} no-underline text-white font-bold bg-blue-800 rounded-full cursor-pointer hover:bg-blue-900 z-20`}
          >
            {t('sign-in')}
          </Link>
        </div>
        <HomePageFooter />
      </div>
    </div>
  );
};
