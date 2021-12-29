import React, {useEffect, useState} from "react";
import { Chart } from "react-google-charts";
import Firebase from "./Firebase";
import {useListVals} from "react-firebase-hooks/database";
import {MDBAlert} from "mdbreact";
import "jspdf-autotable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const pdfConverter = require('jspdf');
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

    const [showAlert, setShowAlert] = useState(false);
    const [projectID, setProjectID] = useState(props.projectID);
    const [tasks, loading, error] = useListVals(taskRef);
    const [rows, setRows] = useState([]);
    const [caller, setCaller] = useState(props.callback);
    
    useEffect(() => {
        setCaller(props.callback);
        setProjectID(props.projectID);
        if(props.callback){
            exportPDF("chart");
            props.call(false);
        }
        if(tasks){
            var rowArray = [];
           var tasksArray = tasks.filter(x => x.projectID === props.projectID);
           if(tasksArray.length === 0){
               setShowAlert(true);
           } else {
               setShowAlert(false);
               tasksArray.map((task, index) => {
                   var rowItem = [task.taskID, task.title, task.description, moment(task.startDate, "YYYY-MM-DDTh:mm").toDate(),
                       moment(task.deadline, "YYYY-MM-DDTh:mm").toDate(), null,
                       (task.taskStatus === "Complete" ? 100 : task.taskStatus === "Ongoing" ? 50 : 0), null];
                   rowArray.push(rowItem);
               });

               console.log(rowArray);
               setRows(rowArray);
           }

        }
        
    }, [props, props.callback, props.projectID, tasks])
    

    const ganttData = [columns, ...rows];
    const options = {
        gantt: {
            trackHeight: 50,
        },
    };

    
    //the functions that prints the table to pdf format
    const exportPDF = (title) => {
        const input = document.getElementById('gantt-chart');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'l', // landscape
                    unit: 'pt', // points, pixels won't work properly
                    format: [canvas.width, canvas.height] // set needed dimensions for any element
                });
                pdf.addImage(imgData, 'PNG', 10, 10);
                pdf.save(title + '.pdf');
                /*
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'PNG', 10, 10);
                //pdf.setFontSize(25);
                //pdf.autoTable({startY: 20, html: '#gantt-chart'});
                pdf.text(title, 50, 15);
                pdf.save(title + ".pdf");
                
                 */
            }).then(() => {
        });
    }
    
    return (
        <div id="gantt-chart">
            {showAlert?
                <>
                    <MDBAlert color={"danger"} className="my-3 font-italic" >
                        {"No Tasks to show. Add a task to display the Gantt Chart"}
                    </MDBAlert>
                </>
                : null }
            <Chart

                chartType="Gantt"
                width="100%"
                height="100%"
                data={ganttData}
                options={options}
            />
        </div>

    );
}

export default Gantt;
