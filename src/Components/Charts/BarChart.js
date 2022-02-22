import React, {useEffect} from "react";
import { Chart } from "react-google-charts";
import Firebase from "../Firebase/Firebase";
import {useListVals} from "react-firebase-hooks/database";

const data = [
    ["City", "2010 Population", "2000 Population"],
    ["New York City, NY", 8175000, 8008000],
    ["Los Angeles, CA", 3792000, 3694000],
    ["Chicago, IL", 2695000, 2896000],
    ["Houston, TX", 2099000, 1953000],
    ["Philadelphia, PA", 1526000, 1517000],
];

const options = {
    title: "Revenue vs expense",
    chartArea: { width: "50%" },
    hAxis: {
        title: "Revenue",
        minValue: 0,
    },
    vAxis: {
        title: "Project",
    },
};

const dbRef = Firebase.database().ref('System/Projects');
const userRef = Firebase.database().ref('System/Users');
export function BarChart() {
    const [projects] = useListVals(dbRef);
    const [users] = useListVals(userRef);

    useEffect(() => {
        var tempArray = [];
        if(projects){
            var columnArray = ["Project", "Revenue", "Expense"];
            tempArray.push(columnArray);

            projects.map((project) => {
                var revenue = project.amount;
            })

        }

    }, [projects])

    return (
        <Chart
            chartType="BarChart"
            width="100%"
            height="400px"
            data={data}
            options={options}
        />
    );
}
