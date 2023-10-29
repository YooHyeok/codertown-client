/**
 * UTC 포맷팅 형식을 한국 시간:분 오전/오후 를 포함하는 형태로 변환하는 메소드
 * 원본 형태 : YYYY-MM-DDTHH:mm:ss.ssssss
 * 변환 형태 : YYYY-MM-DD HH:mm dayPeriod
 */
export const utcToKrFull = (date) => {
    const options = {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true
    };
    const [ 
        { value: month },, 
        { value: day },, 
        { value: year },, 
        { value: hour },, 
        { value: minute },, 
        { value: dayPeriod }
    ] = new Intl.DateTimeFormat('en-US', options).formatToParts(new Date(date));
    return `${year}-${month}-${day} / ${hour}:${minute} ${dayPeriod}`;
}

export const utcToKrYMD = (date) => {
    const options = {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true
    };
    const [ 
        { value: month },, 
        { value: day },, 
        { value: year },, 
        { value: hour },, 
        { value: minute },, 
        { value: dayPeriod }
    ] = new Intl.DateTimeFormat('en-US', options).formatToParts(new Date(date));
    return `${year}-${month}-${day}`;
}