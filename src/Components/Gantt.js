import React, {useEffect, useState} from "react";
import { Chart } from "react-google-charts";
import Firebase from "./Firebase";
import {useListVals} from "react-firebase-hooks/database";

const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
];


const moment = require("moment");
const taskRef = Firebase.database().ref('System/Tasks');
const Gantt = (props) => {
    
    const [projectID, setProjectID] = useState(props.projectID);
    const [tasks, loading, error] = useListVals(taskRef);
    const [rows, setRows] = useState([]);
    
    useEffect(() => {
        setProjectID(props.projectID)
        if(tasks){
            var rowArray = [];
           var tasksArray = tasks.filter(x => x.projectID === props.projectID);
           tasksArray.map((task, index) => {
              var rowItem = [task.taskID, task.title, task.description, moment(task.startDate, "YYYY-MM-DDTh:mm").toDate(),
                  moment(task.deadline, "YYYY-MM-DDTh:mm").toDate(), null,
                  (task.taskStatus === "Complete" ? 100 : task.taskStatus === "Ongoing" ? 50 : 0), null];
              rowArray.push(rowItem);
           });

           console.log(rowArray);
           setRows(rowArray);
        }
        
    }, [props.projectID, tasks])
    

    const ganttData = [columns, ...rows];
    const options = {
        gantt: {
            trackHeight: 50,
        },
    };
    
    return (
        <Chart
            chartType="Gantt"
            width="100%"
            height="100%"
            data={ganttData}
            options={options}
        />
    );
}

export default Gantt;
