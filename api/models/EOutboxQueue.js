///e_outbox_queue 发件箱队列实体
module.exports = {
    tableName: 'e_outbox_queue',
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        outboxId: {
            type: 'integer'
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
        sendTime: { //设定发送时间
            type: 'datetime'
        },
        isTime: { //是否为定时任务
            type: 'integer'
        }
    }
};