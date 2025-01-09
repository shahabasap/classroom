
export enum NotificationTypeEnum{
    EXAM = 'exam',
    WORK = 'work',
    MATERIAL = 'material',
    CUSTOME = 'custume'
}
export interface AnnouncementsSchema{
    _id?: string,
    classroom_id: string,
    type:NotificationTypeEnum,
    content: string,
    pinned:boolean,
    important:boolean,
    createdAt:Date
}