import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { SkylineSVG } from './skyline';
import { Link } from '@reach/router';

interface IHomeProps extends RouteComponentProps {

}

export const Home: FC<IHomeProps> = () => {
  return (
    <div className='home-container'>
      <div className='home-banner animate__animated animate__fadeInDown'>
        <h2><span>Welcome to</span> <br /><strong>Survey Town</strong></h2>
        <div className='home-actions'>
          <Link to='/surveys' className='btn btn-lg btn-primary my-4'>
            Browse Surveys
          </Link>
        </div>
      </div>
      <SkylineSVG className='animate__animated animate__fadeInUp home-skyline-image' />
    </div>
  );
};
