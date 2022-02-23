import React from 'react';
import { Table } from 'antd';

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
        title: 'Deadline',
        dataIndex: 'deadline',
        key: 'deadline',
    }
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
];

export function UpcomingTasks(){
    return(
        <Table style={{height: "400px"}} columns={columns} dataSource={data} pagination={false}/>
    )
}
