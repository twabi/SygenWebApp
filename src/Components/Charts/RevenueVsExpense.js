import React, {useEffect, useState} from "react";
import { Chart } from "react-google-charts";
import Firebase from "../Firebase/Firebase";
import {useListVals} from "react-firebase-hooks/database";

const options = {
    chartArea: { width: "70%", left:'20%', right:'19%',},
    hAxis: {
        title: "Revenue",
        minValue: 0,
    },
    vAxis: {
        title: "Project",
    }
};

const dbRef = Firebase.database().ref('System/Projects');
const userRef = Firebase.database().ref('System/Users');
export function RevenueVsExpense() {
    const [projects] = useListVals(dbRef);
    const [users] = useListVals(userRef);
    const [dataArray, setDataArray] = useState([]);

    useEffect(() => {
        var tempArray = [];
        if(projects){
            var columnArray = ["Project", "Revenue", "Expense"];
            tempArray.push(columnArray);

            projects.map((project) => {
                var revenue = parseFloat(project.amount);
                var members = project.members;
                var memberSum = 0;
                var budget = project.budget ? project.budget : 0;
                members.map((item) => {
                    var member = users[users.findIndex(x => x.userID === item)];
                    var percentage = member&&parseFloat(member.percentage);
                    memberSum += percentage;
                });

                var memberExpense = (memberSum/100) * revenue;
                var totalExpense = memberExpense + parseFloat(budget);
                
                tempArray.push([project.name, revenue, totalExpense]);
            });

            setDataArray([...tempArray]);

        }

    }, [projects, users])

    return (
        <Chart
            chartType="BarChart"
            width="100%"
            className="w-100"
            height="400px"
            data={dataArray}
            options={options}
        />
    );
}
