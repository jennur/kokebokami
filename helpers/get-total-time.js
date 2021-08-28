export default function totalTime(time1, time2){
    let minutes1 = time1 && (60*parseInt(time1.h) + parseInt(time1.min)) || 0;
    let minutes2 = time2 && (60*parseInt(time2.h) + parseInt(time2.min)) || 0;
    let minutes = minutes1 + minutes2;
    let hours = (minutes - minutes%60)/60;

    return { 
        h: hours,
        min: minutes%60
    };
}