import IMember from "./member.interface"

export default interface IAbsenceRecord {
    date: string,
    isExcused: string,
    notes: string,
    memberID: string,
    member: IMember
}