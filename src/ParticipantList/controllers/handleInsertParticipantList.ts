import { Axios } from '../../base/providers/Axios'
import { ParticipantList } from '../models/ParticipantList'
import { insertParticipantList } from '../services/insertParticipantList'

interface HandleInsertParticipantListParams {
  item: ParticipantList
}

async function handleInsertParticipantList({
  item,
}: HandleInsertParticipantListParams): Promise<void> {
  const baseURL = process.env.INSERT_PARTICIPANT_LIST_URL

  if (!baseURL) {
    throw new Error('INSERT_PARTICIPANT_LIST_URL não definida')
  }

  const insertParticipantListApi = new Axios({
    baseURL,
  })

  await insertParticipantList({
    api: insertParticipantListApi,
    item,
  })
}

export { handleInsertParticipantList }