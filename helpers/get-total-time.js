export default function totalTime(time1, time2){
    let minutes1 = time1 && time1.min && parseInt(time1.min) || 0;
    let hInMinutes1 = time1 && time1.h && 60*parseInt(time1.h) || 0;
    let minutes2 = time2 && time2.min && parseInt(time2.min) || 0;
    let hInMinutes2 = time2 && time2.h && 60*parseInt(time2.h) || 0;
    let minutes = hInMinutes1 + hInMinutes2 + minutes1 + minutes2;
    let hours = (minutes - minutes%60)/60;

    return { 
        h: hours,
        min: minutes%60
    };
}