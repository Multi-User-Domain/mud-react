import {useEffect, useState} from "react";
import { Box, Text } from "@chakra-ui/react"
const { v4: uuidv4 } = require('uuid');

interface ITimerProgressBar {
    startTime: number;
    endTime: number;
    barColor?: string;
    containerStyles?: object;
    updateFrequencyMillis?: number;
};

const defaultContainerStyles = {
    height: 20,
    width: "inherit",
    backgroundColor: "#e0e0de",
    borderRadius: "10%",
    margin: 50,
};

/**
 * A component which displays the progress of the current system time between startTime and endTime
 * @param barColor: optional background color for the bar
 */
export default function TimerProgressBar({startTime, endTime, barColor="#000000", containerStyles=defaultContainerStyles, updateFrequencyMillis=1000} : ITimerProgressBar) : React.ReactElement {

    const [completed, setCompleted] = useState(0); // % completion
    const [id, setId] = useState(null); // an ID assigned randomly when the input parameters are changed (to reset the timer)

    const tick = (uuid: string) => {
        console.log("uuid " + uuid + ", id " + id);
        if(uuid != id) return; // cancel if a new timer has been set

        //set the completed value to be the percentage between startTime and endTime
        const now = new Date().getTime();
        const timeSinceStart = now - startTime;
        if(timeSinceStart >= 0 && endTime > 0) {

            //calculate percentage of timeDiff met
            const timeDiff = endTime - startTime;
            const percentageDone = timeSinceStart / timeDiff * 100;
            console.log(percentageDone + "%");
            setCompleted(Math.min(percentageDone, 100));
            if(percentageDone >= 100) {
                console.log("timer done!");
                return; // timer done
            }
        }

        //reschedule self
        setTimeout(() => tick(uuid), updateFrequencyMillis);
    }

    // if startTime or endTime has changed then re-initialize the bar
    useEffect(() => {
        const uuid = uuidv4();
        console.log(uuid);
        setTimeout(() => setId(uuid), 1000);
    }, [startTime, endTime]);

    useEffect(() => {
        if(id == null) return;
        setTimeout(() => tick(id), updateFrequencyMillis);
    }, [id]);

    //TODO: include task description
    const label: string = completed >= 100 ? "DONE" : "BUSY";

    return (
        <Box style={containerStyles}>
            <Box backgroundColor={barColor} width={completed + "%"} height="100%" borderRadius="inherit" transition="width 1s ease-in-out">
                <Text color="white" overflow="hidden" padding="10%" zIndex="1">{label}</Text>
            </Box>
        </Box>
    );
};