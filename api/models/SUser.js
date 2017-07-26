///s_user用户实体
module.exports = {
    tableName: 's_user',
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        loginName: {
            type: 'string',
            size: 150
        },
        loginPwd: {
            type: 'string',
            size: 150
        },
        realName: {
            type: 'string',
            size: 150
        },
        sex: {
            type: 'integer'

        },
        mobile: {
            type: 'string',
            size: 50
        },
        email: {
            type: 'string',
            size: 50
        },
        state: {
            type: 'integer'
        }
    }
};