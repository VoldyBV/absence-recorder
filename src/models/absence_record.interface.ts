import IMember from "./member.interface"

export default interface IAbsenceRecord {
    _id?: string,
    date: string,
    isExcused: string,
    notes: string,
    memberID: string,
    member: IMember
}

export const isAbsenceRecord = (obj: unknown): obj is IAbsenceRecord => {
    return (obj as IAbsenceRecord).date !== undefined;
}