export function classNames(condition: boolean, classNamesTrue: string, classNamesFalse?: string) {
    return condition ? classNamesTrue : classNamesFalse ?? ""
}
