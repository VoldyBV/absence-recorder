export default interface IMember {
    _id?: string,
    full_name: string,
    group: string,
    grade: string,
    phone: string
}
export const isMember = (obj: any): obj is IMember => {
    return (obj as IMember).full_name !== undefined;
}