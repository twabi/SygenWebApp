import React, {useEffect, useState} from 'react';
import {Table} from 'antd';
import Firebase from "../Firebase/Firebase";
import {useListVals} from "react-firebase-hooks/database";
import {Badge} from "evergreen-ui";


const columns = [
    {
        title: 'Task',
        dataIndex: 'task',
        key: 'task',
    },
    {
        title: 'Project',
        dataIndex: 'project',
        key: 'project',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Deadline',
        dataIndex: 'deadline',
        key: 'deadline',
    }
];

const moment = require("moment");
const taskRef = Firebase.database().ref('System/Tasks');
const projRef = Firebase.database().ref('System/Projects');
export function UpcomingTasks(){
    const [dataArray, setDataArray] = useState([]);
    const [tasks] = useListVals(taskRef);
    const [projects] = useListVals(projRef);
    
    useEffect(() => {
        if(tasks){
            var tempArray = [];
            var now = moment.now();
            var taskArray = tasks.filter(x => x.taskStatus !== "Complete");
            taskArray.forEach((task) =>{
                var taskDate = moment(task.deadline, "YYYY-MM-DDTh:mm");
                task.difference = now - taskDate
            });

            taskArray.sort((a,b) => {
                return a.difference - b.difference;
            });

            taskArray.forEach((task, index) =>{
                var deadline = moment(task.deadline, "YYYY-MM-DDTh:mm").format("DD MMM YYYY");
                tempArray.push({
                    key: index + 1,
                    task : task.title,
                    project : projects[projects.findIndex(x => x.projectID === task.projectID)]&&
                        projects[projects.findIndex(x => x.projectID === task.projectID)].name,
                    status : <Badge color={task.taskStatus === "Ongoing" ? "neutral" : "red"}>{task.taskStatus}</Badge>,
                    deadline : <Badge color={moment().isBefore(deadline) ? "green" : "red"}>{deadline}</Badge>
                });
            });
            const size = 5;
            const items = tempArray.slice(0, size)
            setDataArray([...items]);

        }
    }, [projects, tasks])
    return(
        <Table style={{height: "400px", width: "100%"}} columns={columns} dataSource={dataArray} pagination={false}/>
    )
}
