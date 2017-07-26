///s_setting系统设置实体
module.exports = {
    tableName: 's_setting',
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        pop3: {
            type: 'string',
            size: 200
        },
        smtp: {
            type: 'string',
            size: 200
        },
        pop3_ssl: {
            type: 'boolean'
        },
        smtp_ssl: {
            type: 'boolean'

        },
        pop3_port: {
            type: 'integer'
        },
        smtp_port: {
            type: 'integer'
        },
        fromName: {
            type: 'string',
            size: 150
        },
        fromAddress: {
            type: 'string',
            size: 150
        }
    }
};