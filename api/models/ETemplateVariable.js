///e_template_variable邮件模板变量实体
module.exports = {
    tableName: 'e_template_variable',
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        code: { //变量CODE
            type: 'string',
            size: 100,
            unique: true
        },
        description: { //描述
            type: 'string',
            size: 250
        },
        status: { //状态(0:不可用 1:可用)
            type: 'integer'
        }
    }
};