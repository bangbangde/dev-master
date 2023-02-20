export interface IReq {
  url: string
  method: string
  headers: Record<string, string>
  body: string
}

export interface IRes {}

export const bypass = async (req: IReq): Promise<IRes> => {
  return new Promise((resolve, reject) => {
    resolve({})
  })
}
