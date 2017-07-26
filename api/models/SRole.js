///s_role角色实体
module.exports = {
    tableName: 's_role',
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        name: {
            type: 'string',
            size: 100
        },
        code: {
            type: 'string',
            size: 100
        },
        description: {
            type: 'string',
            size: 500
        },
        state: {
            type: 'boolean'
        },
        createTime: {
            type: 'datetime'
        },
        isDelete: {
            type: 'boolean'
        }
    }
};
