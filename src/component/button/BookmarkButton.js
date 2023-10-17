import React, { useState } from "react";
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import axios from 'axios';

const LikeButton = (props) => {
  return (
      <svg cursor={'pointer'} stroke="currentColor" fill="currentColor" strokeWidth="0" height="24" width="24">
        <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"
        stroke={props.isBookmarked ? "#ffbf00" : "currentColor"}
        fill={props.isBookmarked ? "#ffbf00" : "none"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
      </svg>
  );
}

export default LikeButton;