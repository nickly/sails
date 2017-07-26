///e_outbox 发件箱实体
module.exports = {
    tableName: 'e_outbox',
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        categoryId: { //模板分类
            model: 'ETemplateCategory'
        },
        fromEmail: { //发送人Email
            type: 'string',
            size: 200
        },
        fromName: { //发送人名称
            type: 'string',
            size: 200
        },
        recipient: { //收信人，多人以逗号隔开
            type: 'string',
            size: 2000
        },
        subject: { //主题
            type: 'string',
            size: 200
        },
        contentType: { //邮件格式(0:Text 1:HTML)默认0
            type: 'integer'
        },
        content: { //邮件内容
            type: 'longtext'
        },
        createTime: { //创建时间
            type: 'datetime'
        },
        status: { //发送状态(-2:取消发送 -1:失败 0:待发送 1:成功)
            type: 'integer'
        },
        sendTime: { //设定发送时间
            type: 'datetime'
        },
        isTime: { //是否为定时任务
            type: 'integer'
        },
        actualSendTime: { //实际发送时间
            type: 'datetime'
        },
        type: { //类型(0:系统 1:第三方接口)
            type: 'integer'
        },
        userId: { //系统用户
            type: 'integer'
        },
        appId: { //第三方APPID
            type: 'string'
        }
    }
};