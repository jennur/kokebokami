export default function getDateString(ISODateString){
    let milliseconds = Date.parse(ISODateString);
    let date = new Date(milliseconds);
    date = new Date(date);
    let time = date.toLocaleTimeString('en-GB', { timeZone: 'UTC', timeZoneName: 'short', hour: '2-digit', minute: '2-digit' });
    let day = date.toLocaleDateString({ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return `${day} ${time}`;
}