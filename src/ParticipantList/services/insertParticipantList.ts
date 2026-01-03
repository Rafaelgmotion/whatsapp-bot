import { ApiInsertAble } from '../../base/Api'
import { ParticipantList } from '../models/ParticipantList'

interface InsertParticipantListParams {
  api: ApiInsertAble
  item: ParticipantList
}

async function insertParticipantList({
  api,
  item,
}: InsertParticipantListParams): Promise<void> {
  const response = await api.post<void>({
    endpoint: '/',
    data: item,
  })

  if (response.error || response.status >= 400) {
    throw response.error ?? new Error('Erro ao inserir lista de participantes')
  }
}

export { insertParticipantList }