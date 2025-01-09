
export interface PrivateChatSchema  {
    _id:string,
    classroom_id: string,
    sender_name: string,
    sender_id: string,
    receiver_name: string,
    receiver_id: string,
    message: string,
    type: string,
    sender_role: string,
    read: boolean,
    createdAt:string
}