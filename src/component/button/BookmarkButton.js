import React, { useState } from "react";
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import axios from 'axios';



const LikeButton = (props) => {
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const userId = useSelector((state) => { return state.UserId });
  const recruitNo = props.recruitNo;

  const submit = (e) => {
    if (userId == '') {
      alert('북마크 기능을 이용하시려면 로그인이 필요합니다.');
      return;}
    const formData = new FormData();
    formData.append('recruitNo', recruitNo);
    formData.append('userId', userId);

    axios.post('/recruit-bookmark-toggle', formData)
      .then((response) => {
        console.log(response.data);
          alert(response.data.success ? "북마크에 추가되었습니다." : "북마크 해제 되었습니다.");
      })
      .catch((error) => {
        console.log(error);
      })
    setIsLiked(!isLiked);

  }

  return (
      <svg cursor={'pointer'} stroke="currentColor" fill="currentColor" strokeWidth="0" height="24" width="24" onClick={submit}>
        <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"
        stroke={isLiked ? "#ffbf00" : "currentColor"}
        fill={isLiked ? "#ffbf00" : "none"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
      </svg>
  );
}

export default LikeButton;