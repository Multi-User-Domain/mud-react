import {useEffect, useState} from "react";
import { Box, Progress, Text } from "@chakra-ui/react"
import { v4 as uuidv4 } from 'uuid';

interface ITimerProgressBar {
    startTime: number;
    endTime: number;
    barColor?: string;
    containerStyles?: object;
    updateFrequencyMillis?: number;
};

/**
 * A component which displays the progress of the current system time between startTime and endTime
 * @param barColor: optional background color for the bar
 */
export default function TimerProgressBar({startTime, endTime, updateFrequencyMillis=100} : ITimerProgressBar) : React.ReactElement {

    const [lastUpdateTime, setLastUpdateTime] = useState(new Date().getTime());

    useEffect(() => {
        setLastUpdateTime(new Date().getTime());
    
        const updateLastUpdateTime = setInterval(() => {
          const newLastUpdateTime = new Date().getTime();
          setLastUpdateTime(newLastUpdateTime);
    
          if (newLastUpdateTime > endTime) {
            clearInterval(updateLastUpdateTime);
          }
        }, updateFrequencyMillis);
    
        return () => clearInterval(updateLastUpdateTime);

    }, [startTime, endTime, updateFrequencyMillis, setLastUpdateTime]);

    const calculatePercentage = () => {
        const timeSinceStart = lastUpdateTime - startTime;

        if (timeSinceStart === 0) {
            return 0;
        }

        if (endTime === 0) {
            return 100;
        }

        const timeDiff = endTime - startTime;
        return Math.min(timeSinceStart / timeDiff, 1) * 100;
    }

    const completed = calculatePercentage();

    //TODO: include task description.. underneath?
    //const label: string = completed >= 100 ? "DONE" : "";

    return (
        //TODO: use stack? https://chakra-ui.com/docs/layout/stack
        <Progress h={8} w="100%" value={completed} />
        //TODO: reimplement text cue or colour change on task completion
        //  <Text color="white" overflow="hidden" padding="10%" zIndex="1" w="100%" h="100%">{label}</Text>
    );
};
