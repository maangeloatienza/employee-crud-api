const db = require('anytv-node-mysql');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const util = require('./../../utils/util');
const Global = require('./../../global_functions');
const Employee = require('./../../models/employee.model');

require('./../../misc/response_codes');

const reqBody = {
    first_name: '',
    last_name: '',
    email: '',
    title: '',
    role: ''
};

const optBody = {
    _first_name: '',
    _last_name: '',
    _email: '',
    _title: '',
    _role: ''
};

const index = (req,res,next)=> {

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = `LIMIT ${(page - 1) * limit}, ${limit}`;
    const {
        first_name,
        last_name,
        search,
        sort_desc,
        sort_id,
        role
    } = req.query;

    let where = ` WHERE employee.deleted IS null  `;

    if (sort_id) {
        where += `
            ORDER BY ${sort_id} ${sort_desc ? sort_desc : ASC}
        `;
    }

    if (first_name) {
        where += `
            AND employee.first_name = '${first_name}'
        `;
    }

    if (last_name) {
        where += `
            AND employee.last_name = '${last_name}'
        `;
    }

    if (search) {
        where += `
            AND employee.first_name LIKE '%${search}%' \
            OR employee.last_name LIKE '%${search}%' \
        `;
    }

    if (role) {
        where += `
            AND employee.role = '${role}'
        `;
    }
    
    let count = 0;

    Employee.count({
        where,
        offset,
        result : (err,data) => {
            count = data;
        }
    });

    Employee.index({
        where,
        offset,
        result: (err, data)=> {
            if (err) Global.fail(res, {
                message: FAILED_FETCH,
                context : err
            }, 500);

            Global.success(res, {
                data,
                count,
                page,
                limit,
                message: data.length ? 'Sucessfully retrieved employees' : NO_RESULTS
            }, data.length ? 200 : 203);
        }
    });
}

const show = (req, res, next) => {
    let id = req.params.id;
    
    Employee.show({
        id,
        result: (err, data) => {
            if (err) Global.fail(res, {
                message: FAILED_FETCH
            }, 500);

            else Global.success(res, {
                data,
                message: data ? 'Sucessfully retrieved employee' : NO_RESULTS
            }, data? 200 : 204);
        }
    });
}

const store = (req,res,next) => {
    const data =
        util._get
            .form_data(reqBody)
            .from(req.body);

    if(data instanceof Error){
        Global.fail(res,{
            message: INV_INPUT,
            context: INV_INPUT
        },500);
    }

    let where = ` WHERE 
                    employee.deleted IS null 
                AND 
                    employee.email='${data.email}'`;

    data.id = uuidv4();
    data.created = new Date();


    Employee.index({
        where,
        result: (err, employeeData) => {
            if (err) Global.fail(res, {
                message: FAILED_FETCH,
                context: err
            }, 500);

            if (employeeData.length) {
                return Global.fail(res, {
                    message: 'Email already exists',
                    context: ALREADY_EXISTS
                }, 204)
            }

            Employee.store({
                body: data,
                result: (err, data) => {
                    if (err) Global.fail(res, {
                        message: FAILED_TO_CREATE
                    }, 500);

                    else Global.success(res, {
                        data,
                        message: data ? 'Sucessfully added employee' : FAILED_TO_CREATE
                    }, data ? 200 : 400);
                }
            })
        }
    });
}

const update = (req, res, next) => {
    const data =
        util._get
            .form_data(optBody)
            .from(req.body);

    if (data instanceof Error) {
        Global.fail(res, {
            message: INV_INPUT,
            context: INV_INPUT
        }, 500);
    }

    const id = req.params.id;

    data.updated = new Date();

    Employee.update({
        id,
        body: data,
        result: (err, data) => {
            if (err) Global.fail(res, {
                message: FAILED_TO_UPDATE,
                context: err
            }, 500);

            else Global.success(res, {
                data,
                message: 'Sucessfully updated employee'
            }, 200);
        }
    })
    
}

const remove = (req,res,next) => {
    let id = req.params.id;

    Employee.delete({
        id,
        result : (err,data)=> {
            if (err) Global.fail(res, {
                message: FAILED_TO_DELETE,
                context: err
            }, 500);

            else Global.success(res, {
                data,
                message: 'Sucessfully deleted employee'
            }, 200)
        }
    });
}



module.exports = {
    index,
    show,
    store,
    update,
    remove
}