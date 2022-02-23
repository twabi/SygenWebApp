import React, {useEffect, useState} from "react";
import { Chart } from "react-google-charts";
import Firebase from "../Firebase/Firebase";
import {useListVals} from "react-firebase-hooks/database";


const options = {
    chartArea: { left:'10%', right:'10%',},
};
const dbRef = Firebase.database().ref('System/Projects');
const userRef = Firebase.database().ref('System/Users');
export function ProjectsPerMember() {
    
    const [dataArray, setDataArray] = useState([]);
    const [projects] = useListVals(dbRef);
    const [users] = useListVals(userRef);
    
    useEffect(() => {
        var tempArray = [];
        if(projects&&users){
            var columnArray = ["Member", "# of Projects"];
            tempArray.push(columnArray);
            var ongoing = projects.filter(x => x.status === "Ongoing");
            
            console.log(ongoing);
            users.map((user) => {
                if((user.role).toLowerCase() !== "team leader"){
                    var memberArray = ongoing.filter(x => x.members.includes(user.userID));
                    console.log(memberArray);
                    var projectNumber = memberArray.length;

                    var userCol = [user.firstname + " " + user.surname, projectNumber];
                    tempArray.push(userCol);
                }

            });

            setDataArray([...tempArray]);
        }
    }, [projects, users])
    return (
        <Chart
            chartType="PieChart"
            data={dataArray}
            options={options}
            width={"100%"}
            height={"400px"}
        />
    );
}
