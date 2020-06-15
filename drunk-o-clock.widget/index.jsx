
import { styled } from "uebersicht";
import { Swears, Words } from "./swears.mjs";
import { Multiples, Digits, Tens, Days } from "./time.mjs";

export const className = `
    top: 100px;
    left: 26px;
    text-align: right;
    max-width: 450px;
    color: #fff;
    font-family: Helvetica Neue;
`

const Wrapper = styled("div")``;

const TimeWrapper = styled("div")`
    text-transform: uppercase;
    font-weight: 50;
    font-size: 3vw;
    word-spacing: 450px;
`
;
const SwearDayWrapper = styled("div")`
    font-size 1vw;
    font-weight: 10;
`
;
const getHourAsString = (hour) => {
    // Check the current hr and get a String
    return Digits[hour % 12];
}

const getAppropriateSaying = (prevMinute, minute, currentSaying) => {
    if (prevMinute != minute) {
        currentSaying = Swears[Math.floor(Math.random() * Swears.length)];
    }
    return currentSaying
}

const getMinuteString = (minute) => {
    // Start of a new hour, no minutes avail
    if( (minute == 0) ) {
        // When an hour just started, get o, clock instead
        return "o, clock";
        // Multiple of 10, like 20 minutes, 30 minutes
    } else if(minute % 10 == '0') {
        return Multiples[minute / 10 - 1];
    // Single digit for minute, like 1, 2 or 3
    } else if (minute < 10) {
        return Digits[minute];
    } else if (minute > 10 && minute < 20){
            // when minute is 10 - 19 inclusive
            return Tens[minute % 10];
    } else {
        // final condition when the minute involves two strings
        let string1 = Multiples[Math.floor(minute / 10 - 1)];
        let string2 = Digits[minute % 10];
        return [string1, string2].join(" ");
    }
}

const getAppropriateSwear = () => {
    return Words[Math.floor(Math.random() * Words.length)]
}

const getSwearDay = (prevDay, day, currentSwearDay) => {
    if (prevDay != day || currentSwearDay == "") {
        currentSwearDay = getAppropriateSwear() + ", it's " + Days[day];
    }
    return currentSwearDay
}

const updateTime = ({time, minute, currentSaying, day, swearDay}) => {
    let date = new Date();
    let newHour = date.getHours();
    let newMinute = date.getMinutes();
    let newDay = date.getDay();
    time = [];

    let newSaying = getAppropriateSaying(minute, newMinute, currentSaying)
    let newDaySaying = getSwearDay(day, newDay, swearDay);
    time.push(getHourAsString(newHour));
    time.push(newSaying);
    time.push(getMinuteString(minute));

    return {
        time: time,
        hour: newHour,
        minute: newMinute,
        currentSaying: newSaying,
        day: newDay,
        swearDay: newDaySaying,
    };
}

// Uber stuff
export const initialState = {
    time: [],
    swearDay: "",
    day: 0,
    hour: 0,
    minute: 0,
    currentSaying: Swears[Math.floor(Math.random() * Swears.length)],
};

// Command
export const command = (dispatch) => {
    dispatch(initialState)
};

// Update state
export const updateState = (props, previousState) => {
    return updateTime(previousState);
}

// Render
export const render = ({time, swearDay}, dispatch) => {

    return (
        <Wrapper>
            <SwearDayWrapper>{ swearDay }</SwearDayWrapper>
            <TimeWrapper>{time.join(" ")}</TimeWrapper>
        </Wrapper>
    );
};

export const refreshFrequency = (1000 * 10);
