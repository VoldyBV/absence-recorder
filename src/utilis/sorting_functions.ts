import IAbsenceRecord from "../models/absence_record.interface";
const compareDates = (a: IAbsenceRecord, b: IAbsenceRecord): number => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
};
  // Function to compare member names
const compareNames = (a: IAbsenceRecord, b: IAbsenceRecord): number => {
    if (a.member!.full_name < b.member!.full_name) return -1;
    if (a.member!.full_name > b.member!.full_name) return 1;
    return 0;
};
  // Function to compare member groups
const compareGroups = (a: IAbsenceRecord, b: IAbsenceRecord): number => {
    if (a.member!.group < b.member!.group) return -1;
    if (a.member!.group > b.member!.group) return 1;
    return 0;
};
// for export
const SortAbsenceRecords = (a: IAbsenceRecord, b: IAbsenceRecord): number => {
    const dateComparison: number = compareDates(a, b);
    const nameComparison: number = compareNames(a, b);
    const groupComparison: number = compareGroups(a, b);

    if(dateComparison !== 0) return dateComparison;
    if(nameComparison !== 0) return nameComparison;
    return groupComparison;
}
export {
    SortAbsenceRecords
}