import dotenv from 'dotenv'
import qrcode from 'qrcode-terminal'
import { Client, LocalAuth, Message } from 'whatsapp-web.js'
import slugify from 'slugify'
import { handleInsertParticipantList } from './ParticipantList/controllers/handleInsertParticipantList'

dotenv.config()

const client = new Client({
  authStrategy: new LocalAuth()
})

client.on('qr', qr => {
  qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
  console.log('Client is ready!')
})

const BOT_NUMBER = '5524999467266'

let participants: any[] = []
let present: string[] = []
let absent: string[] = []
let currentlyCalled: any = null
let groupName = ''

function reset() {
  participants = []
  present = []
  absent = []
  currentlyCalled = null
  groupName = ''
}

function callNextParticipant(message: Message) {
  const participant = participants.shift()

  if (participant) {
    client.sendMessage(
      message.from,
      `@${participant.id.user} está presente? Responda ':sim' ou ':não'`,
      { mentions: [participant] }
    )
  }

  return participant
}

client.on('message', async (message: Message) => {
  const content = message.body.trim()

  /* ==============================
     INICIAR LISTA
  ============================== */
  if (content.match(/^:Lista\s.+/i)) {
    reset()

    const chats = await client.getChats()
    const groupNameTyped = content.replace(/^:Lista\s/i, '')
    groupName = groupNameTyped

    const myGroup: any = chats.find(
      chat => chat.isGroup && chat.name === groupName
    )

    if (!myGroup) {
      client.sendMessage(message.from, 'Grupo não encontrado')
      return
    }

    for (const participant of myGroup.groupMetadata.participants) {
      if (participant.id.user !== BOT_NUMBER) {
        participants.push(participant)
      }
    }

    if (participants.length === 0) {
      client.sendMessage(message.from, 'Nenhum participante encontrado')
      return
    }

    currentlyCalled = callNextParticipant(message)
    return
  }

  /* ==============================
     RESPONDER PRESENÇA
  ============================== */
  if (content === ':sim' || content === ':não') {
    if (!currentlyCalled) return

    // garante que só quem foi chamado pode responder
    if (message.author !== `${currentlyCalled.id.user}@c.us`) return

    if (content === ':sim') {
      present.push(currentlyCalled.id.user)
    } else {
      absent.push(currentlyCalled.id.user)
    }

    if (participants.length === 0) {
      const date = new Date().toLocaleDateString('pt-BR')

      await handleInsertParticipantList({
        item: {
          present,
          absent,
          date,
          groupName,
          slug: slugify(`lista ${groupName} ${date}`, {
            lower: true,
            strict: true
          })
        }
      })

      client.sendMessage(message.from, 'Fim da Lista')
      reset()
    } else {
      currentlyCalled = callNextParticipant(message)
    }
  }
})

client.initialize()