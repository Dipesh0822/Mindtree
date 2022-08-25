// ** Types
import { ProfileUserType, ChatsObj, ContactType, MsgFeedbackType } from 'src/types/apps/chatTypes'

export type ChatLogType = {
  hidden: boolean
  data: {
    chat: ChatsObj
    contact: ContactType
    userContact: ProfileUserType
  }
}

export type FeedbackType = MsgFeedbackType

export type MessageType = {
  time: string | Date
  message: string
  senderId: number
  feedback: MsgFeedbackType
}

export type ChatType = {
  msg: string
  time: string | Date
  feedback: MsgFeedbackType
}

export type FormattedChatsType = {
  senderId: number
  messages: ChatType[]
}

export type MessageGroupType = {
  senderId: number
  messages: ChatType[]
}
