const db = require('anytv-node-mysql');
const Global = require('./../global_functions');


const Employee = function(employee){
    this.employee = employee;
};

Employee.index = async ({fetchAll = false ,where = '', offset = '', result }) => {
    let query = `SELECT \
            employee.id AS id, \
            employee.first_name,\
            employee.last_name, \
            employee.email, \
            employee.title, \
            employee.role, \
            employee.created, \
            employee.updated, \
            employee.deleted \
            FROM employees employee  \
            ${where} ${offset}`;

    let [err,employee] = await Global.exe(db.build(query).promise());
    if(err){
        console.log(`EMPLOYEE MODEL ERROR: `,err);
        result(err,null);
        return;
    }
    
    console.log(`EMPLOYEE DATA : `,employee);
    result(null, employee);
    
};


Employee.count = async ({ where = '', offset = '', result }) => {
    let query = `SELECT COUNT(*) AS total FROM employees employee ${where} ${offset}`;

    let [err, employee] = await Global.exe(db.build(query).promise());
    if (err) {
        console.log(`EMPLOYEE MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`EMployee count : `, employee[0].total);
    result(null, employee[0].total);
};

Employee.show = async ({id,where,result}) => {
    let query = `SELECT * FROM employees employee where id = '${id}'`;

    let [err,employee] = await Global.exe(db.build(query).promise());

    if (err) {
        console.log(`EMPLOYEE MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`EMPLOYEE DATA : `, employee[0]);
    result(null, employee[0]);
}   

Employee.store = async ({body,result}) => {
    let query = `INSERT INTO employees SET ?`;

    let [err,employee] = await Global.exe(db.build(query,body).promise());

    if (err) {
        console.log(`EMPLOYEE MODEL ERROR: `, err);
        result(err, null);
        return;
    }
    

    console.log(`EMPLOYEE DATA : `,{
        id: employee.insertId,
        ...body
    });
    result(null, {
        id : employee.insertId,
        ...body
    });
};

Employee.update = async ({ id, body, result }) => {
    let query = `UPDATE  employees  SET ? where id = '${id}'`;

    let [err, employee] = await Global.exe(db.build(query,body).promise());

    if (err) {
        console.log(`EMPLOYEE MODEL ERROR: `, err);
        result(err, null);
        return;
    }


    console.log(`EMPLOYEE UPDATED DATA: `, {
        id: id,
        ...body
    });

    result(null, {
        id: id,
        ...body
    });
} 

Employee.delete = async ({ id, result }) => {

    let body = {deleted : new Date()}
    let query = `UPDATE employees SET ? WHERE id = '${id}'`;
    console.log(query)
    let [err, employee] = await Global.exe(db.build(query,body).promise());

    if (err) {
        console.log(`EMPLOYEE MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`EMPLOYEE DELETED ID: `, {
        id
    });
    result(null, {
        id : id
    });
}



module.exports = Employee