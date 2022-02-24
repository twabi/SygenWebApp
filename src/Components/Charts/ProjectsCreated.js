import React, {useEffect, useState} from "react";
import { Chart } from "react-google-charts";
import Firebase from "../Firebase/Firebase";
import {useListVals} from "react-firebase-hooks/database";

export const data = [
    ["Year", "Sales", "Expenses"],
    ["2004", 1000, 400],
    ["2005", 1170, 460],
    ["2006", 660, 1120],
    ["2007", 1030, 540],
];

export const options = {
    curveType: "function",
    legend: { position: "bottom" },
};

const projRef = Firebase.database().ref('System/Projects');
const moment = require("moment");
export function ProjectsCreated() {
    var previousSixMonths = function(){
        let n = 0;
        let arRet = [];

        for(; n < 6; n++)
            arRet.push(moment().subtract(n, 'months').format('MMM'));
        return(arRet)
    }();
    const [projects, loading, error] = useListVals(projRef);
    const [dataArray, setDataArray] = useState([]);

    useEffect(() => {
        var tempArray = [];
        var columnArray = ["Month", "# of projects"];
        tempArray.push(columnArray);
        if(projects){
            console.log(previousSixMonths);
            previousSixMonths.reverse().map((month) => {

                var m = moment(month, "MMM");
                var array = projects.filter(x => moment(x.dateCreated, "YYYY-MM-DDTh:mm:ss").format("MMM") === m.format("MMM"))
                console.log(month, array);
                var dataColumn = [month, array.length];
                tempArray.push(dataColumn);
            });

            setDataArray([...tempArray]);

        }

    }, [projects]);
    return (
        <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            loading={loading}
            data={dataArray}
            options={options}
        />
    );
}
