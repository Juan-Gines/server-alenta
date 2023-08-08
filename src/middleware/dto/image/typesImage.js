import { numberDTOSchema, stringDTOSchema } from '#DTO/typesGeneral.js'

export const imageNameDTOSchema = stringDTOSchema(4, 50)
export const pathDTOSquema = stringDTOSchema(4, 50)
export const bytesDTOSquema = numberDTOSchema(10, 2048)
