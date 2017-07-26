///e_oauth OAuth认证实体
module.exports = {
    tableName: 'e_oauth',
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        name: {
            type: 'string',
            size: 200
        },
        domain: { //授权域名,多个用逗号隔开
            type: 'string',
            size: 1000
        },
        ip: { //授权IP
            type: 'string',
            size: 1000
        },
        appId: { //应用第三方ID
            type: 'string',
            size: 50
        },
        appSecret: { //应用第三方Secret
            type: 'string',
            size: 50
        },
        status: { //可用状态(0:不可用 1:可用)
            type: 'integer'
        },
        createTime: {
            type: 'datetime'
        }
    }
};